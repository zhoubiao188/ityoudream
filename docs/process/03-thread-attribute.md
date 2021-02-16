#### 线程的属性和方法
##### 线程的属性
| 属性  | 属性类型和作用  | 只度  | 重要事项 |
|  ----  | ---- |  ----  | ---- |
| 编号(ID)  | 类型是long，用于标识不同的线程 |  是 |  唯一性是运行一次有效 |
| Name(名称)  | 类型是String，用于区分不同线程，默认格式Thread-线程编号 |  否 |  多个线程可以设置相同的名称，但是一般不采纳 |
| Daemon(线程类别)  |类型是boolean，true为守护线程，否则表示用户线程，属性的默认值和父线程值相同 |  否 |  必须在线程start方法调用之前设置setDaemon，否则报错 |
| Priority(优先级)  | 类型是int，表示线程优先级，范围是1到10，默认值为5，表示普通线程，线程和父亲线程优先级一致 |  否 |  千万不要过于设置优先级，否则会带来意想不到的情况 |

##### 线程中Thread类
| 方 法  | 功 能  | 备 注  |
|  ----  | ---- |  ----  |
|  static Thread <br/>currentThread() | 拿到当前执行线程对象 |   同一段代码对 Thread.currentThreadd() 的调用.其返回值可能对应着 不同的线程（对象） |
|  void run()  | 该方法是线程任务逻辑 |  该方法是由Java虚拟机直接调用的，—般情况下应用程序不应该调用该方法  |
|  void start()  | 启动响应线程 |  只能调用一次，多次出异常  |
|  void join()  | 等待相应线程运行结束 |  若线 程A调用 线程 B的jo in 方法 ，那么线程A的运行会被暂停，直到线程B 运行结束  |
|  static void yicld()  | 使当前线程主动放弃其对处理器的占川.这可能导致当前线程被暂停(不用) |  这个方法一般不用，作废  |
|  static void sleep(long millis)  | 使当前线程休眠（暂停运行） 指定的时间 |    |

Java中的任何一段代码总是执行在某个线程之中。执行当前代码的线程就被称为当前
线程，Thread.currentThreadO可以返回当前线程。由于同一段代码可能被不同的线程执行，
因此当前线程是相对的，即-Vhrcad.currentThreadO的返回值在代码实际运行的吋候可能对
应着不同的线程（对象）。
join方法的作用相当于执行该方法的线程和线程调度器说：“我得先暂停一下，等到另
外一个线程运行结束后我才能继续（干活）
yield静态方法的作用相当于执行该方法的线程对线程调度器说：“我现在不急，如果
別人耑要处理器资源的话先给他用吧。当然，如果没有其他人要用.我也不介意继续占用=”
sleep静态方法的作用相当于执行该方法的线程对线程调度器说：“我想小憩一会儿，
过段吋问再叫醒我继续干活吧。使用sleep静态方法可以实现一个简易的倒计吋器如下代码
```java
/**
 * 实现简单的计时器sleep
 */
public class SimpleTimer {
    private static int count;
    public static void main(String[] args) {
        count = args.length >= 1 ? Integer.valueOf(args[0]) : 60;
        int remaining;
        while (true) {
            remaining = countDown();
            if (0 == remaining) {
                break;
            } else {
                System.out.println("remaining " + count + "second (s) *");
            }
            try {
                Thread.sleep(1000);
            }catch (InterruptedException ex) {

            }
        }
        System.out.println("Done!");
    }

    private static int countDown() {
        return count --;
    }
}
```







