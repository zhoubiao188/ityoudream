
### 什么是不可重入锁？
所谓不可重入锁，即若当前线程执行某个方法已经获取了该锁，那么在方法中尝试再次获取锁时，就会获取不到被阻塞。
同一个人拿一个锁 ，只能拿一次不能同时拿2次。


### 案例实战：设计一个不可重入锁
```

public class Lock{
    //锁的状态：true=锁住，false=解锁
    private boolean isLocked = false;

    /**
     * 获取锁
     */
    public synchronized void lock() {
        while(isLocked){
            try {
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        isLocked = true;
    }

    /**
     * 解锁
     */
    public synchronized void unlock(){
        isLocked = false;
        notify();
    }
}


@Slf4j
public class OrderDemo {
    Lock lock = new Lock();

    public void operation() {
        //加锁
        lock.lock();
        log.info("第一层锁:先减库存");
        //无法重入，进入锁等待，即死锁
        doAdd();
        lock.unlock();
    }

    public void doAdd() {
        //加锁
        lock.lock();
        log.info("第二层锁：插入订单");
        lock.unlock();
    }
    public static void main(String[] args){
        OrderDemo orderDemo=new OrderDemo();
        orderDemo.operation();
    }
}
```
执行以上代码 得到以下结果 
``` 
10:29:50.130 [main] INFO com.agan.redis.Reentrant.OrderDemo - 第一层锁:先减库存
```
从以上结果可以看出已经阻塞，因为没有打印log.info("第二层锁：插入订单");
结论：
当前线程执行operation()已经获取了锁，那么在operation()方法中再次尝试获取 doAdd()时，就会被阻塞。
这种情况就是不可重入锁。