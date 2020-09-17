
### 如何确保消息100%消费成功？

为了保证消息100%被消费成功（例如，组内消息读取但处理期间消费者崩溃导致的消息丢失）
STREAM 设计2个功能
1. Pending 列表，用于记录读取但并未处理完毕的消息。
2. XACK通知， 完成告知redis消息处理完成

### XPENDIING
命令XPENDIING 用来获消费组或消费内消费者的未处理完毕的消息。
```
XPENDING key group [start end count] [consumer]
```



``` 
39.100.196.99:6379> flushdb
OK
39.100.196.99:6379> multi
OK
39.100.196.99:6379> xadd ordermq * orderno 10001
QUEUED
39.100.196.99:6379> xadd ordermq * orderno 10002
QUEUED
39.100.196.99:6379> xadd ordermq * orderno 10003
QUEUED
39.100.196.99:6379> exec
1) "1588560150589-0"
2) "1588560150590-0"
3) "1588560150590-1"
(0.71s)
39.100.196.99:6379> xgroup CREATE ordermq ordergroup 0
OK

```
查看已读未处理的消息总数
```
39.100.196.99:6379> XPENDING ordermq ordergroup
1) (integer) 0
2) (nil)
3) (nil)
4) (nil)
(1.77s)

39.100.196.99:6379> XREADGROUP GROUP ordergroup consumer-score  COUNT 2 STREAMS ordermq >
1) 1) "ordermq"
   2) 1) 1) "1588560150589-0"
         2) 1) "orderno"
            2) "10001"
      2) 1) "1588560150590-0"
         2) 1) "orderno"
            2) "10002"
(1.25s)
39.100.196.99:6379> XREADGROUP GROUP ordergroup consumer-score  COUNT 2 STREAMS ordermq >
1) 1) "ordermq"
   2) 1) 1) "1588560150590-1"
         2) 1) "orderno"
            2) "10003"

39.100.196.99:6379> XPENDING ordermq ordergroup
1) (integer) 3      #3个已读未处理的消息总数
2) "1588560150589-0" #开始id
3) "1588560150590-1" #结束id
4) 1) 1) "consumer-score" #消费者
      2) "3"              #consumer-scor消费者有3个未读消息
```
查看已读未处理的消息明细
```
39.100.196.99:6379> XPENDING ordermq ordergroup - + 10
1) 1) "1588560150589-0"  #消息id
   2) "consumer-score"   #消费者
   3) (integer) 180924   #从读取到现在的时间
   4) (integer) 1        #消息被读取的次数，1次
2) 1) "1588560150590-0"
   2) "consumer-score"
   3) (integer) 180924
   4) (integer) 1
3) 1) "1588560150590-1"
   2) "consumer-score"
   3) (integer) 173746
   4) (integer) 1
(0.59s)
```

获取具体某个消费者的Pending列表
```
39.100.196.99:6379> XPENDING ordermq ordergroup - + 10  consumer-score
1) 1) "1588560150589-0" #消息ID
   2) "consumer-score"  #所属消费者
   3) (integer) 305600  #IDLE，已读取时长
   4) (integer) 1       #delivery counter，消息被读取次数
2) 1) "1588560150590-0"
   2) "consumer-score"
   3) (integer) 305600
   4) (integer) 1
3) 1) "1588560150590-1"
   2) "consumer-score"
   3) (integer) 298422
   4) (integer) 1
```

上面的结果我们可以看到，我们之前读取的消息，都被记录在Pending列表中，说明全部读到的消息都没有处理，仅仅是读取了


### XACK
上面的结果我们可以看到，我们之前读取的消息，都被记录在Pending列表中，说明全部读到的消息都没有处理，仅仅是读取了。
那如何表示消费者处理完毕了消息呢？使用命令 XACK 完成告知消息处理完成，演示如下：

```
39.100.196.99:6379> XPENDING ordermq ordergroup - + 10  consumer-score
1) 1) "1588560150589-0"
   2) "consumer-score"
   3) (integer) 450843
   4) (integer) 1
2) 1) "1588560150590-0"
   2) "consumer-score"
   3) (integer) 450843
   4) (integer) 1
3) 1) "1588560150590-1"
   2) "consumer-score"
   3) (integer) 443665
   4) (integer) 1
   
39.100.196.99:6379> xack ordermq ordergroup 1588560150589-0 #通知消息处理结束，用消息id表示
(integer) 1

39.100.196.99:6379> XPENDING ordermq ordergroup - + 10  consumer-score  #再次查看XPENDING列表
1) 1) "1588560150590-0"
   2) "consumer-score"
   3) (integer) 535677
   4) (integer) 1
2) 1) "1588560150590-1"
   2) "consumer-score"
   3) (integer) 528499
   4) (integer) 1
```

有了这样一个Pending机制，就意味着在某个消费者读取消息但未处理后，消息是不会丢失的。等待消费者再次上线后，
可以读取该Pending列表，就可以继续处理该消息了，保证消息的有序和不丢失。
