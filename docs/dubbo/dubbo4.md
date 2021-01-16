#### Dubbo架构原理
##### 步骤一、下载ZooInspector工具
为了探索dubbo的架构，我们需要去下载ZooInspector工具<br/>
<a href="https://issues.apache.org/jira/secure/attachment/12436620/ZooInspector.zip">download ZooInspector</a>
下载完成后，我们需要进入build目录执行
```
java -jar zookeeper-dev-ZooInspector.jar
```
先启动本地或者远程的ZooKeeper服务，然后打开我们的ZooInspector的工具如下:
![image](/dubbo/ZooInspector.png)
我们打开后，选择左上角绿色按钮来建立ZooKeeper监听，然后只需要填写ZooKeeper服务端的地址就可以了，这个工具能够非常直观的看到那些服务连接到ZooKeeper上了

#### 步骤二、启动dubbo-demo代码






