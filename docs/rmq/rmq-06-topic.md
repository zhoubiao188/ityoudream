# SpringBoot 实现topic交换器消息流

### 图解topic交换器信息流过程

![image](/rmq/rmq-topic.png)

我们照着上面的图来实现topic交换器

### 步骤一、创建服务消费者
1.创建一个rabbit-mq-topic-consumer的SpringBoot工程(服务消费者)
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
    name: springboot-rabbit-mq-topic-consumer
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: xxxx
    password: xxxx

server:
  port: 8080

#设置交换器
mq:
  config:
    exchange: log.topic
    queue:
      info: log.info
      error: log.error
      logs: log.msg
```
3.编写Info的Topic处理类
```java
@Component
@RabbitListener(
  bindings = @QueueBinding(
          value =@Queue(value = "${mq.config.queue.info}", autoDelete = "true"),
          exchange = @Exchange(value = "${mq.config.exchange}", type = ExchangeTypes.TOPIC),
          key = "*.log.info"
  )
)
public class InfoReceiverConsumer {

    @RabbitHandler
    public void process(String msg) {
        System.out.println("info-----------------日志:" + msg);
    }
}
```

4.编写Error的Topic处理类
```java
@Component
@RabbitListener(
  bindings = @QueueBinding(
          value =@Queue(value = "${mq.config.queue.error}", autoDelete = "true"),
          exchange = @Exchange(value = "${mq.config.exchange}", type = ExchangeTypes.TOPIC),
          key = "*.log.error"
  )
)
public class ErrorReceiverConsumer {

    @RabbitHandler
    public void process(String msg) {
        System.out.println("error-----------------日志:" + msg);
    }
}
```
5.编写Logs的Topic处理类

```java
@Component
@RabbitListener(
  bindings = @QueueBinding(
          value =@Queue(value = "${mq.config.queue.logs}", autoDelete = "true"),
          exchange = @Exchange(value = "${mq.config.exchange}", type = ExchangeTypes.TOPIC),
          key = "*.log.*"
  )
)
public class LogsReceiverConsumer {

    @RabbitHandler
    public void process(String msg) {
        System.out.println("all----------------日志" + msg);
    }
}
```
::: warning
注意这里的type类型是topic类型，并且key使用来模糊匹配
:::

### 步骤二、创建服务提供者
1.创建一个rabbit-mq-topic-provider的SpringBoot工程(服务提供者)
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
    name: springboot-rabbit-mq-topic-provider
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: xxxx
    password: xxxx
server:
  port: 8082

#设置交换器
mq:
  config:
    exchange: log.topic
```

3.编写用户服务类
```java
@Component
public class UserSenderProvider {
    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${mq.config.exchange}")
    private String exchange;
    public void send() {
       this.rabbitTemplate.convertAndSend(this.exchange,"user.log.debug", "user.log.debug....");
       this.rabbitTemplate.convertAndSend(this.exchange, "user.log.info", "user.log.info...");
       this.rabbitTemplate.convertAndSend(this.exchange, "user.log.warn", "user.log.warn...");
       this.rabbitTemplate.convertAndSend(this.exchange, "user.log.error", "user.log.error...");
    }
}
```

4.编写商品服务
```java
@Component
public class ProductSenderProvider {
    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${mq.config.exchange}")
    private String exchange;

    public void send() {
       this.rabbitTemplate.convertAndSend(this.exchange,"product.log.debug", "product.log.debug...");
       this.rabbitTemplate.convertAndSend(this.exchange, "product.log.info", "product.log.info...");
       this.rabbitTemplate.convertAndSend(this.exchange, "product.log.warn", "product.log.warn...");
       this.rabbitTemplate.convertAndSend(this.exchange, "product.log.error", "product.log.error...");
    }
}
```

5.编写订单服务
```java
@Component
public class OrderSenderProvider {
    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${mq.config.exchange}")
    private String exchange;

    public void send() {
       this.rabbitTemplate.convertAndSend(this.exchange,"order.log.debug", "order.log.debug...");
       this.rabbitTemplate.convertAndSend(this.exchange, "order.log.info", "order.log.info...");
       this.rabbitTemplate.convertAndSend(this.exchange, "order.log.warn", "order.log.warn...");
       this.rabbitTemplate.convertAndSend(this.exchange, "order.log.error", "order.log.error...");
    }
}
```

::: warning
注意这里我们都对日志指定了debug、info、warn、error级别
:::

5.编写TopicController
```java
@RestController
public class TopicController {
    @Autowired
    private UserSenderProvider userSenderProvider;
    @Autowired
    private ProductSenderProvider productSenderProvider;
    @Autowired
    private OrderSenderProvider orderSenderProvider;

    @GetMapping("/send")
    public void send() {
      this.userSenderProvider.send();
      this.productSenderProvider.send();
      this.orderSenderProvider.send();
    }
```
### 步骤三、体验效果
访问http://localhost:8082/send

consumer消费者接收的日志如下
```
error-----------------日志:user.log.error...
info-----------------日志:user.log.info...
error-----------------日志:product.log.error...
all----------------日志user.log.debug....
error-----------------日志:order.log.error...
all----------------日志user.log.info...
all----------------日志user.log.warn...
all----------------日志user.log.error...
all----------------日志product.log.debug...
info-----------------日志:product.log.info...
info-----------------日志:order.log.info...
all----------------日志product.log.info...
all----------------日志product.log.warn...
all----------------日志product.log.error...
all----------------日志order.log.debug...
all----------------日志order.log.info...
all----------------日志order.log.warn...
all----------------日志order.log.error...
```

可以看到error、info都分别输出了三次、而all全部都输出了，这里使用了模糊匹配，所以不管是什么只要是log的都输出








