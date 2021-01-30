### 分布式红锁的waitTime的设计原理
提前做2个动作:
1.先把3台 redis key全部清空
127.0.0.1:6379> flushdb
OK

2.isLock = redLock.tryLock(1000*5*20, 1000*60*5*20, TimeUnit.MILLISECONDS);


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
        //做debug的时候，一定要注意这个剩余时间，意思就是锁的等待时间，一旦剩余时间为0，获得锁就会失败。
        long remainTime = -1;
        if (waitTime != -1) {
            remainTime = unit.toMillis(waitTime);
        }
        long lockWaitTime = calcLockWaitTime(remainTime);
        
        int failedLocksLimit = failedLocksLimit();
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
            
            if (lockAcquired) {
                acquiredLocks.add(lock);
            } else {
                if (locks.size() - acquiredLocks.size() == failedLocksLimit()) {
                    break;
                }

                if (failedLocksLimit == 0) {
                    unlockInner(acquiredLocks);
                    if (waitTime == -1) {
                        return false;
                    }
                    failedLocksLimit = failedLocksLimit();
                    acquiredLocks.clear();
                    // reset iterator
                    while (iterator.hasPrevious()) {
                        iterator.previous();
                    }
                } else {
                    failedLocksLimit--;
                }
            }
            //剩余时间的计算
            if (remainTime != -1) {
                //当前时间减去上次的时间。
                remainTime -= System.currentTimeMillis() - time;
                time = System.currentTimeMillis();
                //如果剩余时间小于0，解锁退出
                if (remainTime <= 0) {
                    //解锁，只要超时，任何业务都回滚。
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
总结：
waittime锁的等待时间处理，整个加锁的过程中，采用了系统的当前时间做减法计算。
即，每次for循环都减去每次循环的耗时，一旦时间小于等于0，就返回false，体现了代码的严谨性。
如果你今后设计一个超时代码，就可以参考今天这堂课的讲解原理。
