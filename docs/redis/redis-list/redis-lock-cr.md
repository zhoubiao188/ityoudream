
### 什么是可重入锁？它有什么作用？
可重入锁，也叫做递归锁，指的是在同一线程内，外层函数获得锁之后，内层递归函数仍然可以获取到该锁。
说白了就是同一个线程再次进入同样代码时，可以再次拿到该锁。
它的作用是：防止在同一线程中多次获取锁而导致死锁发生。
在java的编程中synchronized 和 ReentrantLock都是可重入锁。

### 案例实战：基于synchronized下订单的可重入锁
业务场景：模仿下订单操作，先减库存，再插入订单表。

### 步骤1：库存加锁，订单也加锁
```
public class SynchronizedDemo {
    //模拟库存100
    int count=100;
    public synchronized void operation(){
        log.info("第一层锁:减库存");
        //模拟减库存
        count--;
        add();
        log.info("下订单结束库存剩余:{}",count);
    }

    private synchronized void add(){
        log.info("第二层锁：插入订单");
        try {
            Thread.sleep(1000*10);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

```

### 步骤2：加个测试类
```
public class SynchronizedController {

    SynchronizedDemo synchronizedDemo=new SynchronizedDemo();


    @GetMapping(value = "/lock1")
    public void lock1(String key) {
        log.info("-------用户{}开始下单--------",key);
        this.synchronizedDemo.operation();

    }

}
```

### 步骤3：测试体验
``` 
2020-03-08 10:47:52.038  INFO 75593 --- [nio-9090-exec-9] c.a.r.controller.SynchronizedController  : -------用户1开始下单--------
2020-03-08 10:47:52.039  INFO 75593 --- [nio-9090-exec-9] c.agan.redis.Reentrant.SynchronizedDemo  : 第一层锁:减库存
2020-03-08 10:47:52.039  INFO 75593 --- [nio-9090-exec-9] c.agan.redis.Reentrant.SynchronizedDemo  : 第二层锁：插入订单
2020-03-08 10:47:54.606  INFO 75593 --- [io-9090-exec-10] c.a.r.controller.SynchronizedController  : -------用户2开始下单--------
2020-03-08 10:47:56.613  INFO 75593 --- [nio-9090-exec-1] c.a.r.controller.SynchronizedController  : -------用户3开始下单--------
2020-03-08 10:48:02.047  INFO 75593 --- [nio-9090-exec-9] c.agan.redis.Reentrant.SynchronizedDemo  : 下订单结束库存剩余:99
2020-03-08 10:48:02.047  INFO 75593 --- [nio-9090-exec-1] c.agan.redis.Reentrant.SynchronizedDemo  : 第一层锁:减库存
2020-03-08 10:48:02.047  INFO 75593 --- [nio-9090-exec-1] c.agan.redis.Reentrant.SynchronizedDemo  : 第二层锁：插入订单
2020-03-08 10:48:12.057  INFO 75593 --- [nio-9090-exec-1] c.agan.redis.Reentrant.SynchronizedDemo  : 下订单结束库存剩余:98
2020-03-08 10:48:12.057  INFO 75593 --- [io-9090-exec-10] c.agan.redis.Reentrant.SynchronizedDemo  : 第一层锁:减库存
2020-03-08 10:48:12.057  INFO 75593 --- [io-9090-exec-10] c.agan.redis.Reentrant.SynchronizedDemo  : 第二层锁：插入订单
2020-03-08 10:48:22.064  INFO 75593 --- [io-9090-exec-10] c.agan.redis.Reentrant.SynchronizedDemo  : 下订单结束库存剩余:97
```
通过测试结果：
1.发送了3次请求，springboot启用了3条线程来处理，分别是nio-9090-exec-9 io-9090-exec-10 nio-9090-exec-1
2.nio-9090-exec-9线程，在operation()方法内能正常调用add(),即证明了Synchronized是可重入锁
3.只有当nio-9090-exec-9线程执行完后，才能执行io-9090-exec-10 nio-9090-exec-1，为什么？
  因为线程之间的请求都被锁住了，也证明了Synchronized在不同的线程之间是不可重入的。









