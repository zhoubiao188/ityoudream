#### 线程的几种创建方式
##### 继承Thread类来实现线程
```java
/**
 * 实现方式一，继承Thread类，覆写run方法
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

##### 实现Runnable接口来现实线程
```java
/**
 * 实现方式二，实现Runnable接口，覆写run方法
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
##### 使用匿名内部类实现线程
```java
/**
     * 匿名内部类
     */
    public static void anonymousThread() {
        new Thread() {
            //直接实现run方法
            @Override
            public void run() {
                for (int i = 0; i < 10; i++) {
                    System.out.println("ThreadName:" + Thread.currentThread().getName() + ":" + i);
                }
            }
        }.start();
    }
```
##### 实现Callable接口来实现线程
```java
/**
 * 实现了Callable接口，覆写Callable中的call方法
 */
public class MyCallThread implements Callable<Integer> {
    @Override
    public Integer call() throws Exception {
        int sum = 0;
        for (int i = 0; i < 10; i++) {
            sum += i;
        }
        return sum;
    }
}
```

##### 实现用线程池来实现线程
严格的来说，这种方式的区别其实和直接实现Runnable接口区别不大，但是这里使用了线程池的方式
```java
/**
 * 用线程池的方式来实现线程
 */
public class ThreadPool implements Runnable{
    @Override
    public void run() {
        for (int i = 0; i < 10; i++) {
            System.out.println("ThreadName:" + Thread.currentThread().getName() + ":" + i);
        }
    }
}

  public static void ThreadPoolStart() {
        //创建一个容量大小为5的线程池
        ExecutorService pool = Executors.newFixedThreadPool(6);
        ThreadPoolExecutor executor = (ThreadPoolExecutor)pool;
        executor.setCorePoolSize(5);
        //开启线程
        executor.execute(new ThreadPool());
        executor.execute(new ThreadPool());
        executor.execute(new ThreadPool());
        executor.execute(new ThreadPool());
        executor.execute(new ThreadPool());
    }
```
##### Lambda实现线程1
```java
/**
     * 普通线程，无返回值
     */
    public static void Thread1() {
        //这里面的代码就是run方法区域
        new Thread(() -> {
            for (int i = 0; i < 10; i++) {
                System.out.println("ThreadName:" + Thread.currentThread().getName() + ":" + i);
            }
        }).start();
    }
```

##### Lambda实现线程2
```java
   /**
     * 使用线程池实现异步线程
     */
    public static void Thread2() {
        ExecutorService pool = Executors.newFixedThreadPool(5);
        pool.submit(() -> {
            for (int i = 0; i < 10; i++) {
                System.out.println("ThreadName:" + Thread.currentThread().getName() + ":" + i);
            }
        });
    }
```

##### Lambda实现线程3
```java
   /**
     * 使用线程池实现异步线程,可以返回参数
     */
    public static String Thread3() {
        ExecutorService pool = Executors.newFixedThreadPool(5);
        Future<String> result = (Future<String>) pool.submit(() -> {
            for (int i = 0; i < 10; i++) {
                System.out.println("ThreadName:" + Thread.currentThread().getName() + ":" + i);
            }
        });
        try {
            return result.get();
        } catch (InterruptedException e) {
            e.printStackTrace();
        } catch (ExecutionException e) {
            e.printStackTrace();
        }
        return null;
    }
}
```

#### 源码下载
<a href="https://github.com/zhoubiao188/BasicJava/tree/master/Thread/src/cn/ityoudream/thread1
">github download Thread</a>



