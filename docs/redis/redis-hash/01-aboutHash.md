

### 什么是redis的hash数据结构？
1. redis的hash数据结构，其实就是string的升级版，它把string 数据结构的key value，中的value类型升级为hash（和java的hash一样的结构）  
Map<String, HashMap<String,String>> hash=new HashMap<String,HashMap<String,String>>();
2.  每个 hash的存储大小： 可以存储 2的（32 - 1）方的 键值对（40多亿）



###  redis的hash结构经典场景：存储java对象
把一个Product对象，存储进redis的hash结构
```
@Data
public class Product {
    //商品id
    private Long id;

    //商品名称
    private String name;

    //商品价格
    private Integer price;

    //商品详情
    private String detail;
}
```
### HSET key field value
 将哈希表 key 中的字段 field 的值设为 value 。
### HGET key field
获取存储在哈希表中指定字段的值。
```
127.0.0.1:6379> hset product:100 name iphone11
(integer) 1
127.0.0.1:6379> hget product:100 name
"iphone11"
```

### HMSET key field1 value1 [field2 value2 ]
同时将多个 field-value (域-值)对设置到哈希表 key 中。

### HMGET key field1 [field2 field3 ...]
获取所有给定字段的值
```
127.0.0.1:6379> hmset product:100 price 5000 detail "I love iphone"
OK
127.0.0.1:6379> hmget product:100 name price detail
1) "iphone11"
2) "5000"
3) "I love iphone"
```

### HKEYS key
获取指定hash中所有field值
```
127.0.0.1:6379> hkeys product:100
1) "name"
2) "price"
3) "detail"
```
### HVALS key
 获取指定hash中所有value值
```
127.0.0.1:6379> hvals product:100
1) "iphone11"
2) "5000"
3) "I love iphone"
```

### HGETALL key
获取指定hash中所有field、value值
```
127.0.0.1:6379> hgetall product:100
1) "name"
2) "iphone11"
3) "price"
4) "5000"
5) "detail"
6) "I love iphone"
```

### HLEN key
获取指定hash中元素的个数
```
127.0.0.1:6379> hlen product:100
(integer) 3
```

### HINCRBY key field data (整形)
给指定 field 对应的 value 值加上 data 数值

### HINCRBYFLOAT key field data(浮点数)
给指定 field 对应的 value 值加上 data 数值
```
127.0.0.1:6379> hincrby product:100 price 100
(integer) 5100
127.0.0.1:6379> hgetall product:100
1) "name"
2) "iphone11"
3) "price"
4) "5100"
5) "detail"
6) "I love iphone"
```

### HEXISTS key field
检查指定的field是否存在
``` 
127.0.0.1:6379> hexists product:100 name
(integer) 1
```
### HDEL key field1 [field2 fiedl3 ...]
删除一个或多个哈希表字段
``` 
127.0.0.1:6379> hdel product:100 name
(integer) 1
127.0.0.1:6379> hgetall product:100
1) "price"
2) "5100"
3) "detail"
4) "I love iphone"
```