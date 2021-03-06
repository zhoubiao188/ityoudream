#### Java线程的层次关系
Java中的线程不是孤立的，线程和线程之间是存在关系的，假设线程A所执行的代码创建了线程B，那么B就是A的子线程，那么A就是B的父线程

#### 线程的生命周期状态
![image](/thread/thread-state.png)
上面是线程的生命周期图，这幅图是最清晰直观的展现各个状态下的线程

Java线程的状态可以使用监控工具査看，也可以通过`Thread.getState()`调用来获取u
Thread.getState()的返回值类型 Thread.State 是一个枚举类壁(Enum )o
Thread.State 所定义 的线程状态包括以下几种

`NEW:` 一个已创建而未启动的线程处于该状态。由于一个线程实例只能够被后动一次，因此一个线程只可能有一次处于该状态。 <br/>

`RUNNABLE:`该状态可以被看成一个复合状态。它包括两个子状态：READY和
RUNNING。前者表示处于该状态的线程可以被线程调度器(Scheduler)进行调度而使之
处于RUNNING状态。后者表示处于该状态的线程正在运行，即相应线程对象的run方法
所对应的指令正在由处理器执行。执行Thread.yield()的线程，其状态可能会由RUNNING
转换为READY。处于READY子状态的线程也被称为活跃线程。<br/>

`BLOCKED:`一个线程发起一个阻塞式I/O(BlockingI/O)操作后|2
,或者申请一个
由其他线程持有的独占资源(比如锁)吋，相应的线程会处于该状态。处于BLOCKED
状态的线程并不会占用处理器资源。当阻塞式I/O操作完成后，或者线程获得了其申清的
资源，该线程的状态又可以转换为RUNNABLE。<br/>

`WAITING:`一个线程执行了某些特定方法之后就会处于这种等待其他线程执行另外
一些特定操作的状态。能够使其执行线程变更为WAITING状态的方法包括：`Object.wait()`、
`Thread.join()`和`LockSupport.park(Object)`。能够使相应线程从WAITING变更为RUNNABLE
的相应方法包括`：Object.notify()/notifyAll()`和Locksd的`port.unpark(Object))o`<br/>

`TIMED_WAITING:`该状态和WAITING类似，差别在于处于该状态的线程并非无限
制地等待其他线程执行特定操作，而是处于带有时间限制的等待状态。当其他线程没有在
指定时间内执行该线程所期望的特定操作时，该线程的状态自动转换为RUNNABLE<br/>

`TERMINATED:`已经执行结束的线程处于该状态。由于一个线程实例只能够被启动
一次，因此一个线程也只可能有一次处于该状态。Thread.run()正常返回或者由于抛出异常
而提前终止都会导致相应线程处于该状态<br/>

需要注意的是一个线程在其整个生命周期中，只可能有一次处于NEW状态和TERMINATED状态











