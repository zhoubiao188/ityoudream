
### 案例实战：基于ReentrantLock的递归锁
ReentrantLock，是一个可重入且独占式的锁，是一种递归无阻塞的同步锁。
和synchronized关键字相比，它更灵活、更强大，增加了轮询、超时、中断等高级功能。

#### 步骤1：ReentrantLock的递归实现
```java
public class ReentrantLockDemo {

    private Lock lock =  new ReentrantLock();

    public void doSomething(int n){
        try{
            //进入递归第一件事：加锁
            lock.lock();
            log.info("--------递归{}次--------",n);
            if(n<=2){
                try {
                    Thread.sleep(1000*2);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                this.doSomething(++n);
            }else{
                return;
            }
        }finally {
            lock.unlock();
        }
    }

}
```
#### 步骤2：加个测试类
```java

    @GetMapping(value = "/lock2")
    public void lock2(String key) {
        log.info("-------请求{}--------",key);
        this.reentrantLockDemo.doSomething(1);
        log.info("--------请求{}结束--------",key);
    }
```
#### 步骤3：体验测试
``` 
2020-03-08 11:19:40.974  INFO 75915 --- [nio-9090-exec-9] c.a.r.controller.ReentrantController     : -------请求1--------
2020-03-08 11:19:40.974  INFO 75915 --- [nio-9090-exec-9] c.a.redis.Reentrant.ReentrantLockDemo    : --------递归1次--------
2020-03-08 11:19:42.655  INFO 75915 --- [io-9090-exec-10] c.a.r.controller.ReentrantController     : -------请求2--------
2020-03-08 11:19:42.978  INFO 75915 --- [nio-9090-exec-9] c.a.redis.Reentrant.ReentrantLockDemo    : --------递归2次--------
2020-03-08 11:19:44.403  INFO 75915 --- [nio-9090-exec-1] c.a.r.controller.ReentrantController     : -------请求3--------
2020-03-08 11:19:44.980  INFO 75915 --- [nio-9090-exec-9] c.a.redis.Reentrant.ReentrantLockDemo    : --------递归3次--------
2020-03-08 11:19:44.980  INFO 75915 --- [nio-9090-exec-9] c.a.r.controller.ReentrantController     : --------请求1结束--------
2020-03-08 11:19:44.981  INFO 75915 --- [io-9090-exec-10] c.a.redis.Reentrant.ReentrantLockDemo    : --------递归1次--------
2020-03-08 11:19:46.983  INFO 75915 --- [io-9090-exec-10] c.a.redis.Reentrant.ReentrantLockDemo    : --------递归2次--------
2020-03-08 11:19:48.987  INFO 75915 --- [io-9090-exec-10] c.a.redis.Reentrant.ReentrantLockDemo    : --------递归3次--------
2020-03-08 11:19:48.987  INFO 75915 --- [nio-9090-exec-1] c.a.redis.Reentrant.ReentrantLockDemo    : --------递归1次--------
2020-03-08 11:19:48.987  INFO 75915 --- [io-9090-exec-10] c.a.r.controller.ReentrantController     : --------请求2结束--------
2020-03-08 11:19:50.990  INFO 75915 --- [nio-9090-exec-1] c.a.redis.Reentrant.ReentrantLockDemo    : --------递归2次--------
2020-03-08 11:19:52.993  INFO 75915 --- [nio-9090-exec-1] c.a.redis.Reentrant.ReentrantLockDemo    : --------递归3次--------
2020-03-08 11:19:52.994  INFO 75915 --- [nio-9090-exec-1] c.a.r.controller.ReentrantController     : --------请求3结束--------
```
通过测试结果：
1.发送了3次请求，springboot启用了3条线程来处理，分别是nio-9090-exec-9 io-9090-exec-10 nio-9090-exec-1
2.nio-9090-exec-9线程，在doSomething方法递归了3次,即证明了ReentrantLock是可重入锁
3.只有当nio-9090-exec-9线程执行完后，才能执行io-9090-exec-10 nio-9090-exec-1，为什么？
  因为线程之间的请求都被锁住了，也证明了ReentrantLock在不同的线程之间是不可重入的。
