#### 聚合查询
聚合查询是MongoDB非常好用的框架，但是很多人都没有关注过，MongoDB的聚合查询类似与关系型数据库中，GroupBy、LEFT OUTER JOIN等操作，在MongoDB中可以用聚合查询做一些分析操作

#### 什么是MongoDB的聚合框架
```
它是 一个计算框架，可以：
作用在一个或几个集合上
对集合中的数据进行一系列运算
将这些数据转换为期望的形式 
```

#### 管道(Pipeline) 和 步骤 (Stage)
```
整个聚合运算过程称为管道，它是由多个步骤组成的，每个管道：
接受一系列文档，也就是原始数据
每个步骤对这些文档进行一系列运算
结果文档输出给下一个步骤
```

如下图：
![image](/mongodb/Pipeline-Stage.png) 

聚合运算的基本格式：
```javascript
pipeline = [$stage1, $stage2, ...$stageN];
db.<COLLECTION>.aggregate(
    pipeline,
    { options }
);
```

#### MongoDB聚合常见步骤
| 步骤  | 作用  | SQL等价运算符  |
|  ----  | ---- |  ---- |
| $match  | 过滤 |  WHERE |
| $project  | 投影 |  AS |
| $sort  | 排序 |  ORDER BY |
| $group  | 分组 |  GROUP BY |
| $skip/$limit  | 结果限制 |  SKIP/LIMIT |
| $lookup  | 左外连接 |  LEFT OUTER JOIN |

#### MongoDB步骤中的常见运算符
| $match  | $project  | $group  |
|  ----  | ---- |  ---- |
| $eq/$gt/$gte/$lt/$lte  | 选择需要的或排除不需要的字段 |  $sum/$avg |
| $and/$or/$not/$in  | $map/$reduce/$filter |  $push/$addToSet |
| $geoWithin/$intersect | $range |  $first/$last/$max/$min |
| ... | ... |  ... |

#### 常见步骤
| 步骤  | 作用  | SQL等价运算符  |
|  ----  | ---- |  ---- |
| $unwind  | 展开数组 |  N/A |
| $graphLookup  | 图搜索 |  N/A |
| $facet/$bucket  | 分面搜索 |  N/A |

#### 聚合运算的使用场景
聚合查询可以用于OLAP和OLTP场景。例如：
| OLTP  |  OLAP  |
|  ----  | ---- |  ---- |
| 计算  | 分析一段时间内的销售总额、均值
、 计算一段时间内的净利润
、 分析购买人的年龄分布
、 分析学生成绩分布
、 统计员工绩效  |

#### MQL 常用步骤与 SQL 对比

```sql
SELECT
FIRST_NAME AS `名`,
LAST_NAME AS `姓`
FROM Users
WHERE GENDER = '男'
SKIP 100
LIMIT 20
```
那么转换为聚合函数查询就是下面这样
```javascript
db.users.aggregate([
{$match: {gender: ’’男”}},
{$skip: 100},
{$limit: 20},
{$project: {
'名': '$first_name',
'姓': '$last_name'
}}
]);
```
#### MQL 常用步骤与 SQL 对比
传统sql
```sql
SELECT DEPARTMENT,
COUNT(NULL) AS EMP_QTY
FROM Users
WHERE GENDER = '女'
GROUP BY DEPARTMENT HAVING
COUNT(*) < 10
```
聚合函数
```javascript
db.users.aggregate([
{$match: {gender: '女'}},
{$group: {
_id: '$DEPARTMENT’,
emp_qty: {$sum: 1}
}},
{$match: {emp_qty: {$lt: 10}}}
]);
```

#### MQL 特有步骤 $unwind
 传统sql
 ```sql
 SELECT
FIRST_NAME AS `名`,
LAST_NAME AS `姓`
FROM Users
WHERE GENDER = '男'
SKIP 100
LIMIT 20
 ```
