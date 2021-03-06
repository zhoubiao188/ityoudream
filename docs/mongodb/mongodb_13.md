#### 文档模型设计  套用设计模式
```
文档模型： 无范式，无思维定式，充分发挥想象力
设计模式：实战过屡试不爽的设计技巧，快速应用
举例：一个 IoT 场景的分桶设计模式，可以帮助把存储空间降低 10 倍并且查询效率提
升数十倍
```

![image](/mongodb/fen1.png) 

#### 问题: 物联网场景下的海量数据处理 – 飞机监控数据
```json
{
"_id" : "20160101050000:CA2790",
"icao" : "CA2790",
"callsign" : "CA2790",
"ts" : ISODate("2016-01-01T05:00:00.000+0000"),
"events" : {
"a" : 31418,
"b" : 173,
"p" : [115, -134],
"s" : 91,
"v" : 80
}
}
```
上面是一条飞机的数据

#### 520亿条，10TB – 海量数据(1)
```
10万架飞机
1 年的数据
每分钟一条
```

#### 520亿条，10TB – 海量数据(1)
![image](/mongodb/fen2.png) 

#### 520亿条，10TB – 海量数据(2)
![image](/mongodb/fen3.png) 

#### 520亿条，10TB – 海量数据(3)
![image](/mongodb/fen4.png) 

#### 520亿条，10TB – 海量数据(4)
![image](/mongodb/fen5.png) 

#### 解决方案: 分桶设计
```javascript
{
"_id" : "20160101050000:WG9943",
"icao" : "WG9943",
"ts" : ISODate("2016-01-01T05:00:00.000+0000"),
"events" : [
{
"a" : 24293, "b" : 319, "p" : [41, 70], "s" : 56,
"t" : ISODate("2016-01-01T05:00:00.000+0000“)
},
{
"a" : 33663, "b" : 134, "p" : [-38, -30], "s" : 385,
"t" : ISODate("2016-01-01T05:00:01.000+0000“)
},
...
]
}

```

#### 520亿条，10TB – 海量数据
可视化表现 24 小时的飞行数据，1440 次读
![image](/mongodb/fen6.png) 


#### 模式小结：分桶
|  场景   | 痛点  | 设计模式的方案及优点  |
|  ----  | ---- |  ---- |
|  时序数据\物联网\智慧城市\智慧交通 | 数据点采集频繁，数据量太多  | 利用文档内嵌数组，将一个时间段的数据聚合到一个文档里。大量减少文档数量 大量减少索引占用空间|



