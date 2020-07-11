
### 一、redis存储java对象常用String，那为什么还要用hash来存储？
Redis存储java对象，一般是String 或 Hash 两种，那到底什么时候用String ? 什么时候用hash ?  

String的存储通常用在频繁读操作，它的存储格式是json,即把java对象转换为json，然后存入redis.  
Hash的存储场景应用在频繁写操作，即，当对象的某个属性频繁修改时，不适用string+json的数据结构，因为不灵活，每次修改都需要把整个对象转换为json存储。  
如果采用hash，就可以针对某个属性单独修改，不用序列号去修改整个对象。例如，商品的库存、价格、关注数、评价数经常变动时，就使用存储hash结果。  

### 二、案例实战：SpringBoot+redis+hash存储商品数据

#### 步骤1：加入依赖包
``` xml
<!--swagger-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger2</artifactId>
    <version>2.9.2</version>
</dependency>
<!--swagger-ui-->
<dependency>
    <groupId>io.springfox</groupId>
    <artifactId>springfox-swagger-ui</artifactId>
    <version>2.9.2</version>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-redis</artifactId>
    <version>1.4.7.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.8</version>
</dependency>

<dependency>
    <groupId>commons-lang</groupId>
    <artifactId>commons-lang</artifactId>
    <version>2.6</version>
</dependency>
```

#### 步骤2：创建商品的redis处理
``` java
@PostMapping(value = "/create")
public void create(Product obj) {
    //TODO 先进db
    
    //创建商品，先把数据添加到数据库，再存入redis
    String key="product:"+1000;
    //将Object对象里面的属性和值转化成Map对象
    Map<String, Object> map=this.objectToMap(obj);
    //批量put操作 putAll 等于 hmset命令
    this.redisTemplate.opsForHash().putAll(key,map);

    Object name=this.redisTemplate.opsForHash().get(key,"name");
    log.info("name={}",name);

    Object price=this.redisTemplate.opsForHash().get(key,"price");
    log.info("price={}",price);

    Object detail=this.redisTemplate.opsForHash().get(key,"detail");
    log.info("detail={}",detail);

}
```

#### 步骤3：用swagger体验效果
``` 
127.0.0.1:6379> keys *
1) "\xac\xed\x00\x05t\x00\x0cproduct:1000"
127.0.0.1:6379> hgetAll "\xac\xed\x00\x05t\x00\x0cproduct:1000"
1) "\xac\xed\x00\x05t\x00\x02id"
2) ""
3) "\xac\xed\x00\x05t\x00\x06detail"
4) "\xac\xed\x00\x05t\x00\x03www"
5) "\xac\xed\x00\x05t\x00\x05price"
6) "\xac\xed\x00\x05sr\x00\x11java.lang.Integer\x12\xe2\xa0\xa4\xf7\x81\x878\x02\x00\x01I\x00\x05valuexr\x00\x10java.lang.Number\x86\xac\x95\x1d\x0b\x94\xe0\x8b\x02\x00\x00xp\x00\x00\a\xd0"
7) "\xac\xed\x00\x05t\x00\x04name"
8) "\xac\xed\x00\x05t\x00\x06huawei"
127.0.0.1:6379>
127.0.0.1:6379>
127.0.0.1:6379>
127.0.0.1:6379> flushdb
OK
127.0.0.1:6379> keys *
1) "product:1000"
127.0.0.1:6379> hgetall product:1000
1) "price"
2) "2000"
3) "name"
4) "\"huawei\""
5) "id"
6) ""
7) "detail"
8) "\"www\""
```

#### 步骤4：商品涨价
``` java
@PostMapping(value = "/addPrice")
public void addPrice(int id,int price) {
    String key="product:"+id;
    //商品价格涨价 increment等于  hincrby命令
    this.redisTemplate.opsForHash().increment(key,"price",price);
    Object price2=this.redisTemplate.opsForHash().get(key,"price");
    log.info("price={}",price2);
}

```
#### 步骤5：用swagger体验效果