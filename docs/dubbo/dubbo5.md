#### Dubbo的SPI实现原理
Dubbo的内核由SPI、Aop、IOC、Compiler(动态编译)组成，下面是Dubbo内核图
![image](/dubbo/dubbo-内核.png)

Dubbo没有采用JDK的默认实现的SPI、而是模仿JDK的SPI实现，并且改进了JDK的一运行就全部加载所有的SPI接口，而Dubbo的是按需加载，不用全部调用，想用那个就用那个。那么我们常见的一些依赖那些是用了JDK的SPI呢？比如`mysql-connector-java.jar`,JDK的SPI是在META-INFO文件中

![image](/dubbo/mysql-spi.png)

#### JDK的默认SPI实现例子
首先我们创建一个项目，jdk-default-spi，然后我们需要定义一个Command接口，提供一个自定义方法如：
```java
/**
 * 定义Spi接口
 */
public interface Command {
    public void execute();
}
```
然后实现一个关机和启动的Command的实现类，实现`Command`中的`execute`方法
```java
public class StartCommand implements Command{
    @Override
    public void execute() {
        System.out.println("start........");
    }
}
```

```java
public class ShutDownCommand implements Command{
    @Override
    public void execute() {
        System.out.println("shutdown.....");
    }
}
```
然后需要创建一个resources文件夹作为资源文件夹，在里面创建一个META-INF的文件夹，在里面在创建一个services文件夹，在services文件中创建一个Command的全路径名：cn.ityoudream.jdk.spi.Command，里面的内容
```
cn.ityoudream.jdk.spi.StartCommand

cn.ityoudream.jdk.spi.ShutDownCommand
```

最后需要创建一个Main方法来测试:
```java
/**
 * spi的设计目标：
 * 面向的对象的设计里，模块之间是基于接口编程，模块之间不对实现类进行硬编码。
 * 一旦代码里涉及具体的实现类，就违反了可拔插的原则，如果需要替换一种实现，就需要修改代码。
 * 为了实现在模块装配的时候，不在模块里面写死代码，这就需要一种服务发现机制。
 * java spi就是提供这样的一个机制：
 * 为某个接口寻找服务实现的机制。有点类似IOC的思想，就是将装配的控制权移到代码之外。
 *
 *
 * spi的具体约定如下  ：
 * 当服务的提供者(provider)，提供了一个接口多种实现时，
 * 一般会在jar包的META-INF/services/目录下，创建该接口的同名文件。
 * 该文件里面的内容就是该服务接口的具体实现类的名称。
 * 而当外部加载这个模块的时候，
 * 就能通过该jar包META-INF/services/里的配置文件得到具体的实现类名，并加载实例化，完成模块的装配。
 */
public class Main {
    public static void main(String[] args) {
        //通过ServiceLoader来加载Command中的SPI实现
        ServiceLoader<Command> serviceLoader = ServiceLoader.load(Command.class);
        for (Command command : serviceLoader) {
            //调用execute
            command.execute();
        }
    }
}
```
下面是jdk-default-spi项目的总揽结构图
![image](/dubbo/project-view.png)

#### 为什么Dubbo不采用JDK的SPI
主要有两个原因：
```
JDK标准的SPI会一次性实例化扩展点所有实现，如果有扩展实现初始化很耗时，但如果没用上也加载，会很浪费资源.

增加了对扩展点IoC和AOP的支持，一个扩展点可以直接setter注入其它扩展点。
```

#### Duubo SPI 有哪些约定？
下面是Dubbo的SPI结构
![image](/dubbo/dubbo-core-spi.png)

```
spi 文件 存储路径 在 META-INF\dubbo\internal 目录下 并且文件名为接口的全路径名 就是=接口的包名+接口名

每个spi 文件里面的格式定义为： 扩展名=具体的类名，例如 dubbo=com.alibaba.dubbo.rpc.protocol.dubbo.DubboProtoco

```
Dubbo可以通过配置文件中的key来实现按需加载，而不是像JDK那样全部加载，这样就不会造成资源的浪费

#### Dubbo SPI的目的是什么
dubbo spi 的目的：获取一个指定实现类的对象。
途径：`ExtensionLoader.getExtension(String name)`
实现路径：
`getExtensionLoader(Class<T> type) `就是为该接口new 一个`ExtensionLoader`，然后缓存起来。
获取一个扩展类，如果`@Adaptive`注解在类上就是一个装饰类；如果注解在方法上就是一个动态代理类，例如Protocol$Adaptive对象。
`getExtension(String name) `获取一个指定对象。

-----------------------ExtensionLoader.getExtensionLoader(Class<T> type)
ExtensionLoader.getExtensionLoader(Container.class)
  -->this.type = type;
  -->objectFactory = (type == ExtensionFactory.class ? null : ExtensionLoader.getExtensionLoader(ExtensionFactory.class).getAdaptiveExtension());
     -->ExtensionLoader.getExtensionLoader(ExtensionFactory.class).getAdaptiveExtension()
       -->this.type = type;
       -->objectFactory =null;
       
执行以上代码完成了2个属性的初始化
```
1.每个一个ExtensionLoader都包含了2个值 type 和 objectFactory
  Class<?> type；//构造器  初始化时要得到的接口名
  ExtensionFactory objectFactory//构造器  初始化时 AdaptiveExtensionFactory[SpiExtensionFactory,SpringExtensionFactory]
  
2.new 一个ExtensionLoader 存储在ConcurrentMap<Class<?>, ExtensionLoader<?>> EXTENSION_LOADERS
关于这个objectFactory的一些细节：
1.objectFactory就是ExtensionFactory，它也是通过ExtensionLoader.getExtensionLoader(ExtensionFactory.class)来实现的，但是它的objectFactory=null

2.objectFactory作用，它就是为dubbo的IOC提供所有对象。
```






