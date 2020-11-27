### webflux集成mogodb实战
#### 步骤一
pom.xml加入如下依赖
```xml
 <dependencies>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-webflux</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb-reactive</artifactId>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.hibernate.validator</groupId>
            <artifactId>hibernate-validator</artifactId>
            <version>6.0.13.Final</version>
        </dependency>
    </dependencies>
```
注意 lombok需要在idea中安装lombok插件才能使用

#### 步骤二
在SpringBoot的主启动类上加@EnableReactiveMongoRepositories 注解

#### 步骤三
修改application.yml
```yml
spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/webflux
```

#### 步骤四
创建实体类User
```java
@Document(collection = "user")
@Data
public class User {

	@Id
	private String id;

	@NotBlank
	private String name;

	@Range(min=10, max=100)
	private int age;

}
```
注意@Data注解是lombok依赖提供的，可以帮我们实现get、set、toString方法特别方便，但是在大型项目中不推荐使用lombok，因为是有问题的
而@Document是mogodb提供的，声明意思是文档型并且集合名称对应是user(也就是传统关系型数据库表的名称)
#### 步骤五
编写Dao操作数据库
```java
@Repository
public interface UserRepository extends ReactiveMongoRepository<User, String> {

	/**
	 * 根据年龄查找用户
	 * 
	 * @param start
	 * @param end
	 * @return
	 */
	Flux<User> findByAgeBetween(int start, int end);
	
	@Query("{'age':{ '$gte': 20, '$lte' : 30}}")
	Flux<User> oldUser();
}
``` 

#### 步骤六
编写全局异常处理器
```java
@ControllerAdvice
public class CheckAdvice {

	@ExceptionHandler(WebExchangeBindException.class)
	public ResponseEntity<String> handleBindException(
			WebExchangeBindException e) {
		return new ResponseEntity<String>(toStr(e), HttpStatus.BAD_REQUEST);
	}
	
	@ExceptionHandler(CheckException.class)
	public ResponseEntity<String> handleCheckException(
			CheckException e) {
		return new ResponseEntity<String>(toStr(e), HttpStatus.BAD_REQUEST);
	}

	private String toStr(CheckException e) {
		return e.getFieldName() + ": 错误的值 " + e.getFieldValue();
	}

	/**
	 * 把校验异常转换为字符串
	 * 
	 * @param ex
	 * @return
	 */
	private String toStr(WebExchangeBindException ex) {
		return ex.getFieldErrors().stream()
				.map(e -> e.getField() + ":" + e.getDefaultMessage())
				.reduce("", (s1, s2) -> s1 + "\n" + s2);
	}

}
```

注意这里的异常我们都返回的是Bad_Request(400错误)，并且将错误转换为字符串

#### 步骤七
注册用户的时候，来写一个简单的工具类来校验用户名

```java
public class CheckUtil {

	private static final String[] INVALID_NAMES = { "admin", "zhoubiao" };

	/**
	 * 校验名字, 不成功抛出校验异常
	 * 
	 * @param name
	 */
	public static void checkName(String value) {
		Stream.of(INVALID_NAMES).filter(name -> name.equalsIgnoreCase(value))
				.findAny().ifPresent(name -> {
					throw new CheckException("name", value);
				});
	}

}
```

#### 步骤八
编写自定义异常类
```java
@Data
public class CheckException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	/**
	 * 出错字段的名字
	 */
	private String fieldName;
	
	/**
	 * 出错字段的值
	 */
	private String fieldValue;
	
	public CheckException() {
		super();
	}

	public CheckException(String message, Throwable cause,
			boolean enableSuppression, boolean writableStackTrace) {
		super(message, cause, enableSuppression, writableStackTrace);
	}

	public CheckException(String message, Throwable cause) {
		super(message, cause);
	}

	public CheckException(String message) {
		super(message);
	}

	public CheckException(Throwable cause) {
		super(cause);
	}

	public CheckException(String fieldName, String fieldValue) {
		super();
		this.fieldName = fieldName;
		this.fieldValue = fieldValue;
	}
}
```

