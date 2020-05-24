# 案例实战：redis+lua 实现黑客防刷攻击
#### 黑客攻击的场景：  
黑客为了攻击你的网站或app，通常是并发死循环的请求你的接口，从而导致你的系统宕机。  
这种攻击会造成2种严重后果：  
1. 针对插入数据库接口：会出现大量重复数据，甚至垃圾数据会把数据库撑爆。
2. 针对查询的接口：黑客一般是重点攻击慢查询接口，例如一个慢查询接口1s，只要黑客发起攻击，就必然造成系统被拖垮，数据库查询被阻塞死。
为了防止以上情况的发生，我们采用redis+lua 来实现黑客防刷攻击。

#### 防刷攻击技术原理：
针对某个接口，采用访问频率控制，当某个ip在短时间内频繁访问接口时，需要记录并识别出来，这种高并发请求，通常都是采用redis+lua来实现。
1. 用户调用某个接口时，记录用户的ip地址，并向redis发送一个incr计数器命令；
2. 设置计数器的过期时间expire ，30秒
3. 如果30秒内，某个IP请求大于10，就认定为异常IP  

#### 步骤1：编写lua的防刷脚本
```
-- 为某个接口的请求ip设置计数器，例如 当ip 127.0.0.1请求商品接口时，key=product:127.0.0.1
local times = redis.call('incr',KEYS[1])
-- 当某个ip第一次请求时，为该ip的key设置超时时间。
if times == 1 then
    redis.call('expire',KEYS[1], ARGV[1])
end
-- tonumber就是把某个字符串转换为数字
-- 例如 某个ip 30秒内，请求次数大于10，就返回0，反则 返回1
if times > tonumber(ARGV[2]) then
    return 0
end
return 1
```

#### 步骤2：执行lua的防刷脚本
``` 
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 1
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 0
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 0
[root@node2 src]# ./redis-cli --eval limit.lua producapi:127.0.0.1 , 30 10
(integer) 0
```

### 案例实战：SpringBoot+Redis+lua 实现黑客防刷攻击
#### 步骤1：编写lua文件，并存储于resources/lua
``` 
-- 为某个接口的请求IP设置计数器，例如,当IP127.0.0.1请求商品接口时，key=product:127.0.0.1
local times = redis.call('incr',KEYS[1])
-- 当某个ip第一次请求时，为该ip的key设置超时时间。
if times == 1 then
    redis.call('expire',KEYS[1], ARGV[1])
end
-- tonumber就是把某个字符串转换为数字，
-- 例如 某个IP 30秒内，请求次数大于10，就返回0，反则 返回1
if times > tonumber(ARGV[2]) then
    return 0
end
return 1

```
#### 步骤2：创建lua脚本对象
``` java
@Bean
public DefaultRedisScript<Long> limitScript() {
    DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
    redisScript.setScriptSource(new ResourceScriptSource(new ClassPathResource("lua/limit.lua")));
    redisScript.setResultType(Long.class);
    return redisScript;
}
```

#### 步骤3：SpringBoot执行lua脚本
``` java
@GetMapping(value = "/productlist")
public String productList(HttpServletRequest request) {
    //获取请求ip
    String ip = IpUtils.getIpAddr(request);
    //设置redis 的key
    List<String> keys = Arrays.asList("pruductAPI:" + ip);
    //执行lua脚本，execute方法有3个参数，第一个参数是lua脚本对象，第二个是key列表，第三个是lua的参数数组
    //30代表30秒 ，10代表超过10次，也就是说同个ip 30秒内不能超过10次请求
    Long n = this.stringRedisTemplate.execute(this.limitScript, keys, "30", "10");
    String result="";
    //非法请求
    if (n == 0) {
        result= "非法请求";
    } else {
        result= "返回商品列表";
    }
    log.info("ip={}请求结果：{}", ip,result);
    return result;
}
```