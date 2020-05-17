# 一、什么是lua ?
Lua 是一个简洁、轻量、可扩展的脚本语言，它的特性有：
- 轻量：源码包只有核心库，编译后体积很小。
- 高效：由C 编写的，启动快、运行快。
- 内嵌：可内嵌到各种编程语言或系统中运行，提升静态语言的灵活性。
而且完全不需要担心语法问题，Lua 的语法很简单，分分钟使用不成问题。


### 二、Redis 为什么要使用LUA ？
1. 原子性：将redis的多个操作合成一个脚本，然后整体执行，在脚本的执行中，不会出现资源竞争的情况。
2. 减少网络通信：把多个命令合成一个lua脚本，redis统一执行脚本。
3. 复用性：client发送的脚本会永久存储在redis中，这意味着其他客户端可以复用这一脚本来完成同样的逻辑。


### 三、lua的语法入门
``` 
EVAL script numkeys key [key ...] arg [arg ...]
```
script： 参数是一段 Lua脚本程序。脚本不必(也不应该)定义为一个Lua函数。 
numkeys： 用于指定key参数的个数。 
key [key ...]： 代表redis的key,从 EVAL 的第三个参数开始算起，表示在脚本中所用到的Redis键(key)。
在Lua中，这些键名参数可以通过全局变量 KEYS 数组，用1为基址的形式访问( KEYS[1] ，KEYS[2]，依次类推)。  
arg [arg ...]： 代表lua的入参，在Lua中通过全局变量ARGV数组访问，访问的形式和KEYS变量类似( ARGV[1] 、 ARGV[2] ，诸如此类)。  
特别注意：lua的数组坐标不是从0开始，是从1开始。从1开始！从1开始！从1开始！
入门例子
``` 
127.0.0.1:6379> EVAL  "return {KEYS[1],KEYS[2],ARGV[1],ARGV[2]}" 2  key1 key2 zhoubiao1 zhoubiao2
1) "key1"
2) "key2"
3) "zhoubiao1"
4) "zhoubiao2"
```
对以上脚本的详细说明：
1. eval为rendis的关键字
2. 双引号的内容代表lua脚本
3. 2代表numkeys参数的个数，即有多少个key
4. key1 和 key2代表 KEYS[1],KEYS[2]的入参
5. zhoubiao1 zhoubiao2 是ARGV[1],ARGV[2]的入参