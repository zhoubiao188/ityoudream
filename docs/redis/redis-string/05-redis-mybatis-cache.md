# 在spring boot 中使用 springcache

### 一、为什么要用springcache,它解决了什么问题？
springcache 是spring3.1版本发布出来的，他是对使用缓存进行封装和抽象，通过在方法上使用annotation注解就能拿到缓存结果。  
正是因为用了annotation,所以它解决了业务代码和缓存代码的耦合度问题，即再不侵入业务代码的基础上让现有代码即刻支持缓存，  
它让开发人员无感知的使用了缓存。 

特别注意:
（注意：对于redis的缓存，springcache只支持String，其他的Hash 、List、set、ZSet都不支持，要特别注意）

### 二、写代码
#### 步骤1：pom文件加入依赖包
``` xml
<!--redis-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
<!--spring cache-->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
<!--spring cache连接池依赖包-->
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-pool2</artifactId>
    <version>2.6.2</version>
</dependency>
```
#### 步骤2： 配置文件，加入redis配置信息
``` 
## Redis 配置
# Redis数据库索引（默认为0）
spring.redis.database=0  
# Redis服务器地址
spring.redis.host=192.168.1.138
# Redis服务器连接端口
spring.redis.port=6379  
# Redis服务器连接密码（默认为空）
spring.redis.password=
# 连接池最大连接数（使用负值表示没有限制）
spring.redis.lettuce.pool.max-active=8  
# 连接池最大阻塞等待时间
spring.redis.lettuce.pool.max-wait=-1ms
# 连接池中的最大空闲连接
spring.redis.lettuce.pool.max-idle=8  
# 连接池中的最小空闲连接
spring.redis.lettuce.pool.min-idle=0  
# 连接超时时间（毫秒）
spring.redis.timeout=5000ms
```

#### 步骤3：开启缓存配置，设置序列化
重点是开启 @EnableCaching
```java
@Configuration
@EnableCaching
public class RedisConfig {
	@Primary
	@Bean
	public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory){
		RedisCacheConfiguration redisCacheConfiguration = RedisCacheConfiguration.defaultCacheConfig();
		redisCacheConfiguration = redisCacheConfiguration
				//设置缓存的默认超时时间：30分钟
				.entryTtl(Duration.ofMinutes(30L))
				//如果是空值，不缓存
				.disableCachingNullValues()

				//设置key序列化器
				.serializeKeysWith(RedisSerializationContext.SerializationPair.fromSerializer(keySerializer()))
				//设置value序列化器
				.serializeValuesWith(RedisSerializationContext.SerializationPair.fromSerializer(valueSerializer()));

		return RedisCacheManager
				.builder(RedisCacheWriter.nonLockingRedisCacheWriter(redisConnectionFactory))
				.cacheDefaults(redisCacheConfiguration)
				.build();
	}

	/**
	 * key序列化器
	 */
	private RedisSerializer<String> keySerializer() {
		return new StringRedisSerializer();
	}
	/**
	 * value序列化器
	 */
	private RedisSerializer<Object> valueSerializer() {
		return new GenericJackson2JsonRedisSerializer();
	}

}
```
#### 步骤4：逻辑代码

``` java
@Api(tags = "springcache测试")
@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserService userService;
    @ApiOperation("根据用户id查询")
    @GetMapping("/findByUserId/{id}")
    public UsersVo findByUserId(@PathVariable int id) {
        Users user = userService.findUserById(id);
        UsersVo usersVo = new UsersVo();
        BeanUtils.copyProperties(user, usersVo);
        return usersVo;
    }

    @ApiOperation("更新某条数据")
    @PutMapping("/updateUser")
    public void  updateUser(@RequestBody UsersVo obj) {
        Users users = new Users();
        BeanUtils.copyProperties(obj, users);
        userService.updateUser(users);
    }

    @ApiOperation("根据id删除某条数据")
    @DeleteMapping("/del/{id}")
    public void deleteByUserId(@PathVariable int id) {
        this.userService.deleteUser(id);

    }
}
```
UserService
```java
public interface UserService {
    /**
     * 根据用户id查询用户信息
     * @param id
     * @return Users
     */
    Users findUserById(Integer id);

    /**
     * 根据传入的Users对象来更新用户信息
     * @param obj
     * @return
     */
    Users updateUser(Users obj);

    /**
     * 根据传入的用户id来删除用户信息
     * @param id
     */
    void deleteUser(Integer id);
}
```


### 三、剖析SpringCache常用注解
``` java
@Slf4j
@CacheConfig(cacheNames = {"user"})
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UsersMapper usersMapper;

    @Cacheable(key = "#id")
    @Override
    public Users findUserById(Integer id) {
        return this.usersMapper.selectByPrimaryKey(id);
    }

    @CachePut(key = "#obj.id")
    @Override
    public Users updateUser(Users obj) {
        this.usersMapper.updateByPrimaryKeySelective(obj);
        return this.usersMapper.selectByPrimaryKey(obj.getId());
    }

    @CacheEvict(key = "#id")
    @Override
    public void deleteUser(Integer id) {
        Users user = new Users();
        user.setId(id);
        user.setFlag(1);
        this.usersMapper.updateByPrimaryKeySelective(user);
    }
}
```

#### @CacheConfig
@CacheConfig是类级别的注解，统一该类的所有缓存可以前缀。
``` 
@CacheConfig(cacheNames = { "user" })
public class UserService {
```
以上代码，代表了该类的所有缓存可以都是"user::"为前缀

#### @Cacheable
@Cacheable是方法级别的注解，用于将方法的结果缓存起来。
``` 
@Cacheable(key="#id")
public User findUserById(Integer id){
    return this.userMapper.selectByPrimaryKey(id);
}
```
以上方法被调用时，先从缓存中读取数据，如果缓存没有找到数据，再执行方法体，最后把返回值添加到缓存中。

注意：@Cacheable 一般是配合@CacheConfig一起使用的
例如上文的@CacheConfig(cacheNames = { "user" }) 和 @Cacheable(key="#id")一起使用时。
调用方法传入id=100,那redis对应的key=user::100 ,value通过采用GenericJackson2JsonRedisSerializer序列化为json
调用方法传入id=200,那redis对应的key=user::200 ,value通过采用GenericJackson2JsonRedisSerializer序列化为json

#### @CachePut
@CachePut是方法级别的注解，用于更新缓存。
``` 
@CachePut(key = "#obj.id")
public User updateUser(User obj){
    this.userMapper.updateByPrimaryKeySelective(obj);
    return this.userMapper.selectByPrimaryKey(obj.getId());
}
```
以上方法被调用时，先执行方法体，然后springcache通过返回值更新缓存，即key = "#obj.id"，value=User

#### @CacheEvict(key = "#id")
@CachePut是方法级别的注解，用于删除缓存。
``` 
public void deleteUser(Integer id){
    User user=new User();
    user.setId(id);
    user.setDeleted((byte)1);
    this.userMapper.updateByPrimaryKeySelective(user);
}
```
以上方法被调用时，先执行方法体，在通过方法参数删除缓存


### 四、springcache的大坑

1. 对于redis的缓存，springcache只支持String，其他的Hash 、List、set、ZSet都不支持，
   所以对于Hash 、List、set、ZSet只能用RedisTemplate
   
2. 对于多表查询的数据缓存，springcache是不支持的，只支持单表的简单缓存。
   对于多表的整体缓存，只能用RedisTemplate。


### 源码下载
<a href="https://github.com/zhoubiao188/redis/tree/master/redis-string-springcache">github</a>





