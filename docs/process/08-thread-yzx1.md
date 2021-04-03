#### 互斥锁（上）：解决原子性问题
一个或者多个操作在 CPU 执行的过程中不被中断的特性，称
为“原子性”。理解这个特性有助于你分析并发编程 Bug 出现的原因，例如利用它可以分
析出 long 型变量在 32 位机器上读写可能出现的诡异 Bug，明明已经把变量成功写入内
存，重新读出来却不是自己写入的。

##### 那原子性问题到底该如何解决呢？
原子性的问题的源头是来自`线程切换`，我想如果能够禁用线程切换就能解决这个问题，但是操作系统做线程切换是依赖CPU中断的，所以禁止CPU发生中断就能禁止线程切换。

我们要知道，在单核CPU时代，这种利用禁止线程切换的方案是可行的，但是并不能解决多核场景，下面我们以32 位 CPU 上执行 long 型变量的写操作为例来说明这个问题，long 型变量是 64 位，在 32 位 CPU 上执行写操作会被拆分成两次写操作（写高 32 位和写低
32 位，如下图所示）。

![image](/thread/thread-yzx-1.png)

在单核 CPU 场景下，同一时刻只有一个线程执行，禁止 CPU 中断，意味着操作系统不会
重新调度线程，也就是禁止了线程切换，获得 CPU 使用权的线程就可以不间断地执行，所
以两次写操作一定是：要么都被执行，要么都没有被执行，具有原子性。
但是在多核场景下，同一时刻，有可能有两个线程同时在执行，一个线程执行在 CPU-1
上，一个线程执行在 CPU-2 上，此时禁止 CPU 中断，只能保证 CPU 上的线程连续执
行，并不能保证同一时刻只有一个线程执行，如果这两个线程同时写 long 型变量高 32 位
的话，那就有可能出现我们开头提及的诡异 Bug 了。

`同一时刻只有一个线程执行`这个条件非常重要，我们称之为`互斥`。如果我们能够保证
对共享变量的修改是互斥的，那么，无论是单核 CPU 还是多核 CPU，就都能保证原子性
了。

#### 简易锁模型
我们可以通过加锁来解决这种互斥问题，如下面图所示


![image](/thread/thread-yzx-2.png)

<center>简易锁模型</center>

我们把一段需要互斥执行的代码称为临界区。线程在进入临界区之前，首先尝试加锁
lock()，如果成功，则进入临界区，此时我们称这个线程持有锁；否则呢就等待，直到持
有锁的线程解锁；持有锁的线程执行完临界区的代码后，执行解锁 unlock()。
这个过程非常像办公室里高峰期抢占坑位，每个人都是进坑锁门（加锁），出坑开门（解
锁），如厕这个事就是临界区。很长时间里，我也是这么理解的。这样理解本身没有问
题，但却很容易让我们忽视两个非常非常重要的点：我们锁的是什么？我们保护的又是什
么？

#### 改进后的锁模型
我们知道在现实世界里，锁和锁要保护的资源是有对应关系的，比如你用你家的锁保护你
家的东西，我用我家的锁保护我家的东西。在并发编程世界里，锁和资源也应该有这个关
系，但这个关系在我们上面的模型中是没有体现的，所以我们需要完善一下我们的模型。

![image](/thread/thread-yzx-3.png)

<center>改进后的锁模型</center>

首先，我们要把临界区要保护的资源标注出来，如图中临界区里增加了一个元素：受保护
的资源 R；其次，我们要保护资源 R 就得为它创建一把锁 LR；最后，针对这把锁 LR，我
们还需在进出临界区时添上加锁操作和解锁操作。另外，在锁 LR 和受保护资源之间，我
特地用一条线做了关联，这个关联关系非常重要。很多并发 Bug 的出现都是因为把它忽略
了，然后就出现了类似锁自家门来保护他家资产的事情，这样的 Bug 非常不好诊断，因为
潜意识里我们认为已经正确加锁了。


