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
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `nickname` varchar(50) NOT NULL DEFAULT '' COMMENT '用户名',
  `sex` int NOT NULL DEFAULT '0' COMMENT '性别 0=女 1=男 ',
  `age` int unsigned NOT NULL DEFAULT '0' COMMENT '年龄',
  `flag` int unsigned NOT NULL DEFAULT '0' COMMENT '0正常, 1删除',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8 COMMENT='用户表';

SET FOREIGN_KEY_CHECKS = 1;
```

### 步骤四: 编写UserService

```java
public interface UserSerivce {
    /**
     * 根据传入的Users对象创建用户
     * @param obj
     */
   void createUser(Users obj);


    /**
     * 根据传入的Users对象更新用户信息
     * @param obj
     */
   void updateUser(Users obj);

    /**
     * 根据用户传入的用户id查询用户信息
     * @param userId
     * @return
     */
   Users findByUserId(Integer userId);
}

```

```java
@Slf4j
@Service
public class UserServiceImpl implements UserSerivce {
    @Autowired
    private UsersMapper usersMapper;

    @Autowired
    private RedisTemplate redisTemplate;

    private static final String CACHE_KEY_USER = "user:";
    @Override
    public void createUser(Users obj) {
        /**
         * 通过传入的obj对象，向数据库插入数据
         */
        this.usersMapper.insertSelective(obj);

        /**
         * 组装Redis的key
         * redis中一般key都是xxxx:xxx这种格式的
         */
        String key = CACHE_KEY_USER + obj.getId();

        /**
         * String类型使用opsForValue来操作
         * 这里的set相当于redis的的set的命令
         */
        obj = this.usersMapper.selectByPrimaryKey(obj.getId());
        redisTemplate.opsForValue().set(key,obj);
    }

    @Override
    public void updateUser(Users obj) {
        /**
         * 更新先更新数据库的数据，然后再缓存
         */
        this.usersMapper.updateByPrimaryKeySelective(obj);

        /**
         * 组装Rdis的key
         */
        String key = CACHE_KEY_USER + obj.getId();

        /**
         * 先将数据查询出来，然后再更新到redis中
         * 这里注意的是redis没有update命令，都是重新设置值
         */
        obj = this.usersMapper.selectByPrimaryKey(obj.getId());
        redisTemplate.opsForValue().set(key, obj);
    }

    @Override
    public Users findByUserId(Integer userId) {
        /**
         * 这里是获取redis中所有的数据集合
         */
        ValueOperations<String, Users> operations = redisTemplate.opsForValue();

        /**
         * 组装Redis的key
         */
        String key = CACHE_KEY_USER + userId;

        /**
         * 先去redis中查询，如果没有，再到数据库中去查询
         */
        Users user =  operations.get(key);

        if (user == null) {
            user = this.usersMapper.selectByPrimaryKey(userId);
            /**
             * 查询到数据后，再次将数据缓冲到redis中
             */
            operations.set(key, user);
        }

        return user;
    }
}
```

### 步骤五：编写RedisContrller

```java
@Api(tags = {"redis缓存测试"})
@RestController
@RequestMapping("/user")
public class    UserController {
    @Autowired
    private UserSerivce userSerivce;

    @ApiOperation("向数据库初始化100条数据")
    @GetMapping("/init")
    public void init() {
        for(int i = 0; i < 100; i ++) {
            Random rand = new Random();
            Users users = new Users();
            String tempprefix = "girl" + i;
            users.setNickname(tempprefix);
            int n  = rand.nextInt(2);
            int age = rand.nextInt(6) + 5;
            users.setSex(n);
            users.setAge(age);
            userSerivce.createUser(users);
        }
    }

    @ApiOperation("根据用户id查询某条数据")
    @GetMapping("/findByUser/{id}")
    public UsersDTO findByUserId(@PathVariable int id) {
        Users users = this.userSerivce.findByUserId(id);
        UsersDTO usersDTO = new UsersDTO();
        BeanUtils.copyProperties(users, usersDTO);
        return usersDTO;
    }

    @ApiOperation("修改某条数据")
    @PutMapping("/updateUser")
    public void updateUser(@RequestBody UsersDTO obj) {
        Users users = new Users();
        BeanUtils.copyProperties(obj, users);
        this.userSerivce.updateUser(users);
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









