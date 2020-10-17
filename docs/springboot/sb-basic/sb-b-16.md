### 一、本课程目标：
1. 如何使用Assert参数校验？
2. 为什么用了Validator参数校验，还必须再用Assert参数校验？

### 二、什么是Assert参数校验？
Assert翻译为中文为"断言".它是spring的一个util类，org.springframework.util.Assert
一般用来断定某一个实际的值是否为自己预期想得到的,如果不一样就抛出异常.

### 三、为什么用了Validator参数校验，还必须再用Assert参数校验？
主要是2个原因：<br>
1.因为validator只解决了参数自身的数据校验，解决不了参数和业务数据之间校验。
   例如以下代码，validator是搞不定的
``` java
public void test1(int userId) {
    User user = userDao.selectById(userId);
    if (user == null) {
        throw new IllegalArgumentException("用户不存在！");
    }
}
```
2.采用Assert能使代码更优雅
下以上代码可以转变为以下优雅代码
``` java
public void test2(int userId) {
    User user = userDao.selectById(userId);
    Assert.notNull(user, "用户不存在！");
}
```

### 四、案例实战：修改用户信息时，用Assert校验用户是否存在？
#### 步骤1：校验用户是否存在
``` java
    @PostMapping(value = "/user/update", produces = APPLICATION_JSON_UTF8_VALUE, consumes = APPLICATION_JSON_UTF8_VALUE)
    public void updateUser(@RequestBody @Validated UserVO userVO) {
        UserVO user = null;
        //user = userDao.selectById(userId);
        Assert.notNull(user, "用户不存在！");
    }
```
#### 测试结果：
``` 
{
  "timestamp": "2019-10-03T07:40:29.416+0000",
  "status": 500,
  "error": "Internal Server Error",
  "message": "用户不存在！",
  "path": "/user/user/update"
}
```
从以上测试结果可以知道：
1. 参数校验，一般都是validator和assert 一起结合使用的，validator只解决了参数自身的数据校验，解决不了参数和业务数据之间校验。
2. 从测试结果看，assert抛出异常是一个json，这个json 不是我们想要的，所以必须和《全局异常处理器》一起使用封装。



### 五、常用的Assert场景
- 逻辑断言
1. isTrue()
<br>如果条件为假抛出IllegalArgumentException 异常。
1. state()
<br>该方法与isTrue一样，但抛出IllegalStateException异常。

- 对象和类型断言
1. notNull()
<br>通过notNull()方法可以假设对象不null：
1. isNull()
<br>用来检查对象为null:
1. isInstanceOf()
<br>使用isInstanceOf()方法检查对象必须为另一个特定类型的实例
1. isAssignable()
<br>使用Assert.isAssignable()方法检查类型

- 文本断言
1. hasLength()
<br>如果检查字符串不是空符串，意味着至少包含一个空白，可以使用hasLength()方法。
1. hasText()
<br>我们能增强检查条件，字符串至少包含一个非空白字符，可以使用hasText()方法。
1. doesNotContain()
<br>我们能通过doesNotContain()方法检查参数不包含特定子串。

- Collection和map断言
1. Collection应用notEmpty()
<br>如其名称所示，notEmpty()方法断言collection不空，意味着不是null并包含至少一个元素。
1. map应用notEmpty()
<br>同样的方法重载用于map，检查map不null，并至少包含一个entry（key，value键值对）。

- 数组断言
1. notEmpty()
<br>notEmpty()方法可以检查数组不null，且至少包括一个元素：
1. noNullElements()
<br>noNullElements()方法确保数组不包含null元素：

### 五、案例实战：把Assert异常加入《全局异常处理器》
为什么要加？
因为assert的异常结构如下：
``` 
{
  "timestamp": "2019-10-03T07:40:29.416+0000",
  "status": 500,
  "error": "Internal Server Error",
  "message": "用户不存在！",
  "path": "/user/user/update"
}
```
这种异常一般是不允许和客户端联调的！！必须加入加入《全局异常处理器》

执行结果：
``` 
{
  "status": 4000,
  "desc": "用户不存在！",
  "data": null
}
```