#### Java 语言提供的锁技术：synchronized
锁是一种通用的技术方案，Java语言提供的`synchronized`关键字，就是一种锁的实现。synchronized关键字可以用来修饰方法，也可以修饰代码块，它的使用如下:
```java
package cn.ityoudream.thread7;

/**
 * synchronized 加锁的几种方式
 */
public class ThreadBySync {
    private Object object;

    public ThreadBySync(Object object) {
        this.object = object;
    }

    //修饰非静态方法
    synchronized void girl() {
        //临界区
    }///运行完毕自动释放锁
    //修饰静态方法
    synchronized void boy() {
        //临界区
    }//运行完毕自动释放锁

    //对对象或者当前对象加锁
    void oop1() {
        synchronized (this) {
            //临界区
        }
    }

    void oop2() {
        synchronized (object) {
            //临界区
        }
    }
}

```

看完之后你可能会觉得有点奇怪，这个和我们上面提到的模型有点对不上号啊，加锁
lock() 和解锁 unlock() 在哪里呢？其实这两个操作都是有的，只是这两个操作是被 Java
默默加上的，Java 编译器会在 synchronized 修饰的方法或代码块前后自动加上加锁
lock() 和解锁 unlock()，这样做的好处就是加锁 lock() 和解锁 unlock() 一定是成对出现
的，毕竟忘记解锁 unlock() 可是个致命的 Bug（意味着其他线程只能死等下去了）。

那 synchronized 里的加锁 lock() 和解锁 unlock() 锁定的对象在哪里呢？上面的代码我
们看到只有修饰代码块的时候，锁定了一个 obj 对象，那修饰方法的时候锁定的是什么
呢？这个也是 Java 的一条隐式规则：

```
当修饰静态方法的时候，锁定的是当前类的 Class 对象，在上面的例子中就
是 Class ThreadBySync

当修饰非静态方法的时候，锁定的是当前实例对象 this
```

对于上面的例子，synchronized 修饰静态方法相当于:
```java
public class ThreadBySync2 {
    //修饰静态方法
    synchronized (ThreadBySync2.class)static void girl() {
        //临界区
    }

    // 修饰非静态方法
    synchronized (this) void boy() {
        //临界区
    }
}
```

#### 用 synchronized 解决 count+=1 问题

SafeCalc 这个类有两个方法：一个是
get() 方法，用来获得 value 的值；另一个是 addOne() 方法，用来给 value 加 1，并且
addOne() 方法我们用 synchronized 修饰。那么我们使用的这两个方法有没有并发问题
呢？

```java
package cn.ityoudream.thread7;

/**
 * 用 synchronized 解决 count+=1 问题
 */
public class SafeCalc {
    long value = 0l;
    long get() {
        return value;
    }

    synchronized void addOne() {
        value += 1;
    }

    public static void main(String[] args) {
        SafeCalc safeCalc = new SafeCalc();
        for (int i = 0; i < 1000; i++) {
           Thread t1 = new Thread(()-> {
               safeCalc.addOne();
           });
            t1.start();
            System.out.println(safeCalc.get());
        }
    }
}

```
我们先来看看 addOne() 方法，首先可以肯定，被 synchronized 修饰后，无论是单核
CPU 还是多核 CPU，只有一个线程能够执行 addOne() 方法，所以一定能保证原子操
作，那是否有可见性问题呢？这里就用到之前学到的`管程中锁
的规则`
```
管程中锁的规则：对一个锁的解锁 Happens-Before 于后续对这个锁的加
锁。
```

管程，就是我们这里的 synchronized（至于为什么叫管程，我们后面介绍），我们知道
synchronized 修饰的临界区是互斥的，也就是说同一时刻只有一个线程执行临界区的代
码；而所谓“对一个锁解锁 Happens-Before 后续对这个锁的加锁”，指的是前一个线程
的解锁操作对后一个线程的加锁操作可见，综合 Happens-Before 的传递性原则，我们就
能得出前一个线程在临界区修改的共享变量（该操作在解锁之前），对后续进入临界区
（该操作在加锁之后）的线程是可见的。

