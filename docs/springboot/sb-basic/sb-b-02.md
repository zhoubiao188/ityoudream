
## springboot yml
学习什么是yml文件？和学习yml语法。
SpringBoot的配置文件有两种，一种是properties结尾的，一种是以yaml或yml文件结尾的。
1.	application.properties
1.	application.yml
默认情况下是properties结尾的配置文件
配置文件放在src/main/resources目录或者类路径/config/下


## 二、先弄清楚，什么是yml文件？
yml是YAML（YAML Ain't Markup Language）语言的文件，以数据为中心，比json、xml等更适合做配置文件

## 三、对比区别
``` yml
server.port=9090

agan.msg=hi,hello world!!
```
转换为yml配置文件
``` yml
server：
   port： 9090

agan：
   msg： hi,hello world!!
```
以空格的缩进程度来控制层级关系。（空格个数不重要）
