## kafka 实现微信调查问卷
#### 微信接口定义
```java

public interface WechatTemplateService {

    // 获取微信调查问卷模板 - 获取目前active为true的模板就可以了
    WechatTemplateProperties.WechatTemplate getWechatTemplate();

    // 上报调查问卷填写结果
    void templateReported(JSONObject reportInfo);

    // 获取调查问卷的统计结果
    JSONObject templateStatistics(String templateId);

}
```
#### 微信接口具体实现
```java
@Slf4j
@Service
public class WechatTemplateServiceImpl implements WechatTemplateService{

    @Autowired
    private WechatTemplateProperties properties;

    @Autowired
    private Producer producer;
    /*
        获取目前active为true的调查问卷模板
     */
    @Override
    public WechatTemplateProperties.WechatTemplate getWechatTemplate() {

        List<WechatTemplateProperties.WechatTemplate> templates = properties.getTemplates();

        Optional<WechatTemplateProperties.WechatTemplate> wechatTemplate
                = templates.stream().filter((template) -> template.isActive()).findFirst();

        return wechatTemplate.isPresent() ? wechatTemplate.get() : null;
    }

    @Override
    public void templateReported(JSONObject reportInfo) {
        // kafka producer将数据推送至Kafka Topic
        log.info("templateReported : [{}]", reportInfo);
        String topicName = "jiangzh-topic";
        // 发送Kafka数据
        String templateId = reportInfo.getString("templateId");
        JSONArray reportData = reportInfo.getJSONArray("result");

        // 如果templateid相同，后续在统计分析时，可以考虑将相同的id的内容放入同一个partition，便于分析使用
        ProducerRecord<String,Object> record =
                new ProducerRecord<>(topicName,templateId,reportData);

        /*
            1、Kafka Producer是线程安全的，建议多线程复用，如果每个线程都创建，出现大量的上下文切换或争抢的情况，影响Kafka效率
            2、Kafka Producer的key是一个很重要的内容：
                2.1 我们可以根据Key完成Partition的负载均衡
                2.2 合理的Key设计，可以让Flink、Spark Streaming之类的实时分析工具做更快速处理

            3、ack - all， kafka层面上就已经有了只有一次的消息投递保障，但是如果想真的不丢数据，最好自行处理异常
         */
        try{
            producer.send(record);
        }catch (Exception e){
            // 将数据加入重发队列， redis，es，...
        }

    }

    @Override
    public JSONObject templateStatistics(String templateId) {
        // 判断数据结果获取类型
        if(properties.getTemplateResultType() == 0){ // 文件获取
            return FileUtils.readFile2JsonObject(properties.getTemplateResultFilePath()).get();
        }else{
            // DB ..
        }
        return null;
    }
}

```