按照这个规则，如果多个线程同时执行 addOne() 方法，可见性是可以保证的，也就说如
果有 1000 个线程执行 addOne() 方法，最终结果一定是 value 的值增加了 1000。看到
这个结果，我们长出一口气，问题终于解决了。

但也许，你一不小心就忽视了 get() 方法。执行 addOne() 方法后，value 的值对 get()
方法是可见的吗？这个可见性是没法保证的。管程中锁的规则，是只保证后续对这个锁的
加锁的可见性，而 get() 方法并没有加锁操作，所以可见性没法保证。那如何解决呢？很
简单，就是 get() 方法也 synchronized 一下，完整的代码如下所示。
```java
package cn.ityoudream.thread7;

/**
 * 对get() 也进行加锁，解决get获取value不正确
 */
public class SafeCalc2 {
    long value = 0l;
    synchronized long get() {
        return value;
    }

    synchronized void addOne() {
        value += 1;
    }

    public static void main(String[] args) {
        SafeCalc2 safeCalc2 = new SafeCalc2();
        for (int i = 0; i < 1000 ; i++) {
            Thread t1 = new Thread(() -> {
                safeCalc2.addOne();
            });
            t1.start();
        }
    }
}
```

上面的代码转换为我们提到的锁模型，就是下面图示这个样子。get() 方法和 addOne()
方法都需要访问 value 这个受保护的资源，这个资源用 this 这把锁来保护。线程要进入临
界区 get() 和 addOne()，必须先获得 this 这把锁，这样 get() 和 addOne() 也是互斥
的。



![image](/thread/thread-yzx-4.png)

<center>保护临界区 get() 和 addOne() 的示意图</center>

这个模型更像现实世界里面球赛门票的管理，一个座位只允许一个人使用，这个座位就
是“受保护资源”，球场的入口就是 Java 类里的方法，而门票就是用来保护资源
的“锁”，Java 里的检票工作是由 synchronized 解决的。

#### 锁和受保护资源的关系
受保护资源和锁之间的关联关系非常重要，他们的关系是怎样的呢？一个
合理的关系是：`受保护资源和锁之间的关联关系是 N:1 的关系`。还拿前面球赛门票的管理
来类比，就是一个座位，我们只能用一张票来保护，如果多发了重复的票，那就要打架
了。现实世界里，我们可以用多把锁来保护同一个资源，但在并发领域是不行的，并发领
域的锁和现实世界的锁不是完全匹配的。不过倒是可以用同一把锁来保护多个资源，这个
对应到现实世界就是我们所谓的“包场”了。

上面那个例子我稍作改动，把 value 改成静态变量，把 addOne() 方法改成静态方法，此
时 get() 方法和 addOne() 方法是否存在并发问题呢？

```java
package cn.ityoudream.thread7;

/**
 * 存在并发问题
 */
public class SafeCalc3 {
    static long value = 0l;

    synchronized long get() {
        return value;
    }

    synchronized static void addOne() {
        value += 1;
    }
    
}
```

如果你仔细观察，就会发现改动后的代码是用两个锁保护一个资源。这个受保护的资源就
是静态变量 value，两个锁分别是 this 和 SafeCalc.class。我们可以用下面这幅图来形象
描述这个关系。由于临界区 get() 和 addOne() 是用两个锁保护的，因此这两个临界区没
有互斥关系，临界区 addOne() 对 value 的修改对临界区 get() 也没有可见性保证，这就
导致并发问题了。

![image](/thread/thread-yzx-5.png)

<center>两把锁保护一个资源的示意图</center>

#### 总结
互斥锁，在并发领域的知名度极高，只要有了并发问题，大家首先容易想到的就是加锁，
因为大家都知道，加锁能够保证执行临界区代码的互斥性。这样理解虽然正确，但是却不
能够指导你真正用好互斥锁。临界区的代码是操作受保护资源的路径，类似于球场的入
口，入口一定要检票，也就是要加锁，但不是随便一把锁都能有效。所以必须深入分析锁
定的对象和受保护资源的关系，综合考虑受保护资源的访问路径，多方面考量才能用好互
斥锁。