
### 采用docker部署3台Redis分布式红锁实例

``` 
docker run -p 6381:6379 --name redis-master-1 -d redis:5.0.7
docker run -p 6382:6379 --name redis-master-2 -d redis:5.0.7
docker run -p 6383:6379 --name redis-master-3 -d redis:5.0.7


[root@node2 ~]# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                               NAMES
1e6e3900e68c        redis:5.0.7         "docker-entrypoint.s…"   13 seconds ago      Up 11 seconds       0.0.0.0:6383->6379/tcp              redis-master-3
1b9030d50927        redis:5.0.7         "docker-entrypoint.s…"   19 seconds ago      Up 16 seconds       0.0.0.0:6382->6379/tcp              redis-master-2
c86403dcb3d8        redis:5.0.7         "docker-entrypoint.s…"   32 seconds ago      Up 29 seconds       0.0.0.0:6381->6379/tcp              redis-master-1


# 进入redis
docker exec -it redis-master-1 bash
# redis-cli
# 127.0.0.1:6379> 
```







### 4.案例实战: 基于3台redis 实现分布式红锁
#### 步骤1：改配置文件加入3台redis
``` 
spring.redis.database=0
spring.redis.password=
spring.redis.timeout=3000
#sentinel/cluster/single
spring.redis.mode=single

spring.redis.pool.conn-timeout=3000
spring.redis.pool.so-timeout=3000
spring.redis.pool.size=10

spring.redis.single.address1=192.168.1.138:6381
spring.redis.single.address2=192.168.1.138:6382
spring.redis.single.address3=192.168.1.138:6383
```
#### 步骤2：红锁逻辑代码
``` 
@GetMapping(value = "/redlock")
public void getlock() {
    //CACHE_KEY_REDLOCK为redis 分布式锁的key
    RLock lock1 = redissonClient1.getLock(CACHE_KEY_REDLOCK);
    RLock lock2 = redissonClient2.getLock(CACHE_KEY_REDLOCK);
    RLock lock3 = redissonClient3.getLock(CACHE_KEY_REDLOCK);

    RedissonRedLock redLock = new RedissonRedLock(lock1, lock2, lock3);
    boolean isLock;
    try {

        //waitTime 锁的等待时间处理,正常情况下 等5s
        //leaseTime的租约时间，就是redis key的过期时间,正常情况下等5分钟。
        isLock = redLock.tryLock(1000*5, 1000*60*5, TimeUnit.MILLISECONDS);
        log.info("线程{}，是否拿到锁：{} ",Thread.currentThread().getName(),isLock);
        if (isLock) {
            //TODO if get lock success, do something;
            Thread.sleep(1000*60*30);
        }
    } catch (Exception e) {
        log.error("redlock exception ",e);
    } finally {
        // 无论如何, 最后都要解锁
        redLock.unlock();
    }
}
```
#### 步骤3：测试体验
用ie浏览器：http://192.168.1.4:9090/redlock
``` 
2020-03-08 16:35:03.642  INFO 78694 --- [nio-9090-exec-1] c.a.redis.controller.RedLockController   : 线程http-nio-9090-exec-1，是否拿到锁：true 
2020-03-08 16:35:10.310  INFO 78694 --- [nio-9090-exec-2] c.a.redis.controller.RedLockController   : 线程http-nio-9090-exec-2，是否拿到锁：false 
2020-03-08 16:35:11.448  INFO 78694 --- [nio-9090-exec-3] c.a.redis.controller.RedLockController   : 线程http-nio-9090-exec-3，是否拿到锁：false 
2020-03-08 16:35:12.230  INFO 78694 --- [nio-9090-exec-4] c.a.redis.controller.RedLockController   : 线程http-nio-9090-exec-4，是否拿到锁：false 
2020-03-08 16:35:13.282  INFO 78694 --- [nio-9090-exec-5] c.a.redis.controller.RedLockController   : 线程http-nio-9090-exec-5，是否拿到锁：false 
2020-03-08 16:35:38.881  INFO 78694 --- [nio-9090-exec-7] c.a.redis.controller.RedLockController   : 线程http-nio-9090-exec-7，是否拿到锁：false 
```

