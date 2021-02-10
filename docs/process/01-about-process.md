#### 走进Java世界中的线程
##### 什么是进程、线程和任务
进程(Process)是程序运行的实例，如运行腾讯视频客户端就是一个进程。进程和程序之间的关系就好比播放电影中的视频，如大话西游这部电影对应的mp4之间的关系。运行一个Java程序实质是启动了一个Java虚拟机进程(JVMProcess)，也就是说运行Java程序就是一个进程。
```java
public class ProcessMain {
    public static void main(String [] args) {
        while(true) {
            System.out.println("Hello Process");
        }
    }
}
```
上面这个程序就是一个进程，当我们把这个程序通过打包成`jar`包，然后丢到我们的`linux`操作系统上运行，通过linux命令 `ps -ef|grep "ProcessMain" | grep -v "grep"` 就能找到这个进程