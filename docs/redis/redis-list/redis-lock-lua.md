### 分布式红锁的加锁的lua底层设计原理

提前做2个动作:
1.先把3台 redis key全部清空（为了不受debug干扰，必须先删除锁）
127.0.0.1:6379> flushdb
OK

2.isLock = redLock.tryLock(1000*5*30, 1000*60*5*30, TimeUnit.MILLISECONDS);




debug的断点 断在 RedissonLock.tryLockInnerAsync(long leaseTime, TimeUnit unit, long threadId, RedisStrictCommand<T> command) 
``` 
<T> RFuture<T> tryLockInnerAsync(long leaseTime, TimeUnit unit, long threadId, RedisStrictCommand<T> command) {
    internalLockLeaseTime = unit.toMillis(leaseTime);

    return commandExecutor.evalWriteAsync(getName(), LongCodec.INSTANCE, command,
              "if (redis.call('exists', KEYS[1]) == 0) then " + //key不存在，说明前面没人拿到锁，太幸运了
                  "redis.call('hset', KEYS[1], ARGV[2], 1); " + //执行hset MY_REDLOCK UUID+threadId 1 的命令
                  "redis.call('pexpire', KEYS[1], ARGV[1]); " + //执行pexpire MY_REDLOCK设置锁的租约时间即过期时间。
                  "return nil; " +                              //返回nil,代表我已经拿到锁了
              "end; " +
              
              "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +//判断是不是我自己拿到了锁
                  "redis.call('hincrby', KEYS[1], ARGV[2], 1); " +       //如果是我自己就能进来，为我自己加1
                  "redis.call('pexpire', KEYS[1], ARGV[1]); " +          //再重新设置过期时间
                  "return nil; " +                                       //返回nil,代表我已经拿到锁了
              "end; " +
              //为以上if这段代码，提出2个疑问？
              //1.为什么是我自己（UUID+threadId，hash存在）就能进去？因为我上次已经拿到了锁，所以我就能进来，即重入锁，故红锁也是一个重入锁。
              //2.为什么我进去后，要给自己加1？这就是重入锁的原理了,要记录锁重入的次数，然后再次return nil，代表再次拿到锁。
              
              //返回key的剩余过期时间，前面2个if都是返回nil代表拿锁成功，这里返回剩余过期时间代表了锁已经被别人拿走，
              //为什么要给剩余时间？就是告诉你锁已经在别人那里了，你按我的是个时间在等待吧
              "return redis.call('pttl', KEYS[1]);",
                Collections.<Object>singletonList(getName()), internalLockLeaseTime, getLockName(threadId));
}
```
KEYS[1]：Collections.<Object>singletonList(getName())，为分布式锁的key，即MY_REDLOCK
ARGV[1]：internalLockLeaseTime 为锁的租约时间，即过期时间
ARGV[2]：getLockName(threadId)（4218379f-849d-498f-8c28-56f3fce42f71:52）代表了redis连接id+线程id，
         即UUID+threadId,组成锁的获取者，就是谁拿到了该锁。
