# 如何使用redis生成淘宝商品的全局id

### 一、为什么分布式系统需要全局唯一id ？
在互联网系统中，并发越大的系统，数据就越大，数据越大就越需要分布式，而大量的分布式数据就越需要唯一标识来识别它们。  
例如淘宝的商品系统有千亿级别商品，订单系统有万亿级别的订单数据，这些数据都是日渐增长，传统的单库单表是无法支撑这种级别的数据，
必须对其进行分库分表；一但分库分表，表的自增id就失去了意义；故需要一个全局唯一的id来标识每一条数据（商品、订单）。  

例如 一张表1一亿条数据，被你分库分表10张表，原先的id就失去意义，所以需要全局唯一id来标识10张表的数据。


### 二、全局唯一id必须具备什么特点？
1. 全局唯一性：不能出现重复的ID，最基本的要求。
2. 单调递增：保证下一个ID一定大于上一个ID。
3. 趋势递增：在一段时间内，生成的ID是递增的趋势。如：在一段时间内生成的ID在【0，1000】之间，过段时间生成的ID在【1000，2000】之间。
   但在【0-1000】区间内的时候，ID生成有可能第一次是12，第二次是10，第三次是14。
   
4. 信息安全：如果ID是连续递增的，恶意用户就可以很容易的窥见订单号的规则，从而猜出下一个订单号，
   如果是竞争对手，就可以直接知道我们一天的订单量。所以在某些场景下，需要ID无规则。

第2、4两个需求是互斥的，无法同时满足。
同时，在大型分布式网站架构中，除了需要满足ID生成自身的需求外，还需要ID生成系统可用性极高。想象以下，如果ID生成系统瘫痪，
那么整个业务无法进行下去，那将是一次灾难。

因此，做一个全局唯一id生成系统必须满足以下特点：
1. 高可用，可用性达到5个9或4个9。
2. 高QPS，性能不能太差，否则容易造成线程堵塞。

### 三、剖析淘宝商品id的特点：
先体验这几个淘宝商品：  
https://item.taobao.com/item.htm?ft=t&id=608402432432  
https://item.taobao.com/item.htm?ft=t&id=608402432433  
https://item.taobao.com/item.htm?ft=t&id=608402432434  
1. 单调递增：从id608402432432 开始可以递增
2. id很大：例如608402432432已经是6千亿。
淘宝的商品是日渐增长，传统的单库单表是无法支撑这种级别的数据，必须对其进行分库分表；故需要一个全局唯一的id来标识每一件商品。  
全局唯一的id生成的技术方案有很多，业界比较有名的是UUID、redis、Twitter的snowflake算法、美团Leaf算法。  
我们重点来讲解redis生成id算法。


### 四、基于Redis INCR 命令生成 分布式全局唯一id
INCR 命令主要有以下2个特征：
1. Redis的INCR命令具备了“INCR AND GET”的原子操作，即增加并返回结果的原子操作。这个原子性很方便我们实现获取ID.
2. Redis是单进程单线程架构，INCR命令不会出现id重复.
基于以上2个特性，我们可以采用INCR命令来实现分布式全局ID生成。

### 五、案例实战：采用redis生成淘宝商品的全局id
技术思路：
1. 采用redis的INCR的命令，从1自增生成ID。
2. 由于淘宝的商品面向全世界的海量商品，故 必须对其进行分库分表，每张表的id不能用自增，由redis的incr命令来自动生成。
3. 淘宝的海量数据，分库分表分为1024张表，例如商品表 product_0,product_1,product_2......product_1023


#### 步骤1：编写全局id封装类
IdGeneratorService
```java
public interface IdGeneratorService {
    /**
     * 生成全局唯一id
     * @return id
     */
    Long incrementId();
}
```
IdGeneratorServiceImpl
```java
@Slf4j
@Service
public class IdGeneratorServiceImpl implements IdGeneratorService {
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    private static final String ID_KEY = "id:generator:product";

    @Override
    public Long incrementId() {
        long key = this.stringRedisTemplate.opsForValue().increment(ID_KEY);
        return key;
    }
}
```
#### 步骤2：创建商品类及商品详情类

商品类
```java
@Data
public class ProductDTO {
    @ApiModelProperty("商品id")
    private Long id;

    @ApiModelProperty("商品名称")
    private String name;

    @ApiModelProperty("商品价格")
    private double price;

    @ApiModelProperty("商品详情")
    private List<DetailDTO> detailDTOS;
}

```
商品详情类
```java
@Data
public class DetailDTO {
    @ApiModelProperty("商品id")
    private Long productId;

    @ApiModelProperty("商品图片")
    private String productImg;

}
```

#### 步骤三：编写商品创建方法
```java
public interface ProductService {
    /**
     * 模拟创建商品
     * @param productDTO
     */
    void createProductOrder(ProductDTO productDTO);
}
```

```java
@Slf4j
@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private IdGeneratorService idGeneratorService;
    @Override
    public void createProductOrder(ProductDTO productDTO) {
        /**
         * 通过redis获取生成的全局分布式id
         */
        long key = this.idGeneratorService.incrementId();
        productDTO.setId(key);
        for (DetailDTO detailDTO : productDTO.getDetailDTOS()) {
            detailDTO.setProductId(key);
        }

        int mysqlTable = (int) key % 10;
        String tableName = "taobao_product_" + mysqlTable;
        log.info("插入表名{}，插入内容{},插入内容{}",tableName,key, productDTO);
    }
}
```

### 步骤四：编写ProductController
```java
@Api(tags = {"全局分布式唯一商品id"})
@RestController
@RequestMapping("/product")
public class ProductController {
    @Autowired
    private ProductService productService;
    @PostMapping("/create")
    public void createProduct(@RequestBody ProductDTO productDTO) {
        productService.createProductOrder(productDTO);
    }
}
```
### 步骤五：体验效果
浏览器访问http://localhost:8081/swagger-ui.html，在swagger中输出创建参数进行创建，注意id和productId可以不用带，这里由redis自动生成

![image](/redis-img/redis-id.gif)

### 源码下载
 <a href="https://github.com/zhoubiao188/redis/tree/master/redis-string-id">github</a>


