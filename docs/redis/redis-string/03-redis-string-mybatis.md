# spring boot 和 redis集成

### 步骤一：pom文件引入redis依赖包
``` 
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

```
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(50) NOT NULL DEFAULT '' COMMENT '密码',
  `sex` tinyint(4) NOT NULL DEFAULT '0' COMMENT '性别 0=女 1=男 ',
  `deleted` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '删除标志，默认0不删除，1删除',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8 COMMENT='用户表';

```

### 步骤四: 编写UserService

```
@Service
public class UserService {

    private static final Logger LOGGER =  LoggerFactory.getLogger(UserService.class);

    public static final String CACHE_KEY_USER = "user:";

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private RedisTemplate redisTemplate;


    public void createUser(User obj){
        this.userMapper.insertSelective(obj);

        //缓存key
        String key=CACHE_KEY_USER+obj.getId();
        //到数据库里面，重新捞出新数据出来，做缓存
        obj=this.userMapper.selectByPrimaryKey(obj.getId());

        //opsForValue代表了Redis的String数据结构
        //set代表了redis的SET命令
        redisTemplate.opsForValue().set(key,obj);
    }

    public void updateUser(User obj){
        //1.先直接修改数据库
        this.userMapper.updateByPrimaryKeySelective(obj);
        //2.再修改缓存
        //缓存key
        String key=CACHE_KEY_USER+obj.getId();
        obj=this.userMapper.selectByPrimaryKey(obj.getId());
        //修改也是用SET命令，重新设置，Redis 没有update操作，都是重新设置新值
        redisTemplate.opsForValue().set(key,obj);
    }

    public User findUserById(Integer userid){
        ValueOperations<String, User> operations = redisTemplate.opsForValue();
        //缓存key
        String key=CACHE_KEY_USER+userid;
        //1.先去redis查 ，如果查到直接返回，没有的话直接去数据库捞
        //Redis 用了GET命令
        User user=operations.get(key);

        //2.redis没有的话，直接去数据库捞
        if(user==null){
            user=this.userMapper.selectByPrimaryKey(userid);
            //由于redis没有才到数据库捞，所以必须把捞到的数据写入redis，方便下次查询能redis命中。
            operations.set(key,user);
        }
        return user;
    }

}

```

### 步骤五：编写UserContrller

```

@Api(description = "用户接口")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;

    @ApiOperation("数据库初始化100条数据")
    @RequestMapping(value = "/init", method = RequestMethod.GET)
    public void init() {
        for (int i = 0; i < 100; i++) {
            Random rand = new Random();
            User user = new User();
            String temp = "un" + i;
            user.setUsername(temp);
            user.setPassword(temp);
            int n = rand.nextInt(2);
            user.setSex((byte) n);
            userService.createUser(user);
        }
    }

    @ApiOperation("单个用户查询，按userid查用户信息")
    @RequestMapping(value = "/findById/{id}", method = RequestMethod.GET)
    public UserVO findById(@PathVariable int id) {
        User user = this.userService.findUserById(id);
        UserVO userVO = new UserVO();
        BeanUtils.copyProperties(user, userVO);
        return userVO;
    }

    @ApiOperation("修改某条数据")
    @PostMapping(value = "/updateUser")
    public void updateUser(@RequestBody UserVO obj) {
        User user = new User();
        BeanUtils.copyProperties(obj, user);
        userService.updateUser(user);
    }

}

```
