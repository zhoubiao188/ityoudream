# RabbitMQ 入门

### 什么是队列
![image](/rmq/rmq-queue.png)

### 步骤一
创建SpringBoot项目，引入RabbitMQ依赖
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

### 步骤二
配置application.yml或者是application.properties
```yml
spring:
  application:
    name: springboot-rabbit-mq
  rabbitmq:
    host: 127.0.0.1
    port: 5672
    username: xxx
    password: xxxx
server:
  port: 8080

rabbitmq:
  queue: hello-rabbitmq-queue
```

### 步骤三
创建RabbitMQ队列
```java
@Configuration
public class SenderConfig {
    @Value("${rabbitmq.queue}")
    private String queue;

    /**
     * 建立一个简单队列
     * @return
     */
    @Bean
    public Queue queue() {
        return new Queue(queue);
    }
}
```

### 步骤四
编写发送者代码
```java
@Component
public class SenderProvider {
    @Autowired
    private AmqpTemplate rabbitTemplate;

    @Value("${rabbitmq.queue}")
    private String queue;

    public String send(String name) {
        String msg = "hello" + name;
        this.rabbitTemplate.convertAndSend(queue, msg);
        return msg;
    }
}
```

### 步骤五
编写消息接受者代码
```java
@Component
public class ReceiverConsumer {

    @RabbitListener(queues = "hello-rabbitmq-queue")
    public void process(String msg) {
        System.out.println("receiver:" + msg);
    }
}
```
### 步骤六
编写MsgController体验效果
```java
@RestController
public class MsgController {
    @Autowired
    private SenderProvider senderProvider;
    @GetMapping("/sendMsg")
    public String msg(String msg) {
        String result = this.senderProvider.send(msg);
        return result;
    }
}
```

### 体验结果
![image](/rmq/rabbitmq-test.png)

![image](/rmq/rabbitmq-view.png)