#### 步骤九
编写UserController来测试我们的代码
```java
@RestController
@RequestMapping("/user")
public class UserController {

	private final UserRepository repository;

	public UserController(UserRepository repository) {
		this.repository = repository;
	}

	/**
	 * 以数组形式一次性返回数据
	 * 
	 * @return
	 */
	@GetMapping("/")
	public Flux<User> getAll() {
		return repository.findAll();
	}

	/**
	 * 以SSE形式多次返回数据
	 * 
	 * @return
	 */
	@GetMapping(value = "/stream/all", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<User> streamGetAll() {
		return repository.findAll();
	}

	/**
	 * 新增数据
	 * 
	 * @param user
	 * @return
	 */
	@PostMapping("/")
	public Mono<User> createUser(@Valid @RequestBody User user) {
		// spring data jpa 里面, 新增和修改都是save. 有id是修改, id为空是新增
		// 根据实际情况是否置空id
		user.setId(null);
		CheckUtil.checkName(user.getName());
		return this.repository.save(user);
	}

	/**
	 * 根据id删除用户 存在的时候返回200, 不存在返回404
	 * 
	 * @param id
	 * @return
	 */
	@DeleteMapping("/{id}")
	public Mono<ResponseEntity<Void>> deleteUser(
			@PathVariable("id") String id) {
		// deletebyID 没有返回值, 不能判断数据是否存在
		// this.repository.deleteById(id)
		return this.repository.findById(id)
				// 当你要操作数据, 并返回一个Mono 这个时候使用flatMap
				// 如果不操作数据, 只是转换数据, 使用map
				.flatMap(user -> this.repository.delete(user).then(
						Mono.just(new ResponseEntity<Void>(HttpStatus.OK))))
				.defaultIfEmpty(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	/**
	 * 修改数据 存在的时候返回200 和修改后的数据, 不存在的时候返回404
	 * 
	 * @param id
	 * @param user
	 * @return
	 */
	@PutMapping("/{id}")
	public Mono<ResponseEntity<User>> updateUser(@PathVariable("id") String id,
			@Valid @RequestBody User user) {
		CheckUtil.checkName(user.getName());
		return this.repository.findById(id)
				// flatMap 操作数据
				.flatMap(u -> {
					u.setAge(user.getAge());
					u.setName(user.getName());
					return this.repository.save(u);
				})
				// map: 转换数据
				.map(u -> new ResponseEntity<User>(u, HttpStatus.OK))
				.defaultIfEmpty(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	/**
	 * 根据ID查找用户 存在返回用户信息, 不存在返回404
	 * 
	 * @param id
	 * @return
	 */
	@GetMapping("/{id}")
	public Mono<ResponseEntity<User>> findUserById(
			@PathVariable("id") String id) {
		return this.repository.findById(id)
				.map(u -> new ResponseEntity<User>(u, HttpStatus.OK))
				.defaultIfEmpty(new ResponseEntity<>(HttpStatus.NOT_FOUND));
	}

	/**
	 * 根据年龄查找用户
	 * 
	 * @param start
	 * @param end
	 * @return
	 */
	@GetMapping("/age/{start}/{end}")
	public Flux<User> findByAge(@PathVariable("start") int start,
			@PathVariable("end") int end) {
		return this.repository.findByAgeBetween(start, end);
	}

	/**
	 * 根据年龄查找用户
	 * 
	 * @param start
	 * @param end
	 * @return
	 */
	@GetMapping(value = "/stream/age/{start}/{end}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<User> streamFindByAge(@PathVariable("start") int start,
			@PathVariable("end") int end) {
		return this.repository.findByAgeBetween(start, end);
	}
	
	/**
	 *  得到20-30用户
	 * @return
	 */
	@GetMapping("/old")
	public Flux<User> oldUser() {
		return this.repository.oldUser();
	}

	/**
	 * 得到20-30用户
	 * 
	 * @return
	 */
	@GetMapping(value = "/stream/old", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
	public Flux<User> streamOldUser() {
		return this.repository.oldUser();
	}
}
```
