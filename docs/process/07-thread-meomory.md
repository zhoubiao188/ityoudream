#### Java内存模型：看Java如何解决可见性和有序性问题

#### 什么是Java的内存模型
我们已经知道了，导致可见性的原因是缓存，导致有序的原因是编译优化，那么解决可见性、有序性最直接的办法是`禁用缓存和编译优化`，一旦解决了，那么程序的性能就会大大折扣。

但是我们可以合理的`按需禁用缓存和编译优化`。那么如何做到按需禁用呢？我们只需要按照需求来禁用就可以了，说白一点就是提供禁用缓存和编译优化的方法。

Java的内存模型是非常复杂的规范，JVM是如何提供按需禁用缓存和编译优化的呢？在JVM中提供了使用`volatile、synchronized 和 final`三个关键字的方法，以及六项的`Happens-Before规则`。

#### 使用 volatile的困惑
volatile 这个关键字不是Java特有的，在C语言中也是有的，它表示禁用CPU缓存。

例如我们声明一个 volatile 变量 `volatile int x = 0`,它表示告诉编译器，对这个变量的读和写，但是不能使用CPU缓存，必须从内存中读取或写入。

例如下面的示例代码，假设线程 A 执行 writer() 方法，按照 volatile 语义，会把变量
“v=true” 写入内存；假设线程 B 执行 reader() 方法，同样按照 volatile 语义，线程 B
会从内存中读取变量 v，如果线程 B 看到 “v == true” 时，那么线程 B 看到的变量 x 是
多少呢？

直觉上看，应该是 42，那实际应该是多少呢？这个要看 Java 的版本，如果在低于 1.5 版
本上运行，x 可能是 42，也有可能是 0；如果在 1.5 以上的版本上运行，x 就是等于 42。

```java
public class VolatileThread {
    static int x = 0;
    static volatile boolean v = false;

    public void writer() {
        x = 42;
        v = true;
    }

    public void reader() {
        if (v == true) {
            System.out.println("x ->" + x);
        }
    }
}
```
那么为什么JDK1.5以前的版本运行代码后 x = 0呢？ 这个其实是CPU缓存导致的，而在JDK1.5之前 volatile没有被增强，是怎么被增强的呢？那就是Happens-Before规则。

#### 什么是Happers-Before 规则
它要表达的是：`前面一个操作结果对后需操作是不可见的`。就像是有心灵感应的两个人，即使相隔千里，一个人心之所想，另一个人都看得到。Happens-Before规则就是保证线程之间的心灵感应。那么正式的说法就是：Happens-Before约束了编译器的优化行为，虽运行编译器优化，但是要求编译器优化后遵循Happens-Before规则。

Happens-Before相关规则有六项

##### 1.程序的顺序性规则
这条规则是指在一个线程中，按照程序顺序，前面的操作 Happens-Before 于后续的任意
操作。这还是比较容易理解的，比如刚才那段示例代码，按照程序的顺序，第 6 行代码
“x = 42;” Happens-Before 于第 7 行代码 “v = true;”，这就是规则 1 的内容，也比
较符合单线程里面的思维：程序前面对某个变量的修改一定是对后续操作可见的。

```java
public class VolatileThread {
    static int x = 0;
    static volatile boolean v = false;

    public void writer() {
        x = 42;
        // 这里就是Happens-Before代码
        v = true;
    }

    public void reader() {
        if (v == true) {
            System.out.println("x ->" + x);
        }
    }
}
```

##### 2.volatile 变量规则
这条规则是指对一个 volatile 变量的写操作， Happens-Before 于后续对这个 volatile
变量的读操作

对一个 volatile 变量的写操作相对于后续对这个 volatile 变量的读操
作可见，这怎么看都是禁用缓存的意思啊，貌似和 1.5 版本以前的语义没有变化啊？如果
单看这个规则，的确是这样，但是如果我们关联一下规则 3，就有点不一样的感觉了。

##### 3.传递性
这条规则是指如果 A Happens-Before B，且 B Happens-Before C，那么 A Happens
Before C。

我们将规则 3 的传递性应用到我们的例子中，会发生什么呢？可以看下面这幅图：

![image](/thread/happens-before-1.png)

<center>示例代码中的传递性规则</center>

从图中可以知道：
1. x = 42 Happens-Before 写变量 v = true, 这是规则1的内容。
2. 写变量 v = true，Happens-Before 读变量 v = true,这是规则2的内容。

在根据这个传递规则，我们可以得到结果： x = 42 Happens-Befoe 读变量 v = true， 这意味着什么呢？

如果线程 B 读到了“v=true”，那么线程 A 设置的“x=42”对线程 B 是可见的。也就是
说，线程 B 能看到 “x == 42” ，有没有一种恍然大悟的感觉？这就是 1.5 版本对
volatile 语义的增强，这个增强意义重大，1.5 版本的并发工具包（java.util.concurrent）
就是靠 volatile 语义来搞定可见性的

##### 4.管程中锁的规则
这条规则是指对一个锁的解锁 Happens-Before 于后续对这个锁的加锁。

管程是一种通用的同步原语，在Java中指的就是`synchornized` ，而synchornized是Java里对管程的实现。

管程中的锁在Java中是隐式实现的，如下面的代码，在进入同步块之前，会自动加锁，而在代码块执行完后，会自动释放锁，加锁和释放锁都是编译器帮我们实现的。

