### 3.分布式红锁的leaseTime的设计原理

提前做2个动作:
1.先把3台 redis key全部清空（为了不受debug干扰，必须先删除锁）
127.0.0.1:6379> flushdb
OK

都设置为30分钟超时 过期
2.isLock = redLock.tryLock(1000*60*30, 1000*60*30, TimeUnit.MILLISECONDS);


leaseTime就是租约时间，就是redis key的过期时间。
``` java
long newLeaseTime = -1;
if (leaseTime != -1) {
    if (waitTime == -1) {
        newLeaseTime = unit.toMillis(leaseTime);
    } else {
        newLeaseTime = unit.toMillis(waitTime)*2;
    }
}
```
为什么要新建一个newLeaseTime？而且还是unit.toMillis(waitTime)*2 ？？ 关于这个newLeaseTime我思考了很久，花了我一个下午的时间才研究透！
1.先新建一个临时的leasetime ,用(waitTime)*2
2.把临时的leasetime设置到tryLockInnerAsync 
``` 
redis.call('pexpire', KEYS[1], ARGV[1]);
```

### 临时的LeaseTime
for循环执行完后tryLockInnerAsync 后，看下3台redis实例，看下剩余时间是多少，都是60分钟
``` 
127.0.0.1:6379> ttl MY_REDLOCK
(integer) 3494
```



### 真实的LeaseTime
最后再重新设置真实的LeaseTime
``` java
if (leaseTime != -1) {
            List<RFuture<Boolean>> futures = new ArrayList<>(acquiredLocks.size());
            for (RLock rLock : acquiredLocks) {
                RFuture<Boolean> future = ((RedissonLock) rLock).expireAsync(unit.toMillis(leaseTime), TimeUnit.MILLISECONDS);
                futures.add(future);
            }
            
            for (RFuture<Boolean> rFuture : futures) {
                rFuture.syncUninterruptibly();
            }
        }
```
``` 
127.0.0.1:6379> ttl MY_REDLOCK
(integer) 1665
```
总结：
这种设计的好处就是避免了前面代码在执行过程中，损失了leasetime,导在leasetime精度丢失。
所以用了一个newLeaseTime先设置一个临时的过期时间；
最后在结束的时候再重新设置了leasetime，保证代码逻辑的严谨性，这种代码的严谨性，真是值得我们去学习。

今后大家在写过期时间的时候，如果复杂度高的话，建议在代码的最后再重新设置过期时间，保证精度不丢失。

