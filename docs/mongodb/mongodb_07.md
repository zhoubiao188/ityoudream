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