```java
synchornized(this) {
    //x 是共享变量 初始值是 x = 9527
    if (this.x < 8888) {
        this.x = 520;
    }
}//运行完毕后，这里会自动的释放锁
```
所以结合规则 4——管程中锁的规则，可以这样理解：假设 x 的初始值是 9527，线程 A 执
行完代码块后 x 的值会变成 520（执行完自动释放锁），线程 B 进入代码块时，能够看到
线程 A 对 x 的写操作，也就是线程 B 能够看到 x== 520。这个也是符合我们直觉的

##### 5.线程start()规则
这条是关于线程启动的。它是指主线程 A 启动子线程 B 后，子线程 B 能够看到主线程在
启动子线程 B 前的操作。
换句话说就是，如果线程 A 调用线程 B 的 start() 方法（即在线程 A 中启动线程 B），那
么该 start() 操作 Happens-Before 于线程 B 中的任意操作。具体可参考下面示例代码。

```java
/**
 * 线程 start() 规则
 */
public class HappensBeforeByStart {
     static int x = 9527;
    public static void main(String[] args) {
        //main方法为主线程A
        Thread B = new Thread(() -> {
            //在主线程Main调用B.start()之前，所有共享变量的修改，此处可见
            if (x == 520) {
                System.out.println("可见");
            }
        });
        x = 520;
        B.start();
    }
}
```

##### 6.线程 join() 规则
这条是关于线程等待的。它是指主线程 A 等待子线程 B 完成（主线程 A 通过调用子线程
B 的 join() 方法实现），当子线程 B 完成后（主线程 A 中 join() 方法返回），主线程能够看到子线程的操作。当然所谓的“看到”，指的是对`共享变量`的操作。

换句话说就是，如果在线程 A 中，调用线程 B 的 join() 并成功返回，那么线程 B 中的任
意操作 Happens-Before 于该 join() 操作的返回。具体可参考下面示例代码。

```java
/**
 * 线程 join() 规则
 */
public class HappensBeforeByJoin {
    static int x = 9527;
    public static void main(String[] args) throws InterruptedException {
        Thread B = new Thread(() -> {
            //此处对x这个共享变量的修改
            x = 520;
        });
        // 例如此处对共享变量修改
        // 则这个修改结果对线程 B 可见
        // 主线程Main启动子线程
        B.start();
        B.join();
        System.out.println("x:" + x);
        // 子线程B所有对共享变量的修改
        // 在主线Main程调用 B.join() 之后皆可见
        // 此例中，var == 520
    }
}
```

#### 被我们忽视的 final
前面我们讲 volatile 为的是禁用缓存以及编译优化，我们再从另外一个方面来看，有没有
办法告诉编译器优化得更好一点呢？这个可以有，就是`final关键字` 。

`final 修饰变量时，初衷是告诉编译器：这个变量生而不变，可以可劲儿优化`。Java 编译
器在 1.5 以前的版本的确优化得很努力，以至于都优化错了。

问题类似于上一期提到的利用双重检查方法创建单例，构造函数的错误重排导致线程可能
看到 final 变量的值会变化。详细的案例可以参考[这个文档](http://www.cs.umd.edu/~pugh/java/memoryModel/jsr-133-faq.html#finalWrong)。

在 1.5 以后 Java 内存模型对 final 类型变量的重排进行了约束。现在只要我们提
供正确构造函数没有“逸出”，就不会出问题了。

“溢出”有点抽象，我们还是举个例子吧，在下面例子中，在构造函数里面将 this 赋值给
了全局变量 global.obj，这就是“溢出”，线程通过 global.obj 读取 x 是有可能读到 0
的。因此我们一定要避免“溢出”。

```java
/**
 * final 造成的溢出
 */
public class HappensBeforeByFinal {
    final int x;
    Object obj = null;
    int y;
    public HappensBeforeByFinal() {
        x = 3;
        y = 4;
        obj = this;
    }

    public static void main(String[] args) {
        HappensBeforeByFinal join = new HappensBeforeByFinal();
        System.out.println(join.obj);
    }
}
```
#### 总结
Java 的内存模型是并发编程领域的一次重要创新，之后 C++、C#、Golang 等高级语言
都开始支持内存模型。Java 内存模型里面，最晦涩的部分就是 Happens-Before 规则
了，Happens-Before 规则最初是在一篇叫做Time, Clocks, and the Ordering of
Events in a Distributed System的论文中提出来的，在这篇论文中，Happens-Before
的语义是一种因果关系。在现实世界里，如果 A 事件是导致 B 事件的起因，那么 A 事件
一定是先于（Happens-Before）B 事件发生的，这个就是 Happens-Before 语义的现实
理解。
在 Java 语言里面，Happens-Before 的语义本质上是一种可见性，A Happens-Before B
意味着 A 事件对 B 事件来说是可见的，无论 A 事件和 B 事件是否发生在同一个线程里。
例如 A 事件发生在线程 1 上，B 事件发生在线程 2 上，Happens-Before 规则保证线程 2
上也能看到 A 事件的发生。
Java 内存模型主要分为两部分，一部分面向你我这种编写并发程序的应用开发人员，另一
部分是面向 JVM 的实现人员的，我们可以重点关注前者，也就是和编写并发程序相关的
部分，这部分内容的核心就是 Happens-Before 规则。






