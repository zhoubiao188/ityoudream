# SpringBoot 实现direct交换器消息流

### 图解direct交换器信息流过程
![image](/rmq/rmq-direct.png)

上面的流程很简单，我们来实现一下这个需求

首先我们需要创建一个服务提供者Provider 和 服务消费者Consumer

### 步骤一、创建服务消费者
1.创建一个rabbit-mq-direct-consumer的SpringBoot项目、依赖如下
```xml
  <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
```

2.修改application.yml或者application.properties的文件内容
```yml
spring:
  application:
    name: springboot-rabbit-mq-direct-consumer
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: xxx
    password: xxx

server:
  port: 8080

#设置交换器
mq:
  config:
    exchange: log.direct
    queue:
      info: log.info
      error: log.error
    routing:
      key1: log.info.routing.key
      key2: log.error.routing.key
```

3.对照 图解direct交换器信息流过程图，我们需要编写交换器、以及log.info(处理info日志的服务)和log.error(处理error日志的服务)这两个队列

4.下面我们来编写INFO级别的交换器和日志处理服务
```java
@Component
@RabbitListener(
  bindings = @QueueBinding(
          value =@Queue(value = "${mq.config.queue.info}", autoDelete = "true"),
          exchange = @Exchange(value = "${mq.config.exchange}", type = ExchangeTypes.DIRECT),
          key = "${mq.config.routing.key1}"
  )
)
public class InfoReceiverConsumer {

    @RabbitHandler
    public void process(String msg) {
        System.out.println("接收到INFO日志:" + msg);
    }
}
```
上面的注解解释如下:
```
@Component：声明为Spring的Bean
@RabbitListener：RabbitMQ监听器
bindings = @QueueBinding()绑定信息(队列、交换器、路由键等)
@Queue：队列
@Exchange：交换器
key：路由键
type：指定交换器等类型
```

注意这里的process方法使用了@RabbitHandler注解，意思是当接收到消息到时候交给带有@RabbitHandler方法处理。

5.Error级别的交换器日志处理
```java
@Component
@RabbitListener(
  bindings = @QueueBinding(
          value =@Queue(value = "${mq.config.queue.error}", autoDelete = "true"),
          exchange = @Exchange(value = "${mq.config.exchange}", type = ExchangeTypes.DIRECT),
          key = "${mq.config.routing.key2}"
  )
)
public class ErrorReceiverConsumer {

    @RabbitHandler
    public void process(String msg) {
        System.out.println("接收到ERROR日志:" + msg);
    }
}
```

这个和上面一样，只不过是处理Error的，我这里就不解释了。

### 步骤二、创建服务提供者
1.创建一个rabbit-mq-direct-provider的SpringBoot项目、依赖如下
```xml
  <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-amqp</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
```

2.修改application.yml或者application.properties的文件内容
```yml
spring:
  application:
    name: springboot-rabbit-mq-direct-provider
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: xxx
    password: xxx
server:
  port: 8082

#设置交换器
mq:
  config:
    exchange: log.direct
    queue:
      info: log.info
      error: log.error
    routing:
      key1: log.info.routing.key
      key2: log.error.routing.key
```

3.编写发送者
```java
@Component
public class SenderProvider {
    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${mq.config.exchange}")
    private String exchange;

    @Value("${mq.config.routing.key1}")
    private String infoKey;

    @Value("${mq.config.routing.key2}")
    private String errorKey;

    public String send(String name, String type) {
        String msg = "hello:" + name;
        switch (type) {
            case "1":
                this.rabbitTemplate.convertAndSend(this.exchange, this.infoKey, msg);
             break;
            case "2":
                this.rabbitTemplate.convertAndSend(this.exchange, this.errorKey, msg);
              break;
        }
        return msg;
    }
}
```
上面的代码非常简单，注入AmqpTemplate对象使用其convertAndSend来发送消息

4.编写controller
```java
@RestController
public class DirectController {
    @Autowired
    private SenderProvider senderService;

    @GetMapping("/send")
    public String send(String msg, String type) {
        String result = this.senderService.send(msg, type);
        return result;
    }
}
```

### 步骤三、体验效果
启动服务

实验Info日志
```
http://localhost:8082/send?msg=zhoubiao&type=1
```
实验Error日志
```
http://localhost:8082/send?msg=zhoubiao&type=2
```




