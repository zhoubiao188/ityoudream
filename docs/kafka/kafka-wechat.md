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

#### 文件上传工具类
```java
@Slf4j
public class FileUtils {

  public static String readFile(String filePath) throws IOException {
    @Cleanup
    BufferedReader reader = new BufferedReader(
        new FileReader(new File(filePath))
    );

    String lineStr = "";
    StringBuffer stringBuffer = new StringBuffer();
    while ((lineStr = reader.readLine()) != null) {
      stringBuffer.append(lineStr);
    }

    return stringBuffer.toString();
  }


  public static Optional<JSONObject> readFile2JsonObject(String filePath){
    try {
      String fileContent = readFile(filePath);
      log.info("readFile2Json fileContent: [{}]" , fileContent);
      return Optional.ofNullable(JSON.parseObject(fileContent));
    } catch (IOException e) {
      e.printStackTrace();
    }
    return Optional.empty();
  }

  public static Optional<JSONArray> readFile2JsonArray(String filePath){
    try {
      String fileContent = readFile(filePath);
      log.info("readFile2JsonArray fileContent: [{}]" , fileContent);
      return Optional.ofNullable(JSON.parseArray(fileContent));
    } catch (IOException e) {
      e.printStackTrace();
    }
    return Optional.empty();
  }

}
```

#### kafka连接配置
```java
@Configuration
public class KafkaConf {

    @Autowired
    private KafkaProperties kafkaProperties;

    @Bean
    public Producer kafkaProducer(){
        Properties properties = new Properties();
        properties.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, kafkaProperties.getBootstrapServers());
        properties.put(ProducerConfig.ACKS_CONFIG, kafkaProperties.getAcksConfig());
        properties.put(ProducerConfig.RETRIES_CONFIG,"0");
        properties.put(ProducerConfig.BATCH_SIZE_CONFIG,"16384");
        properties.put(ProducerConfig.LINGER_MS_CONFIG,"1");
        properties.put(ProducerConfig.BUFFER_MEMORY_CONFIG,"33554432");

        properties.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,"org.apache.kafka.common.serialization.StringSerializer");
        properties.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,"org.apache.kafka.common.serialization.StringSerializer");
//        properties.put(ProducerConfig.PARTITIONER_CLASS_CONFIG,"com.imooc.jiangzh.kafka.producer.SamplePartition");

        // Producer的主对象
        Producer<String,String> producer = new KafkaProducer<>(properties);

        return producer;
    }

}

```

#### application.properties 读取配置 java类
```java
@Data
@Configuration
@ConfigurationProperties(prefix = "wechat.kafka")
public class KafkaProperties {

    private String bootstrapServers;
    private String acksConfig;
    private String partitionerClass;

}
```

```java
@Data
@Configuration
@ConfigurationProperties(prefix = "template")
public class WechatTemplateProperties {

    private List<WechatTemplate> templates;
    private int templateResultType; // 0-文件获取 1-数据库获取 2-ES
    private String templateResultFilePath;

    @Data
    public static class WechatTemplate{
        private String templateId;
        private String templateFilePath;
        private boolean active;
    }

}
```
#### 请求响应体
```java
@Data
public class BaseResponseVO<M> {

  private String requestId;
  private M result;

  public static<M> BaseResponseVO success(){
    BaseResponseVO baseResponseVO = new BaseResponseVO();
    baseResponseVO.setRequestId(genRequestId());

    return baseResponseVO;
  }

  public static<M> BaseResponseVO success(M result){
    BaseResponseVO baseResponseVO = new BaseResponseVO();
    baseResponseVO.setRequestId(genRequestId());
    baseResponseVO.setResult(result);

    return baseResponseVO;
  }

  private static String genRequestId(){
    return UUID.randomUUID().toString();
  }

}

```

#### 跨越配置文件 
```java
@WebFilter(filterName = "CorsFilter")
@Configuration
public class CorsFilter implements Filter {
  @Override
  public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
    HttpServletResponse response = (HttpServletResponse) res;
    response.setHeader("Access-Control-Allow-Origin","*");
    response.setHeader("Access-Control-Allow-Credentials", "true");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, PUT");
    response.setHeader("Access-Control-Max-Age", "3600");
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    chain.doFilter(req, res);
  }
}
```
#### controller 编写
```java
@RestController
@RequestMapping(value = "/v1")
public class WechatTemplateController {

    @Autowired
    private WechatTemplateProperties properties;

    @Autowired
    private WechatTemplateService wechatTemplateService;

    @RequestMapping(value = "/template", method = RequestMethod.GET)
    public BaseResponseVO getTemplate(){

        WechatTemplateProperties.WechatTemplate wechatTemplate = wechatTemplateService.getWechatTemplate();

        Map<String, Object> result = Maps.newHashMap();
        result.put("templateId",wechatTemplate.getTemplateId());
        result.put("template", FileUtils.readFile2JsonArray(wechatTemplate.getTemplateFilePath()));

        return BaseResponseVO.success(result);
    }

    @RequestMapping(value = "/template/result", method = RequestMethod.GET)
    public BaseResponseVO templateStatistics(
            @RequestParam(value = "templateId", required = false)String templateId){

        JSONObject statistics = wechatTemplateService.templateStatistics(templateId);

        return BaseResponseVO.success(statistics);
    }

    @RequestMapping(value = "/template/report", method = RequestMethod.POST)
    public BaseResponseVO dataReported(
            @RequestBody String reportData){

        wechatTemplateService.templateReported(JSON.parseObject(reportData));

        return BaseResponseVO.success();
    }

}

```

#### 体验效果 通过postman或者加入swagger来体验，一定要启动kafka