转换为聚合函数
 ```javascript
 db.users.aggregate([
{$match: {gender: ’’男”}},
{$skip: 100},
{$limit: 20},
{$project: {
'名': '$first_name',
'姓': '$last_name'
}}
]);
 ```
 #### MQL 特有步骤 $facet
 什么是$fact?我们购物的时候，比如搜索电视机，可能有30寸的有40寸的有50寸的，有的是液晶，有的是其它类型的，这些都算是纬度，而facet可以查询复杂的纬度，这样看上去会非常直观

 ```javascript
 db.products.aggregate([{
$facet:{
price:{
$bucket:{…}
},
year:{
$bucket:{…}
}
}
}])
 ```

 #### 聚合查询实践
 聚合数据的模型为如下：
 ```javascript
 { 
    "_id" : ObjectId("5dbe7a545368f69de2b4d36e"), 
    "street" : "493 Hilll Curve", 
    "city" : "Champlinberg", 
    "state" : "Texas", 
    "country" : "Malaysia", 
    "zip" : "24344-1715", 
    "phone" : "425.956.7743 x4621", 
    "name" : "Destinee Schneider", 
    "userId" : NumberInt(3573), 
    "orderDate" : ISODate("2019-03-26T03:20:08.805+0000"), 
    "status" : "created", 
    "shippingFee" : NumberDecimal("8.00"), 
    "orderLines" : [
        {
            "product" : "Refined Fresh Tuna", 
            "sku" : "2057", 
            "qty" : NumberInt(25), 
            "price" : NumberDecimal("56.00"), 
            "cost" : NumberDecimal("46.48")
        }, 
        {
            "product" : "Refined Concrete Ball", 
            "sku" : "1738", 
            "qty" : NumberInt(61), 
            "price" : NumberDecimal("47.00"), 
            "cost" : NumberDecimal("47")
        }, 
        {
            "product" : "Rustic Granite Towels", 
            "sku" : "500", 
            "qty" : NumberInt(62), 
            "price" : NumberDecimal("74.00"), 
            "cost" : NumberDecimal("62.16")
        }, 
        {
            "product" : "Refined Rubber Salad", 
            "sku" : "1400", 
            "qty" : NumberInt(73), 
            "price" : NumberDecimal("93.00"), 
            "cost" : NumberDecimal("87.42")
        }, 
        {
            "product" : "Intelligent Wooden Towels", 
            "sku" : "5674", 
            "qty" : NumberInt(72), 
            "price" : NumberDecimal("84.00"), 
            "cost" : NumberDecimal("68.88")
        }, 
        {
            "product" : "Refined Steel Bacon", 
            "sku" : "5009", 
            "qty" : NumberInt(8), 
            "price" : NumberDecimal("53.00"), 
            "cost" : NumberDecimal("50.35")
        }
    ], 
    "total" : NumberDecimal("407")
}
 ```

 #### 聚合查询总销量
 计算到目前为止的所有订单的总销售额
 ```javascript
 use mock;
 db.orders.aggregate([
{ $group:
{
_id: null,
total: { $sum: "$total" }
}
}
])
 ```
返回结果是
```json
 { 
    "_id" : null, 
    "total" : NumberDecimal("44019609")
}
```

#### 聚合实验:订单金额汇总
查询2019年第一季度（1月1日~3月31日）已完成订单（completed）的订单总金
额和订单总数
```javascript
db.orders.aggregate([
// 步骤1：匹配条件
{ $match: { status: "completed", orderDate: {
$gte: ISODate("2019-01-01"),
$lt: ISODate("2019-04-01") } } },
// 步骤二：聚合订单总金额、总运费、总数量
{ $group: {
_id: null,
total: { $sum: "$total" },
shippingFee: { $sum: "$shippingFee" },
count: { $sum: 1 } } },
{ $project: {
// 计算总金额
grandTotal: { $add: ["$total", "$shippingFee"] },
count: 1,
_id: 0 } }
]) 
```
结果如下：
```json
{ "count" : 5875, "grandTotal" : NumberDecimal("2636376.00") }
```

#### 测试数据下载
<a href="/mongodb/data/dump.tar.gz">mock数据下载</a>
下载完成后，通过mongo命令
```linux
tar dump.tar.gz
mongorestore dump
use mock;
......
```












