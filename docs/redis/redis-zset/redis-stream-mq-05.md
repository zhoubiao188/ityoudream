## 6.案例实战：积分服务的消费队列 
### 步骤1：集群积分服务A消费
``` java

@Service
@Slf4j
public class ScoreConsumerA {

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 消费任务
     */
    @PostConstruct
    public void consume() {
        log.info("启动消费 ..........");
        new Thread(() -> this.consumeData()).start();
    }


    public void consumeData() {


        StreamOffset streamOffset = StreamOffset.create(Constants.MQ_ORDER, ReadOffset.lastConsumed());
        //创建一个消费者
        Consumer consumer = Consumer.from(Constants.GROUP_SCORE, Constants.CONSUMER_SCORE);
        //block 阻塞 60s读
        StreamReadOptions streamReadOptions = StreamReadOptions.empty().block(Duration.ofMinutes(60));
        while (true) {
            //XREADGROUP GROUP group-score consumer-score  block 60000 STREAMS mq-order >
            List<MapRecord<String, String, String>> list = this.redisTemplate.opsForStream().read(consumer, streamReadOptions, streamOffset);
            for (MapRecord<String, String, String> obj : list) {
                log.info("A积分服务消费了{}", list);
                //TODO 添加积分逻辑

                //通知消息处理结束，用消息ID标识
                //xack ordermq ordergroup 1588560150589-0
                this.redisTemplate.opsForStream().acknowledge(Constants.MQ_ORDER, Constants.GROUP_SCORE, obj.getId());
            }

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

}

```

### 步骤2：订单服务发消息
``` java
    /**
     * 发送消息
     */
    @GetMapping(value = "/add")
    public RecordId add(String orderno) {
        Map<String,String> map=new HashMap<>();
        map.put("orderno",orderno);
        RecordId recordId =this.redisTemplate.opsForStream().add(Constants.MQ_ORDER,map);
        return recordId;
    }
```





## 7.案例实战：积分服务+push服务的集群消费队列

### 步骤3：集群积分服务B消费


### 步骤4：PUSH服务消费
