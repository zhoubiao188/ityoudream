
### 分布式红锁的加锁失败的设计原理
1.先把3台 redis key全部清空（为了不受debug干扰，必须先删除锁）
127.0.0.1:6379> flushdb
OK

都设置为30分钟超时 过期
2.isLock = redLock.tryLock(1000*60*30, 1000*60*30, TimeUnit.MILLISECONDS);

试验步骤：
1. 先启动3台redis实例，然后启动springboot
2. springboot启动成功后，停2台redis实例。（不能先停2台redis，不然springboot起不来）



步骤1：springboot启动成功后，停2台redis实例。
``` 
[root@node2 ~]# docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
1e6e3900e68c        redis:5.0.7         "docker-entrypoint.s…"   6 days ago          Up 4 minutes        0.0.0.0:6383->6379/tcp   redis-master-3
1b9030d50927        redis:5.0.7         "docker-entrypoint.s…"   6 days ago          Up 4 minutes        0.0.0.0:6382->6379/tcp   redis-master-2
c86403dcb3d8        redis:5.0.7         "docker-entrypoint.s…"   6 days ago          Up 8 hours          0.0.0.0:6381->6379/tcp   redis-master-1
[root@node2 ~]#
[root@node2 ~]#
[root@node2 ~]# docker stop redis-master-3 redis-master-2
redis-master-3
redis-master-2
```


``` java
    
    @Override
    public boolean tryLock(long waitTime, long leaseTime, TimeUnit unit) throws InterruptedException {
//        try {
//            return tryLockAsync(waitTime, leaseTime, unit).get();
//        } catch (ExecutionException e) {
//            throw new IllegalStateException(e);
//        }
        long newLeaseTime = -1;
        if (leaseTime != -1) {
            if (waitTime == -1) {
                newLeaseTime = unit.toMillis(leaseTime);
            } else {
                newLeaseTime = unit.toMillis(waitTime)*2;
            }
        }
        
        long time = System.currentTimeMillis();
        long remainTime = -1;
        if (waitTime != -1) {
            remainTime = unit.toMillis(waitTime);
        }
        long lockWaitTime = calcLockWaitTime(remainTime);
        
        //步骤2：计算可以容忍接受加锁失败节点个数限制（N-(N/2+1)）=(3-(3/2+1))=1
        int failedLocksLimit = failedLocksLimit(); ==1
        List<RLock> acquiredLocks = new ArrayList<>(locks.size());
        for (ListIterator<RLock> iterator = locks.listIterator(); iterator.hasNext();) {
            RLock lock = iterator.next();
            boolean lockAcquired;
            try {
                if (waitTime == -1 && leaseTime == -1) {
                    lockAcquired = lock.tryLock();
                } else {
                    long awaitTime = Math.min(lockWaitTime, remainTime);
                    lockAcquired = lock.tryLock(awaitTime, newLeaseTime, TimeUnit.MILLISECONDS);
                }
            } catch (RedisResponseTimeoutException e) {
                unlockInner(Arrays.asList(lock));
                lockAcquired = false;
            } catch (Exception e) {
                lockAcquired = false;
            }
            //步骤3：拿锁成功后，统计成功的redis实例数
            if (lockAcquired) {
                acquiredLocks.add(lock);
            } else {//步骤4：拿锁失败的话，那就复杂了
            计算可以容忍接受加锁失败节点数，是否达到？（N-(N/2+1)）=(3-(3/2+1))=1
            如果已经达到，就认定最终申请锁失败，则没有必要继续从后面的节点申请了
            因为红锁算法要求至少N/2+1=3/2+1=2个节点都加锁成功了，才算最终的锁申请成功。
            
                //刚好N/2+1=3/2+1=2是成功的，例如 3个或2个都是成功，就退出，代表获取锁成功。
                if (locks.size() - acquiredLocks.size() == failedLocksLimit()) {
                    break;
                }
                //步骤B:例如redis3个节点，第一个成功，第二失败，第三失败，，就直接进入failedLocksLimit=0
                if (failedLocksLimit == 0) {
                    //解锁第一个成功的
                    unlockInner(acquiredLocks);
                    //等待时间已经消化完就，就直接返回false，获取锁失败。
                    if (waitTime == -1) {
                        return false;
                    }
                    //计算可以容忍接受加锁失败节点个数限制（N-(N/2+1)）=(3-(3/2+1))=1
                    failedLocksLimit = failedLocksLimit();
                    //清除成功的list，例如redis3个节点，第一个成功，第二失败，第三失败，就是吧第一个清除，然后重新来。
                    acquiredLocks.clear();
                    //把iterator的坐标重新初始化，然后重新进入新的循环
                    // reset iterator
                    while (iterator.hasPrevious()) {
                        iterator.previous();
                    }
                    
                    //总结：failedLocksLimit == 0的设计原理，就是让for循环一直循环下去，除非出现2种情况才退出死循环
                    1.waitTime 或 remainTime消化完，退出循环
                    2.redis实例恢复正常  （例如启动  docker start redis-master-3 redis-master-2）就正常拿到锁了
                    
                    
                    
                } else {
                    //步骤A:加锁失败节点个数限制-1，然后继续循环，例如redis3个节点，第一个成功，第二失败，限制failedLocksLimit=0
                    failedLocksLimit--;
                }
            }
            //步骤5： 只有等到remainTime消化完，退出死循环
            if (remainTime != -1) {
                remainTime -= System.currentTimeMillis() - time;
                time = System.currentTimeMillis();
                if (remainTime <= 0) {
                    unlockInner(acquiredLocks);
                    return false;
                }
            }
        }
        
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
        
        return true;
    }
```

基于以上代码，我们分为5个步骤分析，得出一个结论：
1.整个算法过程中都是围绕N/2+1=3/2+1=2的成功个数来设计的，如果拿不到N/2+1=3/2+1=2，算法会一直死循环下去，，除非出现2种情况才退出死循环
  1.waitTime 或 remainTime消化完，退出循环
  2.redis实例恢复正常  （例如启动  docker start redis-master-3 redis-master-2）就正常拿到锁了
2.这种设计，要特别小心waitTime，这个waitTime一定要设置短，不然redis宕机的情况下，会出现死循环，整个系统卡死。