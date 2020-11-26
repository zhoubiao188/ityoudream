#### 什么是webflux
webflux是异步编程，是Spring5.0支持的reative编程模型，我们可以从springboot官网上看到支持两种编程模型，分别是阻塞式的Servlet模式、和异步的reative-stream异步编程模式

#### webflux解决了什么问题
webflux是解决阻塞式模式，在javaweb开发到现在，都是基于servlet容器来进行编程的，其任务调度的时候，当前线程会阻塞，而导致，其他的事情不能做(不能并行执行任务，而需要等待上一个线程执行完毕)

而webflux使用的是reative异步编程模型，使用Mono或者Flux来包装请求，目前只支持非关系型数据库如mogodb、redis等，不支持关系型数据库如oracle、mysql等，将来可能会支持，并且异步编程也是一种未来等趋势。

#### springboot集成webflux
使用idea创建一个springboot项目，pom如下
```xml
 <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
 </dependency>
```

创建一个TestController
```java
@RestController
public class TestController {
    private static final Logger log = LoggerFactory.getLogger(TestController.class);

    //传统返回方式，非异步，第一个log输出完成后第二个日志才输出
    @GetMapping("/1")
    private String get1() {
        log.info("get1 start");
        String result = createStr();
        log.info("get1 end.");
        return result;
    }

    //webflux异步模式，第一个日志和第二哥日志并行执行
    @GetMapping("/2")
    private Mono<String> get2() {
        log.info("get2 start");
        Mono<String> result = Mono.fromSupplier(() -> createStr());
        log.info("get2 end.");
        return result;
    }

    /**
     * Flux : 返回0-n个元素
     * 模拟页面实时加载数据
     * @return
     */
    @GetMapping(value = "/3", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    private Flux<String> flux() {
        Flux<String> result = Flux
                .fromStream(IntStream.range(1, 5).mapToObj(i -> {
                    try {
                        TimeUnit.SECONDS.sleep(1);
                    } catch (InterruptedException e) {
                    }
                    return "flux data--" + i;
                }));
        return result;
    }

    private String createStr() {
        try {
            TimeUnit.SECONDS.sleep(5);
        } catch (InterruptedException e) {
        }
        return "some string";
    }

}

```


#### 源码地址
<a href="https://github.com/zhoubiao188/BasicJava/tree/master/webflux">github</a>