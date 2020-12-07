#### 什么是mongodb数据库
mongodb是非关系型数据库，mongodb是早期一家创业公司所创造出来的，mongodb主要业务是面向大都会人寿保险公司、电商巨头eBay和《纽约时报》等客户出售数据分析软件，早期该公司叫做10gen，后面因为要提高知名度，改名为mongodb inc，
详情可以参考如下文档
<a href="https://www.mongodb.com/press/10gen-announces-company-name-change-mongodb-inc">about 10gen modify mongodb inc</a>

#### 为什么叫文档数据库

文档来自与 'Json Document' ,并非我们理解的PDF、Word文档

#### mongodb 和关系型数据库有什么区别
mongodb 内部存储的是由JSON组成的对象，所以程序员非常的熟悉，并且很快能够上手，并且语法相当简单，比传统的关系型数据库、如oracle、mysql、sqlserver、postgresql更加精简，其用于电商网站、分布式存储等业务

#### 主要用途
应用数据库、类似与oracle、mysql海量数据处理平台，数据处理

#### 主要特点
建模为可选Json数据模型比较适合开发者横向扩展可以支撑很大数据量和并发

#### Mongodb版本
Mongodb有两个版本社区版、和企业版，企业版是收费的，而社区版是开源，免费使用

#### Mongodb支持事物吗
Mongodb从4.0完全支持ACI事物了，并且核心的交易也能做到的

#### Mongodb版版变迁
0.x起步阶段 2008年
1.x 支持复制集和分片集 2010
2.x 更丰富的数据库功能 2012
3.x WiredTiger和周边生态环境 2014
4.x 支持分布式事物 2018

#### Mongodb vs 关系型数据库
|     | Mongodb  | RDBMS  |
|  ----  | ----  | ----  | ----  |
| 数据模型  | 文档模型 | 关系模型 |
| 数据库类型  | OLTP | OLTP |
| CRUD操作  | MOL/SQL | SQL |
| 高可用  | 复制集 | 集群模式 |
| 横向扩展能力  | 通过原生分片完善支持 | 数据分区或者应用侵入式 |
| 索引支持  | B-树、全文索引、地理位置索引、多键(multikey)索引、TTL索引 | B 树 |
| 开发难度  | 容易 | 困难 |
| 数据容量  | 没有理论限制 | 千万、亿 |
| 扩展方式  | 垂直扩展+水平扩展 | 垂直扩展 |








#### 为什么要使用mongodb
我们有关系型数据库以及业界第一缓存中间件Redis，为什么还要用mongodb呢？可能很多人会问，那么mongodb到底在那些方面略胜一筹？比如加载游戏装备数据数据、美团附近的酒店信息、日志系统、代码审计、tb级以上的数据、注意对事物要求高的需求不要用mongodb，比如优酷视频用来存储评论，并且mongodb的集群非常简单部署，难度系数较低，容易掌握


