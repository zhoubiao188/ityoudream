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
我们启动dubbo-demo-xml-provider，然后我们刷新ZooInspector的连接，会发现多了一个dubbo的文件夹
![image](/dubbo/dubbo-provider.png)
可以看到dubbo-demo-provider启动后，会给每一个被注册的接口，生成文件夹，其中包括`configurators` 和 `providers`

我们从idea的console控制台可以看到如下日志:
GreetingService
```xml
<!-- 将接口注册到注册中心 -->
 Register: dubbo://192.168.0.101:20880/cn.ityoudream.dubbo.GreetingService?anyhost=true&application=demo-provider&deprecated=false&dubbo=2.0.2&dynamic=true&generic=false&group=greeting&interface=cn.ityoudream.dubbo.GreetingService&mapping-type=metadata&mapping.type=metadata&methods=hello&pid=845&release=2.7.5&revision=1.0.0&side=provider&timeout=5000&timestamp=1610857314899&version=1.0.0, dubbo version: 2.7.5, current host: 192.168.0.101

<!-- 订阅configurators的动态配置-->
Subscribe: provider://192.168.0.101:20880/cn.ityoudream.dubbo.GreetingService?anyhost=true&application=demo-provider&bind.ip=192.168.0.101&bind.port=20880&category=configurators&check=false&deprecated=false&dubbo=2.0.2&dynamic=true&generic=false&group=greeting&interface=cn.ityoudream.dubbo.GreetingService&mapping-type=metadata&mapping.type=metadata&methods=hello&pid=845&qos.port=22222&release=2.7.5&revision=1.0.0&side=provider&timeout=5000&timestamp=1610857314899&version=1.0.0, dubbo version: 2.7.5, current host: 192.168.0.101

<!-- 刷新自己的缓存，configurators动态配置 -->
Notify urls for subscribe url provider://192.168.0.101:20880/cn.ityoudream.dubbo.GreetingService?anyhost=true&application=demo-provider&bind.ip=192.168.0.101&bind.port=20880&category=configurators&check=false&deprecated=false&dubbo=2.0.2&dynamic=true&generic=false&group=greeting&interface=cn.ityoudream.dubbo.GreetingService&mapping-type=metadata&mapping.type=metadata&methods=hello&pid=845&qos.port=22222&release=2.7.5&revision=1.0.0&side=provider&timeout=5000&timestamp=1610857314899&version=1.0.0, urls: [empty://192.168.0.101:20880/cn.ityoudream.dubbo.GreetingService?anyhost=true&application=demo-provider&bind.ip=192.168.0.101&bind.port=20880&category=configurators&check=false&deprecated=false&dubbo=2.0.2&dynamic=true&generic=false&group=greeting&interface=cn.ityoudream.dubbo.GreetingService&mapping-type=metadata&mapping.type=metadata&methods=hello&pid=845&qos.port=22222&release=2.7.5&revision=1.0.0&side=provider&timeout=5000&timestamp=1610857314899&version=1.0.0], dubbo version: 2.7.5, current host: 192.168.0.101
```

从上面日志中，我们发现provider启动的时候，会把所有接口注册到注册中心，并且订阅动态配置`configurators`

启动dubbo-demo-xml-consumer，然后我们使用ZooInspector，发现：
![image](/dubbo/dubbo-consumer.png)
dubbo里面多了consumers,routers,configurators

我们看一下consumer服务到启动日志
```xml
<!-- 启动时候，建立长连接(consumer发送到provider使用netty发送)，然后进行数据通信 -->
Successed connect to server /192.168.0.101:20880 from NettyClient 192.168.0.101 using dubbo version 2.7.5, channel is NettyChannel [channel=[id: 0x380e556c, L:/192.168.0.101:51602 - R:/192.168.0.101:20880]], dubbo version: 2.7.5, current host: 192.168.0.101

<!-- 往注册中心注册 -->
 Register: consumer://192.168.0.101/org.apache.dubbo.monitor.MonitorService?application=demo-consumer&category=consumers&check=false&dubbo=2.0.2&enable-auto-migration=true&enable.auto.migration=true&interface=org.apache.dubbo.monitor.MonitorService&mapping-type=metadata&mapping.type=metadata&pid=1437&release=2.7.5&timestamp=1610869049774, dubbo version: 2.7.5, current host: 192.168.0.101

<!-- 启动时候订阅providers,configurators,routers -->

Subscribe: consumer://192.168.0.101/org.apache.dubbo.monitor.MonitorService?application=demo-consumer&category=providers,configurators,routers&dubbo=2.0.2&enable-auto-migration=true&enable.auto.migration=true&interface=org.apache.dubbo.monitor.MonitorService&mapping-type=metadata&mapping.type=metadata&pid=1437&release=2.7.5&timestamp=1610869049774, dubbo version: 2.7.5, current host: 192.168.0.101

<!-- 订阅内容变更时候，会推送category=providers,configurators订阅信息 -->
 Notify urls for subscribe url consumer://192.168.0.101/org.apache.dubbo.monitor.MonitorService?application=demo-consumer&category=providers,configurators,routers&dubbo=2.0.2&enable-auto-migration=true&enable.auto.migration=true&interface=org.apache.dubbo.monitor.MonitorService&mapping-type=metadata&mapping.type=metadata&pid=1437&release=2.7.5&timestamp=1610869049774, urls: [empty://192.168.0.101/org.apache.dubbo.monitor.MonitorService?application=demo-consumer&category=providers&dubbo=2.0.2&enable-auto-migration=true&enable.auto.migration=true&interface=org.apache.dubbo.monitor.MonitorService&mapping-type=metadata&mapping.type=metadata&pid=1437&release=2.7.5&timestamp=1610869049774, empty://192.168.0.101/org.apache.dubbo.monitor.MonitorService?application=demo-consumer&category=configurators&dubbo=2.0.2&enable-auto-migration=true&enable.auto.migration=true&interface=org.apache.dubbo.monitor.MonitorService&mapping-type=metadata&mapping.type=metadata&pid=1437&release=2.7.5&timestamp=1610869049774, empty://192.168.0.101/org.apache.dubbo.monitor.MonitorService?application=demo-consumer&category=routers&dubbo=2.0.2&enable-auto-migration=true&enable.auto.migration=true&interface=org.apache.dubbo.monitor.MonitorService&mapping-type=metadata&mapping.type=metadata&pid=1437&release=2.7.5&timestamp=1610869049774], dubbo version: 2.7.5, current host: 192.168.0.101
```

我们根据dubbo启动和ZooInspector工具分析dubbo，可以画出如下dubbo的原理图:
![image](/dubbo/dubbo架构.png)

#### 源码下载
<a href="https://github.com/zhoubiao188/apache-dubbo-source
">github download apache-dubbo-source</a>



