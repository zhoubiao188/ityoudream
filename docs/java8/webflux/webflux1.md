#### 什么是webflux
webflux是异步编程，是Spring5.0支持的reative编程模型，我们可以从springboot官网上看到支持两种编程模型，分别是阻塞式的Servlet模式、和异步的reative-stream异步编程模式

#### webflux解决了什么问题
webflux是解决阻塞式模式，在javaweb开发到现在，都是基于servlet容器来进行编程的，其任务调度的时候，当前线程会阻塞，而导致，其他的事情不能做(不能并行执行任务，而需要等待上一个线程执行完毕)

而webflux使用的是reative异步编程模型，使用Mono或者Flux来包装请求，目前只支持非关系型数据库如mogodb、redis等，不支持关系型数据库如oracle、mysql等，将来可能会支持，并且异步编程也是一种未来等趋势。




#### 源码地址
<a href="https://github.com/zhoubiao188/BasicJava/tree/master/webflux">github</a>