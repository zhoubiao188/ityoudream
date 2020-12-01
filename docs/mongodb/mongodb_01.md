#### 什么是mongodb数据库
mongodb是非关系型数据库，mongodb是早期一家创业公司所创造出来的，mongodb主要业务是面向大都会人寿保险公司、电商巨头eBay和《纽约时报》等客户出售数据分析软件，早期该公司叫做10gen，后面因为要提高知名度，改名为mongodb inc，
详情可以参考如下文档
<a href="https://www.mongodb.com/press/10gen-announces-company-name-change-mongodb-inc">about 10gen modify mongodb inc</a>

#### mongodb 和关系型数据库有什么区别
mongodb 内部存储的是由JSON组成的对象，所以程序员非常的熟悉，并且很快能够上手，并且语法相当简单，比传统的关系型数据库、如oracle、mysql、sqlserver、postgresql更加精简，其用于电商网站、分布式存储等业务

#### 为什么要使用mongodb
我们有关系型数据库以及业界第一缓存中间件Redis，为什么还要用mongodb呢？可能很多人会问，那么mongodb到底在那些方面略胜一筹？比如加载游戏装备数据数据、美团附近的酒店信息、日志系统、代码审计、tb级以上的数据、注意对事物要求高的需求不要用mongodb，比如优酷视频用来存储评论，并且mongodb的集群非常简单部署，难度系数较低，容易掌握