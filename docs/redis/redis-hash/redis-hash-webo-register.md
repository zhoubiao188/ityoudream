# 基于Redis的微博的注册

Redis在互联网公司中是必选的技术，因为互联网公司的系统天生就是高并发特征。但是能把redis运用的最好的就属微博了。  
Redis技术基本覆盖了微博的每个应用场景，比如像现在春晚必争的“红包飞”活动，还有像粉丝数、用户数、阅读数、转评赞、评论盖楼、广告推荐、负反馈、音乐榜单等等都有用到 Redis。  
正因为Redis的广泛应用，使得微博能够快速支撑日活跃用户超2亿，每日访问量百亿级，历史数据高达千亿级。   
微博线上规模，100T+ 存储，1000+ 台物理机，10000+Redis 实例  
正因为Redis在微博广泛使用，所有我们针对微博应用场景来学习Redis,我们分为5个阶段来学习。  

### 一、注册微博的redis技术方案



### 二、SpringBoot+Redis 实现微博注册
#### 步骤1：创建user表
``` 
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT '' COMMENT '用户名',
  `password` varchar(50) NOT NULL DEFAULT '' COMMENT '密码',
  `sex` tinyint(4) NOT NULL DEFAULT '0' COMMENT '性别 0=女 1=男 ',
  `deleted` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '删除标志，默认0不删除，1删除',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户表';

SET FOREIGN_KEY_CHECKS = 1;

```
#### 步骤2：注册逻辑
``` 

@Api(description = "用户接口")
@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserService userService;


    @ApiOperation(value="微博注册")
    @PostMapping(value = "/createUser")
    public void createUser(@RequestBody UserVO userVO) {
        User user=new User();
        BeanUtils.copyProperties(userVO,user);
        userService.createUser(user);
    }
}



    /**
     * 微博注册
     */
    public void createUser(User obj) {
        //步骤1：先入库
        this.userMapper.insertSelective(obj);
        //步骤2：入库成功后，写入redis
        obj = this.userMapper.selectByPrimaryKey(obj.getId());
        //将Object对象里面的属性和值转化成Map对象
        Map<String, Object> map = ObjectUtil.objectToMap(obj);
        //设置缓存key
        String key = Constants.CACHE_KEY_USER + obj.getId();

        //微博用户的存储采用reids的hash
        HashOperations<String, String, Object> opsForHash = redisTemplate.opsForHash();
        opsForHash.putAll(key, map);

        //步骤3：设置过期30天
        this.redisTemplate.expire(key, 30, TimeUnit.DAYS);
    }
```

### 三、体验




