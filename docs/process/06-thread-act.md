#### 可见性、原子性和有序性问题:并发编程的Bug的源头
通常在并发程序中会出现很多Bug，这些Bug很难追踪和定位，一般我都是为了解决并发问题，而忽略了如线程安全等问题，造成系统出现Bug，我们要定位并发中的Bug，那么就要对并发编程深入的了解，而不是停留在只会用。


#### 源头之一：缓存导致的可见性问题
在单核时代，所有的线程都在一个CPU上运行，CPU 缓存与内存的数据一致性容易解
决。因为所有线程都是操作同一个 CPU 的缓存，一个线程对缓存的写，对另外一个线程来
说一定是可见的。例如在下面的图中，线程 A 和线程 B 都是操作同一个 CPU 里面的缓
存，所以线程 A 更新了变量 V 的值，那么线程 B 之后再访问变量 V，得到的一定是 V 的
最新值（线程 A 写过的值）。

![image](/thread/thread1.png)

<center>CPU 缓存与内存的关系图</center>


一个线程对共享变量的修改，另外一个线程能够立刻看到，我们称为可见性。
多核时代，每颗 CPU 都有自己的缓存，这时 CPU 缓存与内存的数据一致性就没那么容易
解决了，当多个线程在不同的 CPU 上执行时，这些线程操作的是不同的 CPU 缓存。比如
下图中，线程 A 操作的是 CPU-1 上的缓存，而线程 B 操作的是 CPU-2 上的缓存，很明
显，这个时候线程 A 对变量 V 的操作对于线程 B 而言就不具备可见性了。这个就属于硬
件程序员给软件程序员挖的“坑”。


![image](/thread/thread2.png)
<center>多核 CPU 的缓存与内存关系图</center>

下面我们再用一段代码来验证一下多核场景下的可见性问题。下面的代码，每执行一次
add10K() 方法，都会循环 10000 次 count+=1 操作。在 calc() 方法中我们创建了两个
线程，每个线程调用一次 add10K() 方法，我们来想一想执行 calc() 方法得到的结果应该
是多少呢？

```java
package cn.ityoudream.thread3;

public class ThreadTest {
    private static long count = 0;
    private void add10K() {
        int idx = 0;
        while (idx++ < 10000) {
            count +=1;
        }
    }

    public static long calc() throws InterruptedException {
        final ThreadTest test = new ThreadTest();
        //创建两个线程执行add()操作
        Thread t1 = new Thread(() -> {
            test.add10K();
        });
        Thread t2 = new Thread(() -> {
            test.add10K();
        });
        t1.start();
        t2.start();
        t1.join();
        t2.join();
        return count;
    }

    public static void main(String[] args) {
        try {
            long calc = ThreadTest.calc();
            //答案就是20000，但是这个是随机性的
            System.out.println("result:" + calc);
        } catch (InterruptedException interruptedException) {
            interruptedException.printStackTrace();
        }
    }
}

```
那么为什么最终calc执行的结果不是每次都是20000，而是10000到20000之间到随机数呢？
因为我们在但线程调用了两次add10K方法，假设线程 A 和线程 B 同时开始执行，那么第一次都会将 count=0 读到各自的 CPU
缓存里，执行完 count+=1 之后，各自 CPU 缓存里的值都是 1，同时写入内存后，我们
会发现内存中是 1，而不是我们期望的 2。之后由于各自的 CPU 缓存里都有了 count 的
值，两个线程都是基于 CPU 缓存里的 count 值来计算，所以导致最终 count 的值都是小
于 20000 的。这就是缓存的可见性问题。
循环 10000 次 count+=1 操作如果改为循环 1 亿次，你会发现效果更明显，最终 count
的值接近 1 亿，而不是 2 亿。如果循环 10000 次，count 的值接近 20000，原因是两个
线程不是同时启动的，有一个时差。

![image](/thread/thread3.png)

#### 源头之二：线程切换带来的原子性问题

