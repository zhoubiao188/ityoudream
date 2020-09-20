
### 三、案例实战：Springboot实现用户登录session管理功能
#### 步骤1：加入springboot的常用依赖包
``` 
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <version>1.18.8</version>
    </dependency>
```
#### 步骤2：编码实现用户登录逻辑
核心代码 
session.setAttribute(session.getId(), user);
session.removeAttribute(session.getId());
``` 
@Slf4j
@RestController
@RequestMapping(value = "/user")
public class UserController {

    Map<String, User> userMap = new HashMap<>();

    public UserController() {
        //初始化2个用户，用于模拟登录
        User u1=new User(1,"zb1","zb1");
        userMap.put("zb1",u1);
        User u2=new User(2,"agan2","agan2");
        userMap.put("agan2",u2);
    }

    @GetMapping(value = "/login")
    public String login(String username, String password, HttpSession session) {
        //模拟数据库的查找
        User user = this.userMap.get(username);
        if (user != null) {
            if (!password.equals(user.getPassword())) {
                return "用户名或密码错误！！！";
            } else {
                session.setAttribute(session.getId(), user);
                log.info("登录成功{}",user);
            }
        } else {
            return "用户名或密码错误！！！";
        }
        return "登录成功！！！";
    }

    /**
     * 通过用户名查找用户
     */
    @GetMapping(value = "/find/{username}")
    public User find(@PathVariable String username) {
        User user=this.userMap.get(username);
        log.info("通过用户名={},查找出用户{}",username,user);
        return user;
    }

    /**
     *拿当前用户的session
     */
    @GetMapping(value = "/session")
    public String session(HttpSession session) {
        log.info("当前用户的session={}",session.getId());
        return session.getId();
    }

    /**
     * 退出登录
     */
    @GetMapping(value = "/logout")
    public String logout(HttpSession session) {
        log.info("退出登录session={}",session.getId());
        session.removeAttribute(session.getId());
        return "成功退出！！";
    }

}
```
#### 步骤3：编写session拦截器
session拦截器的作用：
验证当前用户发来的请求是否有携带sessionid，如果没有携带，提示用户重新登录。

#### 步骤4：体验测试
http://127.0.0.1:9090/user/login?username=zb1&password=zb1
http://127.0.0.1:9090/user/find/zb1