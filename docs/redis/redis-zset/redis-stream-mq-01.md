## stream消息队列实战
### 订单服务与积分服务的stream消息队列

### 为什么要用消息组？它解决了什么问题？
用过消息队列的同学应该知道目前比较流行的有RabbitMq、kafka等。
现在redis5.0 也完美支持消息队列。
例如 电商的订单，用户下完订单号，就要给用户添加积分 和发 app push消息.
如图1 以上这张图看上去，表面没有问题，但是部署集群的情况下就有问题了，如图2：



积分服务 和 push服务都部署集群的情况下，我们来演示会出什么问题：

1.订单服务发送3条订单数据
``` 
39.100.196.99:6379> multi
OK
(1.07s)
39.100.196.99:6379> xadd ordermq * orderno 10001
QUEUED
39.100.196.99:6379> xadd ordermq * orderno 10002
QUEUED
(1.94s)
39.100.196.99:6379> xadd ordermq * orderno 10003
QUEUED
39.100.196.99:6379> exec
1) "1587782682562-0"
2) "1587782682562-1"
3) "1587782682562-2"
```
2.集群中的第一个积分服务消费
``` 
39.100.196.99:6379> xread streams ordermq 0
1) 1) "ordermq"
   2) 1) 1) "1587782682562-0"
         2) 1) "orderno"
            2) "10001"
      2) 1) "1587782682562-1"
         2) 1) "orderno"
            2) "10002"
      3) 1) "1587782682562-2"
         2) 1) "orderno"
            2) "10003"
```
3.集群中的第二个积分服务消费
``` 
39.100.196.99:6379> xread streams ordermq 0
1) 1) "ordermq"
   2) 1) 1) "1587782682562-0"
         2) 1) "orderno"
            2) "10001"
      2) 1) "1587782682562-1"
         2) 1) "orderno"
            2) "10002"
      3) 1) "1587782682562-2"
         2) 1) "orderno"
            2) "10003"
```
观察以上数据，在集群的环境中，例如积分服务双实例，必然导致消息重复消费的问题。
为了解决这个问题，redis引入了消费组的概念。
什么是消息组呢？





### 案例实战：积分服务消息组
### 什么是消息组
如果你用过rabbitmq或 kafka就知道它的作用。
例如 积分服务在集群环境中部署了2台相同代码，都可以读取redis stream
如果直接采用xread读取，就会2台都会收到一模一样的数据。
为了解决，集群环境中，只有一台能消费消息,redis设计了消息组的概念。
消息组：一个消费组(group)内允许有多个消费者(consumer)（上面的直接执行 XREAD 指令的都是消费者），但是1条消息只会投递到其中一个 consumer上，
也就是组内每个 consumer 都会收到不同的消息。（这种模式术语叫做 集群模式）


#### 步骤1：先创建一个消息队列
沿用我们的消息队列，上节课的内容，队列名： ordermq
``` 
39.100.196.99:6379> xread streams ordermq 0
1) 1) "ordermq"
   2) 1) 1) "1587783541474-0"
         2) 1) "orderno"
            2) "10001"
      2) 1) "1587783541474-1"
         2) 1) "orderno"
            2) "10002"
      3) 1) "1587783541474-2"
         2) 1) "orderno"
            2) "10003"
```

#### 步骤2：创建一个消费组
XGROUP命令：
``` 
xgroup [CREATE key groupname id-or-$] [SETID key id-or-$] [DESTROY key groupname] [DELCONSUMER key groupname consumername]
```

CREATE创建组，SETID更新组起始消息ID，DESTROY销毁组，DELCONSUMER删除组内消费者等操作。
```
39.100.196.99:6379> xgroup CREATE ordermq ordergroup 0
OK
```
$意思从新消息开始分发，注意因为group是在服务端的结构，所以这里用的词是分发，而不是接收。
如果是填写id，代表消费，例如 填0，表示该组从第一条消息开始消费。

注意：
如果ordermq不存在时，会抛出以下异常，代表没要找到stream的key ordermq
 NOGROUP No such key 'ordermq' or consumer group 'ordergroup' in XREADGROUP with GROUP option
报这种错的解决方案有2种：
1. 先创建先创建一个消息队列  xadd ordermq * orderno 10001
2. 创建一个空流 ：XGROUP CREATE ordermq ordergroup $ MKSTREAM



#### 步骤3：多个消费者消费
XREADGROUP命令
``` 
XREADGROUP GROUP group consumer [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] ID [ID ...]
```

## 集群环境第一个积分服务进行消费
```
39.100.196.99:6379> XREADGROUP GROUP ordergroup consumer-score  COUNT 2 STREAMS ordermq >
1) 1) "ordermq"
   2) 1) 1) "1587783541474-0"
         2) 1) "orderno"
            2) "10001"
      2) 1) "1587783541474-1"
         2) 1) "orderno"
            2) "10002"
```
## 集群环境第二个积分服务进行消费
``` 
39.100.196.99:6379> XREADGROUP GROUP ordergroup consumer-score  COUNT 2 STREAMS ordermq >
1) 1) "ordermq"
   2) 1) 1) "1587783541474-2"
         2) 1) "orderno"
            2) "10003"
```
语法说明：
XREADGROUP group ordergroup consumer-score count 2 streams ordermq >
消费者consumer-score,进入组ordergroup内，消费ordermq的数据
参数>表示未被组内消费的起始消息
参数count 2表示获取2条

组内消费的基本原理
STREAM类型会为每个组记录一个最后处理（交付）的消息ID（last_delivered_id），
这样在组内消费时，就可以从这个值后面开始读取，保证不重复消费。








