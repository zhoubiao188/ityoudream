# 一、在springboot中使用lombok


## 二、为什么要使用lombok,它解决了什么问题？
Lombok 是一个 IDEA 插件,也是一个依赖jar 包。
它解决了开发人员少写代码，提升开发效率。
它使开发人员不要去写javabean的getter/setter方法，写构造器、equals等方法；最方便的是你对javabean的属性增删改，
你不用再重新生成getter/setter方法。省去一大麻烦事。

## 三、idea安装lombok插件
### 步骤1：idea搜索lombok插件
打开IDEA的Settings面板，并选择Plugins选项，然后点击 “Browse repositories..”

### 步骤2：安装并重启idea
点击安装，然后安装提示重启IDEA，安装成功;
记得重启IDEA，不然不生效。


### 四、体验lombok核心注解@data
#### 步骤1： 什么是@data注解
@Data 注解在实体类上，自动生成javabean的getter/setter方法，写构造器、equals等方法；

#### 步骤2：pom文件添加依赖包
``` xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.8</version>
</dependency>
```
### 五、体验lombok第二核心注解@Slf4j
注解@Slf4j的作用就是代替一下代码
``` java
private static final Logger logger = LoggerFactory.getLogger(UserController.class);
```
让你不用每次都写重复的代码
