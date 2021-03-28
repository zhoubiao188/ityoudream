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

