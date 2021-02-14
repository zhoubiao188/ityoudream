#### 线程的几种创建方式
##### 继承Thread类来实现多线程
```java
/**
 * 实现方式一，继承Thread类，实现run方法
 */
public class MyThread extends Thread{
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println("ThreadName:" + Thread.currentThread().getName() + ":" + i);
        }
    }
}
```
这就是继承Thread的类来实现线程，我们可以看一下run方法的源码
```java
 public void run() {
        if (target != null) {
            target.run();
        }
    }
```
这里说明了Thread类中的run方法如果target不为`null`，那么就调用`target.run()`,否则什么也不处理，而target的类型其实是`Runnable`,当线程实例是通过构造器`Thread(Runnable target)`创建的，那么target的值就是构造器中的值，否则target为null

##### 实现Runnable接口来现实多线程
```java
/**
 * 实现方式二，实现Runnable接口，复写run方法
 */
public class MyRunnable implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println("ThreadName:" + Thread.currentThread().getName() + ":" + i);
        }
    }
}
```
##### 实现Callable接口来实现多线程
