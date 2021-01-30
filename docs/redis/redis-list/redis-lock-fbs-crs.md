
### redis如何实现分布式重入锁？
在上一节课中，我们已经知道SETNX是不支持重入锁的，但我们需要重入锁，怎么办呢？
目前对于redis的重入锁业界还是有很多解决方案的，最流行的就是采用Redisson，关于什么是Redisson？下面详细介绍


### 什么是 Redisson？

Redisson是Redis官方推荐的Java版的Redis客户端。
它基于Java实用工具包中常用接口，为使用者提供了一系列具有分布式特性的常用工具类。
它在网络通信上是基于NIO的Netty框架，保证网络通信的高性能。
在分布式锁的功能上，它提供了一系列的分布式锁；如：可重入锁（Reentrant Lock）、公平锁（Fair Lock、联锁（MultiLock）、
红锁（RedLock）、 读写锁（ReadWriteLock）等等。

### 案例实战：体验redis分布式重入锁

#### 步骤1:加入pom依赖包
``` xml
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.9.0</version>
</dependency>
```

#### 步骤2:配置文件
``` 
#redi开关配置 见：封装类 CacheConfiguration
#设置模式 sentinel/cluster/single
spring.redis.mode=single

#redis基础配置 见：封装类 RedisProperties
spring.redis.database=0
spring.redis.password=
spring.redis.timeout=3000

#redis线程池配置  见：封装类 RedisPoolProperties
spring.redis.pool.conn-timeout=3000
spring.redis.pool.so-timeout=3000
spring.redis.pool.size=10

#单机模式 见：封装类 RedisSingleProperties
spring.redis.single.address=192.168.1.138:6379

#集群模式 见：封装类 RedisClusterProperties
spring.redis.cluster.scan-interval=1000
spring.redis.cluster.nodes=192.168.2.58:7000,192.168.2.58:7001,192.168.2.58:7002,192.168.2.58:7003,192.168.2.58:7004,192.168.2.58:7005,192.168.2.58:7006
spring.redis.cluster.read-mode=SLAVE
spring.redis.cluster.retry-attempts=3
spring.redis.cluster.failed-attempts=3
spring.redis.cluster.slave-connection-pool-size=64
spring.redis.cluster.master-connection-pool-size=64
spring.redis.cluster.retry-interval=1500

#哨兵模式 见：RedisSentinelProperties
spring.redis.sentinel.master=business-master
spring.redis.sentinel.nodes=
spring.redis.sentinel.master-onlyWrite=true
spring.redis.sentinel.fail-max=3
```

#### 步骤3:Redisson重入锁代码
``` java
public class RedisController {

    @Autowired
    RedissonClient redissonClient;

    @GetMapping(value = "/lock")
    public void get(String key) throws InterruptedException {
        this.getLock(key, 1);
    }

    private void getLock(String key, int n) throws InterruptedException {
        //模拟递归，3次递归后退出
        if (n > 3) {
            return;
        }
        //步骤1：获取一个分布式可重入锁RLock
        //分布式可重入锁RLock :实现了java.util.concurrent.locks.Lock接口，同时还支持自动过期解锁。
        RLock lock = redissonClient.getLock(key);
        //步骤2：尝试拿锁
        // 1. 默认的拿锁
        //lock.tryLock();
        // 2. 支持过期解锁功能,10秒钟以后过期自动解锁, 无需调用unlock方法手动解锁
        //lock.tryLock(10, TimeUnit.SECONDS);
        // 3. 尝试加锁，最多等待3秒，上锁以后10秒后过期自动解锁
        // lock.tryLock(3, 10, TimeUnit.SECONDS);
        boolean bs = lock.tryLock(3, 10, TimeUnit.SECONDS);
        if (bs) {
            try {
                // 业务代码
                log.info("线程{}业务逻辑处理: {},递归{}" ,Thread.currentThread().getName(), key,n);
                //模拟处理业务
                Thread.sleep(1000 * 5);
                //模拟进入递归
                this.getLock(key, ++n);
            } catch (Exception e) {
                log.error(e.getLocalizedMessage());
            } finally {
                //步骤3：解锁
                lock.unlock();
                log.info("线程{}解锁退出",Thread.currentThread().getName());
            }
        } else {
            log.info("线程{}未取得锁",Thread.currentThread().getName());
        }
    }
}
```


#### 步骤4:体验测试
ie流浪器输入：http://192.168.1.4:9090/lock?key=aganlock
刷新3次 看效果
``` 
2020-03-08 12:19:24.237  INFO 76507 --- [nio-9090-exec-1] c.agan.redis.controller.RedisController  : 线程http-nio-9090-exec-1业务逻辑处理: aganlock,递归1
2020-03-08 12:19:29.069  INFO 76507 --- [nio-9090-exec-2] c.agan.redis.controller.RedisController  : 线程http-nio-9090-exec-2未取得锁
2020-03-08 12:19:29.377  INFO 76507 --- [nio-9090-exec-1] c.agan.redis.controller.RedisController  : 线程http-nio-9090-exec-1业务逻辑处理: aganlock,递归2
2020-03-08 12:19:31.896  INFO 76507 --- [nio-9090-exec-3] c.agan.redis.controller.RedisController  : 线程http-nio-9090-exec-3未取得锁
2020-03-08 12:19:34.579  INFO 76507 --- [nio-9090-exec-1] c.agan.redis.controller.RedisController  : 线程http-nio-9090-exec-1业务逻辑处理: aganlock,递归3
2020-03-08 12:19:39.820  INFO 76507 --- [nio-9090-exec-1] c.agan.redis.controller.RedisController  : 线程http-nio-9090-exec-1解锁退出
2020-03-08 12:19:39.823  INFO 76507 --- [nio-9090-exec-1] c.agan.redis.controller.RedisController  : 线程http-nio-9090-exec-1解锁退出
2020-03-08 12:19:39.827  INFO 76507 --- [nio-9090-exec-1] c.agan.redis.controller.RedisController  : 线程http-nio-9090-exec-1解锁退出
```
通过测试结果：
1.发送了3次请求，springboot启用了3条线程来处理，分别是nio-9090-exec-1 io-9090-exec-2 nio-9090-exec-3
2.nio-9090-exec-1线程，在getLock方法递归了3次,即证明了lock.tryLock是可重入锁
3.只有当nio-9090-exec-1线程执行完后，io-9090-exec-2 nio-9090-exec-3 未取得锁
  因为lock.tryLock(3, 10, TimeUnit.SECONDS)，尝试加锁，最多等待3秒，上锁以后10秒后过期自动解锁
  所以等了3秒都等不到，就放弃了








