

###  HyperLogLog 命令详解
HyperLogLog 目前只支持3个命令，PFADD、PFCOUNT、PFMERGE
#### PFADD
将元素加入到HyperLogLog数据结构中，如果 HyperLogLog 的基数估算值在命令执行之后出现了变化，那么命令返回1，否则返回0。

#### PFCOUNT
返回给定 HyperLogLog 的基数估算值。
``` 
127.0.0.1:6379> pfadd uv 192.168.1.100 192.168.1.101 192.168.1.102 192.168.1.103
(integer) 1
127.0.0.1:6379> pfadd uv 192.168.1.100
(integer) 0
127.0.0.1:6379> pfcount uv
(integer) 4
```

#### PFMERGE
把多个HyperLogLog合并为一个HyperLogLog，合并后的HyperLogLog的基数是通过所有的HyperLogLog进行并集后，得出来的。
``` 
127.0.0.1:6379> pfadd uv1 192.168.1.100 192.168.1.101 192.168.1.102 192.168.1.103
(integer) 1
127.0.0.1:6379> pfcount uv1
(integer) 4
127.0.0.1:6379> pfadd uv2 192.168.1.100 192.168.2.101 192.168.2.102 192.168.2.103
(integer) 1
127.0.0.1:6379> pfadd uv3 192.168.1.100 192.168.3.101 192.168.3.102 192.168.3.103
(integer) 1
127.0.0.1:6379> pfmerge aganuv uv1 uv2 uv3
OK
127.0.0.1:6379> pfcount aganuv
(integer) 10
```
这个命令很重要，例如你可以统计一周 或 一个月的uv 就可以使用此命令来轻易实现。







### 3.案例实战:基于Redis的UV计算

#### 步骤1：模拟UV访问
``` 
@Service
@Slf4j
public class TaskService {

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     *模拟UV访问
     */
    @PostConstruct
    public void init(){
        log.info("模拟UV访问 ..........");
        new Thread(()->this.refreshData()).start();
    }

    /**
     * 刷新当天的统计数据
     */
    public void refreshDay(){
        Random rand = new Random();
        String ip=rand.nextInt(999)+"."+
                rand.nextInt(999)+"."+
                rand.nextInt(999)+"."+
                rand.nextInt(999);

        //redis 命令 pfadd
        long n=this.redisTemplate.opsForHyperLogLog().add(Constants.PV_KEY,ip);
        log.debug("ip={} , returen={}",ip,n);
    }

    /**
     * 按天模拟UV统计
     */
    public void refreshData(){
        while (true){
            this.refreshDay();
            //TODO 在分布式系统中，建议用xxljob来实现定时
            try {
                Thread.sleep(5000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}
```
#### 步骤2：实现UV统计功能
``` 
@RestController
@Slf4j
public class Controller {

    @Autowired
    private RedisTemplate redisTemplate;
    

    @GetMapping(value = "/uv")
    public long uv() {
        //redis命令 pfcount
        long size=this.redisTemplate.opsForHyperLogLog().size(Constants.PV_KEY);
        return size;
    }

}
```





