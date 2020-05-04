### springboot redis序列化问题

上一张，我们使用的是JDK默认实现的序列化Serializable，redis数据必须序列化为Serializable,但是这样非常的不美观，非常的难看，在redis里面完全就是乱码了，那么我们就要优化redis的序列化了

### 重写redis的序列化，使用json的方式，更美观清爽
那么我们为什么要使用Json方式来序列化redis呢？
原因非常的简单，我们使用的是RedisTemplate的这个类来操作的redis，这个类默认使用的是JdkSerializationRedisSerializer，这个接口在序列化的时候会出现两个问题：
1. 被序列化的对象必须实现Serializable接口
```java
public class User implements  Serializable
```
2. 被序列化会出现乱码，key和value非常的长，不美观，可读性差
``` 
127.0.0.1:6379> keys *
  1) "\xac\xed\x00\x05t\x00\auser:62"
  2) "\xac\xed\x00\x05t\x00\auser:65"
  3) "\xac\xed\x00\x05t\x00\auser:50"
  4) "\xac\xed\x00\x05t\x00\auser:36"
  5) "\xac\xed\x00\x05t\x00\x06user:6"
  6) "\xac\xed\x00\x05t\x00\auser:17"
  7) "\xac\xed\x00\x05t\x00\auser:28"
  
127.0.0.1:6379> get "\xac\xed\x00\x05t\x00\auser:62"
"\xac\xed\x00\x05sr\x00\x1acom.agan.redis.entity.User?\xebU\xa1\xe2\xa6\xfe\xe3\x02\x00\aL\x00\ncreateTimet
\x00\x10Ljava/util/Date;L\x00\adeletedt\x00\x10Ljava/lang/Byte;L\x00\x02idt\x00\x13Ljava/lang/Integer;L\x00
\bpasswordt\x00\x12Ljava/lang/String;L\x00\x03sexq\x00~\x00\x02L\x00\nupdateTimeq\x00~\x00\x01L\x00\buser
nameq\x00~\x00\x04xpsr\x00\x0ejava.util.Datehj\x81\x01KYt\x19\x03\x00\x00xpw\b\x00\x00\x01o+5\x1d\xf8xsr
\x00\x0ejava.lang.Byte\x9cN`\x84\xeeP\xf5\x1c\x02\x00\x01B\x00\x05valuexr\x00\x10java.lang.Number\x86\xac
\x95\x1d\x0b\x94\xe0\x8b\x02\x00\x00xp\x00sr\x00\x11java.lang.Integer\x12\xe2\xa0\xa4\xf7\x81\x878\x02\x00
\x01I\x00\x05valuexq\x00~\x00\t\x00\x00\x00>t\x00\x04un59q\x00~\x00\nsq\x00~\x00\x06w\b\x00\x00\x01o+5\x1d
\xf8xt\x00\x04un59"
```

### 在上节代码中新增config文件夹，创建一个RedisConfiguration类
```java
@Configuration
public class RedisConfiguration {
    /**
     * 重写Redis序列化方式，使用Json方式:
     * 当我们的数据存储到Redis的时候，我们的键（key）和值（value）都是通过Spring提供的Serializer序列化到Redis的。
     * RedisTemplate默认使用的是JdkSerializationRedisSerializer，
     * StringRedisTemplate默认使用的是StringRedisSerializer。
     *
     * Spring Data JPA为我们提供了下面的Serializer：
     * GenericToStringSerializer、Jackson2JsonRedisSerializer、
     * JacksonJsonRedisSerializer、JdkSerializationRedisSerializer、
     * OxmSerializer、StringRedisSerializer。
     * 在此我们将自己配置RedisTemplate并定义Serializer。
     */
    @Bean
    public RedisTemplate<String, Object> redisTemplate(RedisConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory);
        //创建一个json的序列化对象
        GenericJackson2JsonRedisSerializer jackson2JsonRedisSerializer = new GenericJackson2JsonRedisSerializer();
        //设置value的序列化方式json
        redisTemplate.setValueSerializer(jackson2JsonRedisSerializer);
        //设置key序列化方式string
        redisTemplate.setKeySerializer(new StringRedisSerializer());

        //设置hash key序列化方式string
        redisTemplate.setHashKeySerializer(new StringRedisSerializer());
        //设置hash value的序列化方式json
        redisTemplate.setHashValueSerializer(jackson2JsonRedisSerializer);
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }
}
```

### 体验效果
1. 先把user的序列化删除
2. 创建类RedisConfiguration
3. flushdb 清空redis的旧数据，因为改了序列化，老数据以及不能兼容了，必须清空旧数据
4. 往redis 初始化100条数据
5. 用 keys *   命令查看所有key

```
 keys *
  1) "zb:1203"
  2) "zb:1236"
  3) "zb:1255"
  4) "zb:1222"
  5) "zb:1207"
  6) "zb:1289"
  7) "zb:1268"
  8) "zb:1261"
  9) "zb:1224"
 get zb:1224
"{\"@class\":\"com.ityoudream.model.User\",\"id\":1224,\"nickname\":\"girl23\",\"age\":7,\"sex\":1}"
```
### 总结
我们重写redis序列化为Json后，key和value变的十分简洁和清爽，可以说比之前的好看了几百倍，并且这种序列化方式在我们平常的开发过程中是十分常用的，没有人会使用默认的jdk序列化，所以这种序列化方式也是我们必须掌握的，代码十分的简单，相信大家都能掌握。
