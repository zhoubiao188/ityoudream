#### Dubbo快速入门之xml方式
如果不想使用Spring来完成Dubbo配置那么可以通过Api配置

#### Dubbo快速起步
##### 步骤一
创建一个dubbo-demo-interface的普通maven项目，没有引用任何项目的依赖，提供一个`DemoService`和`GreetingService`接口类
DemoService如下
```java
public interface DemoService {

    String sayHello(String name);

    default CompletableFuture<String> sayHelloAsync(String name) {
        return CompletableFuture.completedFuture(sayHello(name));
    }

}
```
GreetingService如下
```java
public interface GreetingService {
    String hello();
}
```
DemoService中有一个`sayHello`方法，并且有一个`sayHelloAsync`的异步方法，该异步方法是JDK8支持的`CompletableFuture`

##### 步骤二
创建一个dubbo-demo-xml-provider的普通maven项目，mavan的依赖如下:
```xml
   <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo</artifactId>
            <version>2.7.5</version>
        </dependency>

        <dependency>
            <groupId>org.apache.dubbo</groupId>
            <artifactId>dubbo-dependencies-zookeeper</artifactId>
            <version>2.7.5</version>
            <type>pom</type>
        </dependency>
        <dependency>
            <groupId>cn.ityoudream.dubbo</groupId>
            <artifactId>dubbo-demo-interface</artifactId>
            <version>1.0-SNAPSHOT</version>
            <scope>compile</scope>
        </dependency>
```

注意这里使用的注册中心是zookeeper,当然你可以换成redis也可以，并且我们在这里使用了dubbo-demo-interface，因为我们需要在该服务提供者中实现dubbo-demo-interface中的接口方法。
DemoServiceImpl实现如下
```java
public class DemoServiceImpl implements DemoService {
    private static final Logger logger = LoggerFactory.getLogger(DemoServiceImpl.class);

    @Override
    public String sayHello(String name) {
           //简单的通过Log打印了consumer的地址
        logger.info("Hello " + name + ", request from consumer: " + RpcContext.getContext().getRemoteAddress());
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
           //简单的通过Log打印了provider的地址
        return "Hello " + name + ", response from provider: " + RpcContext.getContext().getLocalAddress();
    }

   //异步调用
    @Override
    public CompletableFuture<String> sayHelloAsync(String name) {
        CompletableFuture<String> cf = CompletableFuture.supplyAsync(() -> {
//            try {
//                Thread.sleep(1000);
//            } catch (InterruptedException e) {
//                e.printStackTrace();
//            }
            return "async result";
        });
        return cf;
    }
}

```
GreetingServiceImpl实现如下
```java
public class GreetingServiceImpl implements GreetingService {
    @Override
    public String hello() {
        return "Greetings!";
    }
}

```
因为我们使用的是Spring来完成的，而Spring的Dubbo采用的是`schema`的方式来实现的，所以我们要配置xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!--约束-->
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:dubbo="http://dubbo.apache.org/schema/dubbo"
       xmlns="http://www.springframework.org/schema/beans"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.3.xsd
       http://dubbo.apache.org/schema/dubbo http://dubbo.apache.org/schema/dubbo/dubbo.xsd">

   <!--声明应用-->
    <dubbo:application name="demo-provider">
        <dubbo:parameter key="mapping-type" value="metadata"/>
    </dubbo:application>

   <!--dubbo的配置中心地址，这里使用的是zookeeper-->
    <dubbo:config-center address="zookeeper://127.0.0.1:2181"/>
    <dubbo:metadata-report address="zookeeper://127.0.0.1:2181"/>
       <!--注册的节点中心1，可以有多个，多个可以使注册中心高可用-->
    <dubbo:registry id="registry1" address="zookeeper://127.0.0.1:2181"/>
    <dubbo:protocol name="dubbo" port="-1"/>

    <!--spring传统注入-->
    <bean id="demoService" class="cn.ityoudream.dubbo.DemoServiceImpl"/>
    <bean id="greetingService" class="cn.ityoudream.dubbo.GreetingServiceImpl"/>

   <!--将接口注册到配置中心里面-->
    <dubbo:service interface="cn.ityoudream.dubbo.DemoService" timeout="3000" ref="demoService" registry="registry1"/>
    <dubbo:service version="1.0.0" group="greeting" timeout="5000" interface="cn.ityoudream.dubbo.GreetingService"
                   ref="greetingService"/>

</beans>

```

##### 步骤三
创建一个dubbo-demo-xml-consumer的普通mavan项目




