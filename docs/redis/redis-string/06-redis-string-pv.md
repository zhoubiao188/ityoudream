
# 案例实战：微信文章的阅读量PV
### 一、微信文章的阅读量场景介绍
这样一个场景：
在微信公众号里面的文章，每个用户阅读一遍文章，该篇文章的阅读量就会加一。如下图：
![image](/redis-img/redis-pv.png)
对于微信这种一线互联网公司，如此大的并发量，一般不可能采用数据库来做计数器，通常都是用redis的incr命令来实现。

### 二、微信文章的阅读量原理:redis INCR命令
INCR命令，它的全称是increment，用途就是计数器。
每执行一次INCR命令，都将key的value自动加1。
如果key不存在，那么key的值初始化为0，然后再执行INCR操作。
例如：微信文章id=100，做阅读计算如：
``` 
127.0.0.1:6379> incr article:100
(integer) 1
127.0.0.1:6379> incr article:100
(integer) 2
127.0.0.1:6379> incr article:100
(integer) 3
127.0.0.1:6379> incr article:100
(integer) 4
127.0.0.1:6379> get article:100
"4"
```

技术方案的缺陷：
需要频繁的修改redis,耗费CPU，高并发修改redis会导致 redisCPU 100%


### 三、案例实战：编码实现微信文章的阅读量
PvService
```java
public interface PvService {
    /**
     * 传入文章的id
     * @param id
     * @return
     */
    long view(Integer id);
}
```
PvServiceImpl
```java
@Service
public class PvServiceImpl implements PvService {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    private static final String CACHE_ARTICLE = "article:";
    @Override
    public long view(Integer id) {
        /**
         * 使用redis的计数器命令increment(incr)
         */
        String  key = CACHE_ARTICLE + id;
        return this.stringRedisTemplate.opsForValue().increment(key);
    }
}
```

ViewController
```java
@Controller
public class ViewController {
    @Autowired
    private PvService pvService;
    @GetMapping("/index/{id}")
    public String indexPage(@PathVariable int id, Model model) {
        long view = pvService.view(id);
        model.addAttribute("article", view);
        return "index";
    }
}
```
index.html
```html
<!DOCTYPE html>
<html lang="en" xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>这是一篇文章</title>
</head>
<body>
<p>spring boot redis so easy !</p>
<p th:text="${article}"></p>
</body>
</html>
```
### 体验
在浏览器里面打开http://localhost:8081/index/{id}
![image](/redis-img/redis-pv-01.gif)

### 源码下载
<a href="https://github.com/zhoubiao188/redis/tree/master/redis-string-pv">github</a>