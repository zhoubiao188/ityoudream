
#### 采用docker安装RedisBloom

docker run -p 6379:6379 -d --name redis-redisbloom redislabs/rebloom:latest

#### 连接redis
```
docker exec -it redis-redisbloom bash
# redis-cli
# 127.0.0.1:6379> 
```


### 步骤1:  bf.reserve 初始化 设置布隆过滤器的准确率：
BF.RESERVE {key} {error_rate} {capacity}

error_rate：错误率，允许布隆过滤器的错误率，这个值越低 过滤器的位数组的大小越大，占用空间也就越大。
initial_size：储存的元素个数，当实际存储的元素个数超过这个值之后，过滤器的准确率会下降。
```
127.0.0.1:6379> BF.RESERVE filter 0.01 100
OK
```
第一个值是过滤器的名字。
第二个值为 error_rate 的值。
第三个值为 initial_size 的值。

注意：必须在add之前使用bf.reserve指令显式创建，
如果对应的 key 已经存在，bf.reserve会报错。
如果不使用 bf.reserve，默认的error_rate是 0.01，默认的initial_size是 100。

### 步骤2: 简单命令
bf.add 添加元素
bf.exists 查询元素是否存在
bf.madd 一次添加多个元素
bf.mexists 一次查询多个元素是否存在

```
127.0.0.1:6379> bf.add filter foo
(integer) 1
127.0.0.1:6379> bf.exists filter foo
(integer) 1
127.0.0.1:6379> bf.exists filter foo5
(integer) 0


```


### SpringBoot+Redis 推荐引擎已读去重
#### 步骤0：业务分析


#### 步骤1:pom文件加入依赖包
RedisBloom 官方已经封装好了布隆过滤器依赖包
https://github.com/RedisBloom/JRedisBloom

``` 
<dependency>
    <groupId>com.redislabs</groupId>
    <artifactId>jrebloom</artifactId>
    <version>1.2.0</version>
</dependency>
```
#### 步骤2:配置封装
``` 
redis.bloom.url= 192.168.1.138
redis.bloom.port= 6379
redis.bloom.init-capacity= 10000
redis.bloom.error-rate= 0.01

public class RedisConfiguration {

    // 从application.yml文件中引入配置信息
    @Value("${redis.bloom.url:#{null}}")
    private String rebloomUrl;
    @Value("${redis.bloom.port:#{null}}")
    private Integer rebloomPort;
    @Value("${redis.bloom.init-capacity:#{null}}")
    private Integer rebloomInitCapacity;
    @Value("${redis.bloom.error-rate:#{null}}")
    private Double rebloomErrorRate;

    // 导出bean
    @Bean()
    public Client rebloomClient() {
        Client client = new Client(rebloomUrl, rebloomPort);
        // 创建一个新的bloom过滤器
        try{
            //BF.RESERVE {key} {error_rate} {capacity}
            client.createFilter(Constants.REBLOOM, rebloomInitCapacity, rebloomErrorRate);
        }catch (JedisDataException e){
            log.warn("已存在{}",e.getMessage());
        }
        return client;
    }
}

```
#### 步骤3:逻辑代码处理

##### 1.为某个用户 模拟1万条 已读数据
``` java
/**
 * 为某个用户 模拟1万条 已读数据
 */
@GetMapping(value = "/init")
public void init(Integer userid) {
    String [] array=new String[10000];
    for(int i=0;i<10000;i++) {
        array[i]=String.valueOf(i);
    }
    this.rebloomClient.addMulti(Constants.REBLOOM+userid,array);
}
```

##### 2.模拟今天头条的每次推荐 18条数据
``` java

    @Autowired
    private Client rebloomClient ;

    /**
     * 今天头条的每次推荐 18条数据
     */
    final  int SIZE=18;

    /**
     * 拉取18条推荐数据
     */
    @GetMapping(value = "/rebloom")
    public List<Integer> rebloom(String userid) {
        String key=Constants.REBLOOM+userid;
        List<Integer> list=new ArrayList<>();
        while (true){
            //步骤1：到 大数据信息流服务 获取18条数据
            List<Integer>  ids=this.getArticleIds();

            //步骤2：到布隆过滤器 过滤已读的数据
            String [] array=new String[ids.size()];
            for(int i=0;i<ids.size();i++) {
                array[i]=String.valueOf(ids.get(i));
            }
            boolean [] bos=this.rebloomClient.existsMulti(key,array);

            for (int i=0;i<ids.size();i++){
                boolean bo=bos[i];
                //bo=true:布隆过滤器存在， false布隆过滤器不存在
                if(!bo){
                    list.add(ids.get(i));
                }else{
                    log.debug("过滤{}",ids.get(i));
                }
                //达到18条  就退出死循环
                if(list.size()==SIZE){
                    break;
                }
            }
            if(list.size()==SIZE){
                break;
            }
        }

        //步骤3：把本次的数据加入到布隆过滤器里面，代表已读
        String [] array=new String[list.size()];
        for(int i=0;i<list.size();i++) {
            array[i]=String.valueOf(list.get(i));
        }
        this.rebloomClient.addMulti(key,array);
        return list;
    }

    /**
     * 模拟大数据 信息流服务
     * 获取18条数据，
     */
    public List<Integer> getArticleIds() {
        Random rand = new Random();
        List<Integer> list=new ArrayList<>();
        for(int i=0;i<SIZE;i++) {
            int id=rand.nextInt(100000);
            list.add(id);
        }
        return list;
    }
```
