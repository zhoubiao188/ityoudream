
### 七、案例实战：SpringSession+redis解决分布式session不一致性问题
#### 步骤1：加入SpringSession、redis的依赖包
``` 
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-redis</artifactId>
    <version>1.4.7.RELEASE</version>
</dependency>

<dependency>
    <groupId>org.springframework.session</groupId>
    <artifactId>spring-session-data-redis</artifactId>
</dependency>
```
#### 步骤2：修改配置文件
``` 

# 为某个包目录下 设置日志
logging.level.com.agan=debug


# 设置session的存储方式，采用redis存储
spring.session.store-type=redis

# session有效时长为10分钟
server.servlet.session.timeout=PT10M

## Redis 配置
## Redis数据库索引（默认为0）
spring.redis.database=0
## Redis服务器地址
spring.redis.host=192.168.1.138
## Redis服务器连接端口
spring.redis.port=6379
## Redis服务器连接密码（默认为空）
spring.redis.password=
```