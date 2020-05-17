# 项目实战使用lua优化redis

### 二、写代码
#### 步骤1：pom文件加入依赖包
```xml
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
        <artifactId>spring-boot-starter-data-redis</artifactId>
        <version>2.3.0.RELEASE</version>
    </dependency>
```
依赖和之前没有什么变化，都是一样的

#### 步骤2：编写lua脚本
在项目工程的resouce资源目录中创建一个lua文件夹编写lua脚本
luaScript.lua 脚本内容如下
```lua
-- 如果redis没找到，就把值写进去
if redis.call('get', KEYS[1]) == nil then
   redis.call('set', KEYS[1], ARGV[1]);
   return 1
end

-- 如果旧值不等于新增，就把新增设置进去
if redis.call('get', KEYS[1]) ~= ARGV[1]  then
   redis.call('set', KEYS[1], ARGV[1]);
   return 1
else
   return 0
end
```
#### 步骤3：编写加载lua的代码
LuaConfig 内容如下:
```java
@Configuration
public class LuaConfig {
    @Bean
    public DefaultRedisScript<Long> luaScript() {
        DefaultRedisScript<Long> redisScript = new DefaultRedisScript<>();
        redisScript.setScriptSource(new ResourceScriptSource(new ClassPathResource("lua/luaScript.lua")));
        redisScript.setResultType(Long.class);
        return redisScript;
    }
}
```
#### 步骤4：编写restApi接口
优化前的代码
```java
/**
     * 修改用户名称
     */
    @GetMapping(value = "/updateuser")
    @ApiOperation("优化之前")
    public void updateUser(Integer uid,String uname) {
        String key="user:"+uid;
        //优化点：第一次发送redis请求
        String old=this.stringRedisTemplate.opsForValue().get(key);
        if(StringUtils.isEmpty(old)){
            //优化点：第二次发送redis请求
            this.stringRedisTemplate.opsForValue().set(key,uname);
            return;
        }
        if(old.equals(uname)){
            log.info("{}不用修改", key);
        }else{
            log.info("{}从{}修改为{}", key,old,uname);
            //优化点：第二次发送redis请求
            this.stringRedisTemplate.opsForValue().set(key,uname);
        }
        /*
        以上代码，看似简单，但是在高并发的情况下，还是有一点性能瓶颈，在性能方面主要是发送了2次redis请求。
        那如何优化呢？
        我们可以采用lua技术，把2次redis请求合成一次。
         */
    }
```

优化后的代码
```java
@GetMapping(value = "/updateuserlua")
    @ApiOperation("优化之后")
    public void updateUserLua(Integer uid,String uname) {
        String key="user:"+uid;
        //设置redis的key
        List<String> keys = Arrays.asList(key);
        //执行lua脚本，execute方法有3个参数，第一个参数是lua脚本对象，第二个是key列表，第三个是lua的参数数组
        Long n = this.stringRedisTemplate.execute(this.compareAndSetScript, keys, uname);
        if (n == 0) {
            log.info("{}不用修改", key);
        } else {
            log.info("{}修改为{}", key,uname);
        }
    }
```

其中 updateuser这个控制器方法不是最优的，因为发送了两次redis操作请求

#### 步骤5：体验效果
使用chrome浏览器访问 http://localhost:8081/swagger-ui.html 来进行操作

#### 效果如下
key为1104原来的值: 
```
127.0.0.1:6379> get user:1104
"love girl"
127.0.0.1:6379>
```

修改后的值(idea 控制台输出)
```
2020-05-17 19:55:10.323  INFO 5066 --- [nio-8081-exec-7] cn.ityoudream.controller.LuaController   : user:1104修改为love java
```

redis中
```
127.0.0.1:6379> get user:1104
"love java"
127.0.0.1:6379>
```



### 源码下载
<a href="https://github.com/zhoubiao188/redis/tree/master/redis-string-springcache">github</a>








