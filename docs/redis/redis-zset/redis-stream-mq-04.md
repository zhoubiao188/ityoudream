
### 删除死信消息
如果某个消息，不能被消费者处理，也就是不能被XACK，这是要长时间处于Pending列表中，即使被反复的转移给各个消费者也是如此。
此时该消息的delivery counter就会累加（上一节的例子可以看到），当累加到某个我们预设的临界值时，
我们就认为是坏消息（也叫死信，DeadLetter，无法投递的消息），
由于有了判定条件，我们将坏消息处理掉即可，删除即可。
删除一个消息，使用XDEL语法.
```
#查看已读未处理的消息明细
39.100.196.99:6379> xpending ordermq ordergroup - + 10
1) 1) "1588560150590-0"
   2) "consumerA"
   3) (integer) 1256545
   4) (integer) 2
2) 1) "1588560150590-1"
   2) "consumer-score"
   3) (integer) 2681964
   4) (integer) 1
   
#查看队列 
39.100.196.99:6379> xrange ordermq - +
1) 1) "1588560150589-0"
   2) 1) "orderno"
      2) "10001"
2) 1) "1588560150590-0"
   2) 1) "orderno"
      2) "10002"
3) 1) "1588560150590-1"
   2) 1) "orderno"
      2) "10003"

# 使用xdel删除队列的消息
39.100.196.99:6379> xdel ordermq 1588560150590-0
(integer) 1
(0.87s)


39.100.196.99:6379> xrange ordermq - +
1) 1) "1588560150589-0"
   2) 1) "orderno"
      2) "10001"
2) 1) "1588560150590-1"
   2) 1) "orderno"
      2) "10003"

# 删除了队列后，居然未处理的消息居然还存在  
39.100.196.99:6379> xpending ordermq ordergroup - + 10
1) 1) "1588560150590-0"
   2) "consumerA"
   3) (integer) 1436364
   4) (integer) 2
2) 1) "1588560150590-1"
   2) "consumer-score"
   3) (integer) 2861783
   4) (integer) 1
#为了把未处理的消息列表，也删除，我们给他一个ack  
39.100.196.99:6379> xack ordermq ordergroup 1588560150590-0
(integer) 1
#最终删除成功了
39.100.196.99:6379> xpending ordermq ordergroup - + 10
1) 1) "1588560150590-1"
   2) "consumer-score"
   3) (integer) 3000787
   4) (integer) 1
```


