#### Spring Boot 整合MongoDB
上一讲我们学了mongo的基本命令，那么我们就可以奖mongo集成到SpringBoot里面了，现在主流到程序都是通过SpringBoot来开发的，使用了SpringBoot那么我们首选就是Spring Data JPA了或者MongoTemplate由MongoDB的Driver提供，这里我们使用Spring Data JPA，由于Mybatis只支持关系型数据库

#### 步骤一、创建一个SpringBoot工程
pom.xml
```xml
  <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-mongodb</artifactId>
        </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
```

#### 步骤二、 使用JPA生成实体
![image](/mongodb/mongo-auto1.png) 

![image](/mongodb/mongo-jpa.png)

![image](/mongodb/mongo-auto2.png)

![image](/mongodb/mongo-jpa2.png)

#### 步骤三、Repository的Dao类
```java
@Repository
public interface StudentRepository extends MongoRepository<StudentEntity, String> {
}
```
#### 步骤四、编写Controller
```java

@RestController
@RequestMapping("/student")
@Api(tags = "Student InferFace")
public class StudentController {
    @Autowired
    private StudentRepository studentRepository;
    @ApiOperation("addStudent")
    @PostMapping
    public ResponseEntity<StudentEntityDTO> addStudent(@RequestBody StudentEntityDTO studentEntityDTO) {
        Assert.notNull(studentEntityDTO, "字段不能为空");
        StudentEntity studentEntity = new StudentEntity();
        BeanUtils.copyProperties(studentEntityDTO, studentEntity);
        StudentEntity save = studentRepository.save(studentEntity);
        System.out.println("save:" + save);
        return new ResponseEntity<StudentEntityDTO>(HttpStatus.OK);
    }

    @GetMapping
    @ApiOperation("findAll")
    public ResponseEntity<Object> getAll() {
        return new ResponseEntity<Object>(studentRepository.findAll(),HttpStatus.OK);

    }
}
```

#### 步骤五、Swagger体验效果
访问http://localhost:8080/swagger-ui/index.html

#### 源码下载
<a href="https://github.com/zhoubiao188/mongodb/tree/master/mongo-helloword">github</a>









