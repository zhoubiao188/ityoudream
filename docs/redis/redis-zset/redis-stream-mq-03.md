### 没人消费的消息，采用消息转移
有这样一种场景：有些消息一直没消费处理，例如某个消费者宕机之后，没有办法再上线了，那么就需要将该消费者Pending的消息，
转移给其他的消费者处理，就是消息转移。
消息转移的操作时，将某个消息转移到其他的消费者的Pending列表中。
消息转移XCLAIM语法
```
xclaim key group consumer min-idle-time ID [ID ...] [IDLE ms] [TIME ms-unix-time] [RETRYCOUNT count] [force] [justid]
```
需要设置组、转移的目标消费者和消息ID，同时需要提供IDLE（已被读取时长），只有超过这个时长，才能被转移。

```
# 查出当前 consumer-score未处理的消息
39.100.196.99:6379> xpending ordermq ordergroup - + 10 consumer-score
1) 1) "1588560150590-0"
   2) "consumer-score"
   3) (integer) 1238502 #超过了1238502ms未处理
   4) (integer) 1       #消息被读取了1次
2) 1) "1588560150590-1"
   2) "consumer-score"
   3) (integer) 1231324
   4) (integer) 1
   
# 转移超过60000ms的消息1588560150590-0 转移到consumerA的pending列表
39.100.196.99:6379> xclaim ordermq ordergroup consumerA 60000 1588560150590-0
1) 1) "1588560150590-0"  #转移成功的返回结果
   2) 1) "orderno"
      2) "10002"
(0.62s)

# 再次查看列表发现consumerA多了1条
39.100.196.99:6379> xpending ordermq ordergroup - + 10
1) 1) "1588560150590-0"
   2) "consumerA"        #consumerA已经把1588560150590-0转移到自己的队列中。
   3) (integer) 48236    #这个时间已经重置，不再是原来的时间
   4) (integer) 2        #消息被转移后，会累计1，即读取了2次。
2) 1) "1588560150590-1"
   2) "consumer-score"
   3) (integer) 1473655
   4) (integer) 1
```



