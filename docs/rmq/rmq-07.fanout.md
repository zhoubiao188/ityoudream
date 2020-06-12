# SpringBoot 实现fanout交换器消息流

![image](/rmq/rmq-fanout-1.png)

如果用户在淘宝购买商品后，那么订单服务就要给用户发短信和push，如果没有使用RabbitMQ那么就只能如上图所示，短信服务和push服务都要写死在订单服务中。

但是如果你使用了RabbitMQ那么将会变成下面的这个样子
![image](/rmq/rmq-fanout-2.png)

这里的订单服务只和消息队列做交互，其它的都不用管，短信服务和push服务呢都订阅了消息队列MQ，只要有消息它就会接收到

下面还是实战，实现fanout消息流

### 步骤一、创建服务消费者
1.创建一个rabbit-mq-fanout-consumer的SpringBoot工程(服务消费者)

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
    name: springboot-rabbit-mq-fanout-consumer
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
    exchange: order.fanout
    queue:
      sms: order.sms
      push: order.push
```

3.创建短信业务类
```java
@Component
@RabbitListener(
  bindings = @QueueBinding(
          value =@Queue(value = "${mq.config.queue.sms}", autoDelete = "true"),
          exchange = @Exchange(value = "${mq.config.exchange}", type = ExchangeTypes.FANOUT)
  )
)
public class SmsReceiverConsumer {
    @RabbitHandler
    public void process(String msg) {
        System.out.println("短信处理:" + msg);
    }
}
```

4.创建push业务类
```java
@Component
@RabbitListener(
  bindings = @QueueBinding(
          value =@Queue(value = "${mq.config.queue.push}", autoDelete = "true"),
          exchange = @Exchange(value = "${mq.config.exchange}", type = ExchangeTypes.FANOUT)
  )
)
public class PushReceiverConsumer {
    @RabbitHandler
    public void process(String msg) {
        System.out.println("push处理:" + msg);
    }
}
```

::: warning
这里的代码都非常简单，只不过将type类型换成了fanout
:::

### 步骤二、创建服务提供者
1.创建一个rabbit-mq-fanout-provider的SpringBoot工程(服务提供者)
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
    name: springboot-rabbit-mq-fanout-provider
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
    exchange: order.fanout
```

3.编写发送方法
```java
@Component
public class SenderProvider {
    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${mq.config.exchange}")
    private String exchange;

    public String send(String name) {
        String msg = "hello:" + name;
        this.rabbitTemplate.convertAndSend(this.exchange, "", msg);
        return msg;
    }
}
```

::: warning
这里需要注意的是这里没有路由键，所以convertAndSend方法参数中让它为空字符串就行
:::

4.编写controller
```java
@RestController
public class FanoutController {
    @Autowired
    private SenderProvider senderService;

    @GetMapping("/send")
    public String send(String msg) {
        String result = this.senderService.send(msg);
        return result;
    }
}
```

### 步骤三、体验效果
访问http://localhost:8082/send?name=zhoubiao

### 新的需求
如果有一天老板需要在下订单后，返现一个10元红包给客户，如果你没有使用RabbitMQ那么只能将红包的业务逻辑代码写死在订单服务里面，但是如果你使用了RabbitMQ，那么会变成如下

![image](/rmq/rmq-fanout-3.png)

我使用了RabbitMQ，我只需要加一个红包服务去订阅消息队列中的红包信息就OK了，非常的方便

```yml
mq:
  config:
    exchange: order.fanout
    queue:
      sms: order.sms
      push: order.push
      red: order.red
```

```java
@Component
@RabbitListener(
  bindings = @QueueBinding(
          value =@Queue(value = "${mq.config.queue.red}", autoDelete = "true"),
          exchange = @Exchange(value = "${mq.config.exchange}", type = ExchangeTypes.FANOUT)
  )
)
public class RedReceiverConsumer {
    @RabbitHandler
    public void process(String msg) {
        System.out.println("为用户送10元红包:" + msg);
    }
}
```



