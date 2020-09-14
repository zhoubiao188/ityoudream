
# redis的IM的聊天工具
###  什么是redis的stream数据结构？
Redis 5.0推出了一个新的数据结构：Stream。Stream就是一个流处理 的数据结构.
基于流处理的数据结构，它的功能应用于类似IM的聊天工具和典型的消息队列。
Redis 的Stream几乎满足了消息队列具备的全部内容，包括但不限于：
1.消息ID的序列化生成
2.消息遍历
3.消息的阻塞和非阻塞读取
4.消息的分组消费
5.未完成消息的处理
6.消息队列监控

xadd：向Stream追加消息
xdel：从Stream中删除消息，删除仅仅是设置标志位，不影响消息总长度。
xrange：获取Stream中的消息列表，自动过滤已经删除的消息。-表示最小值，+表示最大值。
xlen：获取Stream的消息长度，所有在链表中存在的消息
del：删除整个Stream中的所有消息。



#### stream生产消息
XADD，命令用于在某个stream（流数据）中追加消息,语法如下：
``` 
xadd key ID field string [field string ...]
```
需要提供key，消息ID方案，消息内容，其中消息内容为key-value型数据。
ID，最常使用*，表示由Redis生成消息ID，这也是强烈建议的方案。
field string [field string], 就是当前消息内容，由1个或多个key-value构成。
``` 
39.100.196.99:6379> xadd message * hello zhoubiao
"1587196058726-0"  #消息ID
39.100.196.99:6379> xadd message * hello zhoubiao2
"1587196063320-0"
39.100.196.99:6379> xadd message * hello zhoubiao3
"1587196067111-0"
```

### stream独立消费

从消息队列中获取消息，XREAD，消费消息
``` 
xread [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] ID [ID ...]
```
[COUNT count]，用于限定获取的消息数量
[BLOCK milliseconds]，用于设置XREAD为阻塞模式，默认为非阻塞模式
ID，用于设置由哪个消息ID开始读取。使用0表示从第一条消息开始。（本例中就是使用0），
消息队列ID是单调递增的，所以通过设置起点，可以向后读取。在阻塞模式中，可以使用，表示最新的消息ID。
``` 
39.100.196.99:6379> xread STREAMS message 0
1) 1) "message"
   2) 1) 1) "1587196058726-0"
         2) 1) "hello"
            2) "zhoubiao"
      2) 1) "1587196063320-0"
         2) 1) "hello"
            2) "zhoubiao2"
      3) 1) "1587196067111-0"
         2) 1) "hello"
            2) "zhoubiao3"
```

### 消息ID的原理
上文这个消息id 1587196058726-0，是redis 生成的消息id。
它由2部分组成：时间戳-序号。时间戳是毫秒级，序号是为了防止相同时间内生成的id重复。
``` 
39.100.196.99:6379> multi
OK
39.100.196.99:6379> xadd message * hello zhoubiao1
QUEUED
39.100.196.99:6379> xadd message * hello zhoubiao2
QUEUED
39.100.196.99:6379> xadd message * hello zhoubiao3
QUEUED
39.100.196.99:6379> exec
1) "1587198991846-0"
2) "1587198991846-1"
3) "1587198991846-2"
```

## IM聊天室
业务场景：互联网很多在线客服，在线咨询，或在线聊天室，例如有2个人 zhoubiao alex ，分别进行在线实时咨询聊天，如下：
zhoubiao: hi
alex: hi hi
zhoubiao: how are you
alex: I fine


### zhoubiao的聊天
``` 
39.100.196.99:6379> xadd roomA * zhoubiao hi # 发送消息
"1587199309199-0"
39.100.196.99:6379> xread BLOCK 600000 STREAMS roomA $ #等10分钟，等消息；指定$表示只接收实时的最新消息。
1) 1) "roomA"
   2) 1) 1) "1587199436403-0"
         2) 1) "alex"
            2) "hi hi"
(91.54s)
39.100.196.99:6379> xadd roomA * zhoubiao "how are you" # 再次发送消息
"1587199484867-0"
39.100.196.99:6379> xread BLOCK 600000 STREAMS roomA $  #等10分钟，等消息；
1) 1) "roomA"
   2) 1) 1) "1587199523884-0"
         2) 1) "alex"
            2) "I fine"
(28.48s)
```


### alex的聊天
``` 
39.100.196.99:6379> xread BLOCK 600000 STREAMS roomA $
1) 1) "roomA"
   2) 1) 1) "1587199309199-0"
         2) 1) "zhoubiao"
            2) "hi"
(9.20s)
39.100.196.99:6379>
39.100.196.99:6379> xadd roomA *  alex "hi hi"
"1587199436403-0"
39.100.196.99:6379> xread BLOCK 600000 STREAMS roomA $
1) 1) "roomA"
   2) 1) 1) "1587199484867-0"
         2) 1) "zhoubiao"
            2) "how are you"
(34.58s)
39.100.196.99:6379> xadd roomA *  alex "I fine"
"1587199523884-0"
```

### 关于未读消息的处理
XREAD的语法如下：
``` 
xread [COUNT count] [BLOCK milliseconds] STREAMS key [key ...] ID [ID ...]
```
上文的例子中，$代表是一个特殊起始ID读取消息，表示只接收实时最新的频道消息
也可以用ID来处理，ID代表来取该ID之后的消息。
这个ID非常重要，主要用在当一个用户断开连接重新加入聊天时，可以通过上一个ID，拉取历史消息：
例如：当用户读到1587199309199-0在，断开连接了，可以通过如下，拉取历史数据。
``` 
39.100.196.99:6379> xread BLOCK 600000 STREAMS roomA 1587199309199-0
1) 1) "roomA"
   2) 1) 1) "1587199436403-0"
         2) 1) "alex"
            2) "hi hi"
      2) 1) "1587199484867-0"
         2) 1) "zhoubiao"
            2) "how are you"
      3) 1) "1587199523884-0"
         2) 1) "alex"
            2) "I fine"
```


zhoubiao: hi
alex: hi hi
zhoubiao: how are you
alex: I fine