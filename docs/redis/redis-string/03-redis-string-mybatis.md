# spring boot 和 redis集成

### 步骤一：pom文件引入redis依赖包
``` xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
    <version>2.2.6.RELEASE</version>
</dependency>

```

### 步骤二：配置文件(application.yml)加入redis配置信息
```
## Redis 配置
## Redis数据库索引（默认为0）
spring.redis.database=0
## Redis服务器地址
spring.redis.host=192.168.1.138
## Redis服务器连接端口
spring.redis.port=6379
## Redis服务器连接密码（默认为空）
spring.redis.password=

```

### 步骤三：在mysql中导入sql文件

```sql
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nickname` varchar(50) NOT NULL DEFAULT '' COMMENT '用户名',
  `sex` int(1) NOT NULL DEFAULT '0' COMMENT '性别 0=女 1=男 ',
  `age` int(5) unsigned NOT NULL DEFAULT '0' COMMENT '年龄',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8 COMMENT='用户表';

```

### 步骤四: 编写UserService

```java
@Service
public class RedisServiceImpl implements RedisService {
    @Autowired
    private UserMapper redisDao;

    @Autowired
    private RedisTemplate redisTemplate;

    private static final String CHECK_USER_KEY = "zb:";
    @Override
    public void createUser(UserDTO userDto) {
        User redisEntity =  new User();
        BeanUtils.copyProperties(userDto, redisEntity);
        redisDao.insertSelective(redisEntity);

        //缓冲key
        String key = CHECK_USER_KEY + redisEntity.getId();
        redisEntity = redisDao.selectByPrimaryKey(redisEntity.getId());
        redisTemplate.opsForValue().set(key, redisEntity);


    }

    @Override
    public void updateUser(UserDTO userDto) {
        //先更新数据库，然后在缓存到redis
        User user = new User();
        BeanUtils.copyProperties(userDto, user);
        this.redisDao.updateByPrimaryKeySelective(user);
        String key = CHECK_USER_KEY + user.getId();
        user = this.redisDao.selectByPrimaryKey(user.getId());
        this.redisTemplate.opsForValue().set(key, user);
    }

    @Override
    public UserDTO selectUserById(Integer id) {
        ValueOperations<String, User> operations = redisTemplate.opsForValue();
        //缓冲key
        String key = CHECK_USER_KEY + id;
        //去redis中去查询
        User user = operations.get(key);
        UserDTO userdto = new UserDTO();
        if (user != null) {
            BeanUtils.copyProperties(user, userdto);
        }

        if (user == null) {
            user = redisDao.selectByPrimaryKey(id);
            //将数据库查询的数据 set到redis
            operations.set(key, user);
        }
        return userdto;
    }
}
\
```

### 步骤五：编写RedisContrller

```java
@RestController
@Api(tags = "redis增删改查")
public class RedisController {
    @Autowired
    private RedisService redisService;
    @GetMapping("/create")
    @ApiOperation("数据库初始化100条数据")
    public void initData() {
        for (int i = 0; i < 100; i ++) {
            String tempName = "girl" + i;
            Random r = new Random();
            int n = r.nextInt(2);
            int age = r.nextInt(6) + 5;
            UserDTO redisDto = new UserDTO();
            redisDto.setSex(n);
            redisDto.setAge(age);
            redisDto.setNickname(tempName);
            redisService.createUser(redisDto);
        }
    }

    @GetMapping("/findByUser/{id}")
    @ApiOperation("查询数据")
    public UserDTO findByUserId(@PathVariable int id) {
        UserDTO redisStringMybatisDTO = redisService.selectUserById(id);
        return redisStringMybatisDTO;
    }

    @PostMapping("/updateUser")
    @ApiOperation("更新数据")
    public void updateUser(@RequestBody UserDTO userDTO) {
        this.redisService.updateUser(userDTO);
    }

}

```
### 步骤六 体验效果
体验效果之前一定要启动redis，启动命令如下:
```
redis-server /usr/local/etc/redis.conf
```
我们使用Swagger来测试：

![](/redis-img/initdata.png)

我们点击Execute 执行，然后发现报错了：

![](/redis-img/error-insert.png)

这个意思是说，要想把数据放到redis中，必须对这个User的JavaBean进行序列化，那么我们在User上实现Serializable接口

```java

@Data
public class User implements Serializable {
    /**
    * id
    */
    private Integer id;

    /**
    * 名称
    */
    private String nickname;

    /**
    * 年龄
    */
    private Integer age;

    /**
    * 性别
    */
    private Integer sex;
}

```

需要注意的是这里的序列化默认使用的是JDK序列化，我们再次执行Execute就成功了，然后我们在redis中看下数据：

![](/redis-img/show-redis.png)

这就是JDK默认的序列化，非常不好看，后面我们可以实现Redis的序列化操作，让数据更好的查看，
然后我们查询数据：

![](/redis-img/findById.png)

我们查询id为1101的数据，我们通过后台Mybatis日志发现第一次的时候是从数据库查询的：

![](/redis-img/log_find.png)

当我们再次查询1101这条数据的时候，我们发现Mybatis并没有输出日志，而是从redis中得到的数据：

![](/redis-img/log_find2.png)


![](/redis-img/find_result.png)

下面我们来修改数据：

![](/redis-img/updateRedis.png)

我们要修改的是原来1101的数据，我们看下原来的数据：

![](/redis-img/oldFind.png)

当我们点击Execute 执行后，就修改了原来的旧数据：

![](/redis-img/newFind.png)

最终我们再去查询1101的数据：

![](/redis-img/findById.png)

最终结果是从redis中得到的数据：

![](/redis-img/findRedis.png)

### 总结
在SpringBoot中集成Redis十分简单，本案例没有任何复杂的代码，相比传统的sql查询，redis在海量数据中脱颖而出。

### 留下的问题？
之前我们遇到一个问题，就是将数据存到redis后，发现乱码，非常的不美观，下一节将解决这个问题。

### 源码下载
<a href="https://github.com/zhoubiao188/redis/tree/master/redis-string-mybatis">github</a>









