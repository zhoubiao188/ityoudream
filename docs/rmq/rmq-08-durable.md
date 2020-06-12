# RabbitMQ持久化
为什么要持久化RabbitMQ呢？
因为在接收信息的时候会有一定几率出现丢包的情况，所以需要将RabbitMQ持久化起来

那么如何持久化呢？其实非常简单只需要向下面一样,把autoDelete设置为false就可以了

```java
@Component
@RabbitListener(
  bindings = @QueueBinding(
          value =@Queue(value = "${mq.config.queue.sms}", autoDelete = "false"),
          exchange = @Exchange(value = "${mq.config.exchange}", type = ExchangeTypes.DIRECT),
          key = "${mq.config.routing.key1}"
  )
)
```

如果将autoDelete设置为false的话，那么即使关闭了服务端，那么下次再开启的时候会继续执行

```
正在发送消息: 1
正在发送消息: 2
正在发送消息: 3
正在发送消息: 4
正在发送消息: 5
```

比如上面正在发送消息发到了数字5，那么服务端被关闭了，那么重新开启服务端的时候，那么会从6开始发送，同样客户端接收也是从6开始接收的，这样就持久化了消息