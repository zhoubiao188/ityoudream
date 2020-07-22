
### 八、剖析SpringSession的redis原理

#### 步骤1：分析SpringSession的redis数据结构
``` 
127.0.0.1:6379> keys *
1) "spring:session:expirations:1578227700000"
2) "spring:session:sessions:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"
3) "spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"
```
共同点：3个key都是以spring:session:开头的，代表了SpringSession的redis数据。
"spring:session:sessions:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"

``` 
127.0.0.1:6379> type "spring:session:sessions:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"
hash
```
127.0.0.1:6379> hgetall "spring:session:sessions:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"

//失效时间 100分钟
1) "maxInactiveInterval"
2) "\xac\xed\x00\x05sr\x00\x11java.lang.Integer\x12\xe2\xa0\xa4\xf7\x81\x878\x02\x00\x01I\x00\x05valuexr\x00\x10java.lang.Number\x86\xac\x95\x1d\x0b\x94\xe0\x8b\x02\x00\x00xp\x00\x00\x17p"

// sesson的属性，存储了user对象
3) "sessionAttr:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"
4) "\xac\xed\x00\x05sr\x00\x1ecom.agan.redis.controller.User\x16\"_m\x1b\xa0W\x7f\x02\x00\x03I\x00\x02idL\x00\bpasswordt\x00\x12Ljava/lang/String;L\x00\busernameq\x00~\x00\x01xp\x00\x00\x00\x01t\x00\x05agan1q\x00~\x00\x03"

// session的创建时间
5) "creationTime"
6) "\xac\xed\x00\x05sr\x00\x0ejava.lang.Long;\x8b\xe4\x90\xcc\x8f#\xdf\x02\x00\x01J\x00\x05valuexr\x00\x10java.lang.Number\x86\xac\x95\x1d\x0b\x94\xe0\x8b\x02\x00\x00xp\x00\x00\x01ouW<K"

//最后的访问时间
7) "lastAccessedTime"
8) "\xac\xed\x00\x05sr\x00\x0ejava.lang.Long;\x8b\xe4\x90\xcc\x8f#\xdf\x02\x00\x01J\x00\x05valuexr\x00\x10java.lang.Number\x86\xac\x95\x1d\x0b\x94\xe0\x8b\x02\x00\x00xp\x00\x00\x01ouW<L"

#### 步骤2：分析SpringSession的redis过期策略
对于过期数据，一般有三种删除策略：
1. 定时删除，即在设置键的过期时间的同时，创建一个定时器， 当键的过期时间到来时，立即删除。
2. 惰性删除，即在访问键的时候，判断键是否过期，过期则删除，否则返回该键值。
3. 定期删除，即每隔一段时间，程序就对数据库进行一次检查，删除里面的过期键。至于要删除多少过期键，以及要检查多少个数据库，则由算法决定。
​redis 删除过期数据采用的是懒性删除+定期删除组合策略，也就是数据过期了并不会及时被删除。  
但由于redis是单线程，并且redis对删除过期的key优先级很低；如果有大量的过期key，就会出现key已经过期但是未删除。  

为了实现 session 过期的及时性，spring session 采用了定时删除+惰性删除的策略。
##### 定时删除
"spring:session:expirations:1578227700000"
``` 
127.0.0.1:6379> type "spring:session:expirations:1578228240000"
set
127.0.0.1:6379> smembers "spring:session:expirations:1578228240000"
1) "\xac\xed\x00\x05t\x00,expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"
```
springsession 定时（1分钟）轮询，删除spring:session:expirations:[?] 的过期members
例如：spring:session:expirations:1578228240000 的1578228240000=2020-01-05 20:44:00:000 即在2020-01-05 20:44:00:000过期。
springsesion 定时检测超过2020-01-05 20:44:00:000 就删除spring:session:expirations:1578228240000的members的值
sessionId=5eddb9a3-5b1e-4bdd-a289-394b6d42388e
即删除
``` 
1) "spring:session:expirations:1578228240000"
2) "spring:session:sessions:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"
3) "spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"
```
##### 惰性删除
spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e
``` 
127.0.0.1:6379> type spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e
string
127.0.0.1:6379> get spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e
""
127.0.0.1:6379> ttl spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e
(integer) 4719
```

访问 spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e的时候，判断key是否过期，过期则删除，否则返回改进的值。
例如 访问spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e的时候
判断 ttl spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e是否过期，过期就直接删除 
``` 
1) "spring:session:expirations:1578228240000"
2) "spring:session:sessions:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"
3) "spring:session:sessions:expires:5eddb9a3-5b1e-4bdd-a289-394b6d42388e"
```






