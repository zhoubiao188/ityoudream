
### 四、如何防止缓存击穿？
#### 什么是缓存击穿？
在高并发的系统中，大量的请求同时查询一个key时，如果这个key正好失效或删除，就会导致大量的请求都打到数据库上面去。这种现象我们称为缓存击穿
如下图：  
![image][2].  
当查询QPS=1000的时候，这时定时任务更新redis,先删除再添加就会出现缓存击穿，就会导致大量的请求都打到数据库上面去

#### 如何解决缓存击穿的问题？
针对这种定时更新缓存的特定场景，解决缓存击穿一般是采用主从轮询的原理。  
- 定时器更新原理  
开辟2块缓存，A 和 B，定时器在更新缓存的时候，先更新B缓存，然后再更新A缓存，记得要按这个顺序。  
![image][3].  
- 查询原理  
用户先查询缓存A,如果缓存A查询不到（例如，更新缓存的时候删除了），再查下缓存B  
![image][4].  
以上2个步骤，由原来的一块缓存，开辟出2块缓存，最终解决了缓存击穿的问题  


#### 淘宝聚划算的缓存击穿实现

```
@PostConstruct
public void initJHSAB(){
    log.info("启动AB定时器..........");
    new Thread(()->runJhsAB()).start();
}
```
```
public void runJhsAB() {
    while (true){
        //模拟从数据库读取100件 特价商品，用于加载到聚划算页面
        List<Product> list=this.products();
        //先更新B
        this.redisTemplate.delete(Constants.JHS_KEY_B);
        this.redisTemplate.opsForList().leftPushAll(Constants.JHS_KEY_B,list);

        //再更新A
        this.redisTemplate.delete(Constants.JHS_KEY_A);
        this.redisTemplate.opsForList().leftPushAll(Constants.JHS_KEY_A,list);
        try {
            Thread.sleep(1000*60);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        log.info("重新刷新..............");
    }
}
```

```
@GetMapping(value = "/findAB")
public List<Product> findAB(int page, int size) {
    List<Product> list=null;
    long start = (page - 1) * size;
    long end = start + size - 1;
    try {
        //采用redis,list数据结构的lrange命令实现分页查询。
        list = this.redisTemplate.opsForList().range(Constants.JHS_KEY_A, start, end);
        //用户先查询缓存A,如果缓存A查询不到（例如，更新缓存的时候删除了），再查下缓存B
        if (CollectionUtils.isEmpty(list)) {
            this.redisTemplate.opsForList().range(Constants.JHS_KEY_B, start, end);
        }
        log.info("{}", list);
    } catch (Exception ex) {
        //这里的异常，一般是redis瘫痪 ，或 redis网络timeout
        log.error("exception:", ex);
        //TODO 走DB查询
    }
    return list;
}