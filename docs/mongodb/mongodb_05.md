### mongodb 优势
传统的关系型数据库采用的是ER模式，一旦表多了之后，就会错中复杂，需要话很多时间去整理才能看懂。

#### 采用对象模型
而mongodb采用的是一目了然的对象模型

#### 快速响应业务变化
![image](/mongodb/json.png) 

#### 最简单快速的开发方式
传统的关系型数据库常常因为需要关联多张表才能实现业务查询，而mongodb是最简单快速的开发方式，比如一个客户信息的电话和地址可能是多个，而根据数据库第三范式那么电话号码和地址会各建一张表，这样关系型数据库查询就要查询三张表才能将用户数据查询出来，而mongodb只需要一张表这是为什么呢？因为采用的是JSON模型，其电话号码和地址可以是array数组，如下图：
![image](/mongodb/array.png) 

#### 分布式能力
mongodb原生的高可用和横向扩展能力

![image](/mongodb/fbs.png)

##### Replica set -2 to 50 个成员
复制集群，最少2个最多50个，一般每个节点最少3个或3个以上，因为我们要保证多种机制，所以必须是一个奇数


##### 自恢复
出现故障会自动恢复

##### 多中心容灾能力
比如上海机房服务器挂掉，不会影响北京服务器，且上海服务器挂掉后，会定时恢复过来

#####  滚动服务
比如数据库升级迁移数据，通过只升级一个节点的方式，升级的过程中不用重启数据库，来保证我们的业务正常

#### 横向扩展能力
mongodb横向扩展能力主要通过分片来做到的，把数据通过水平扩展方式分片成1个2个到1000多个上，一个分片就是一个复制集群，10个TB就是10个分片，这样做的话可以降低访问数据慢，从而达到访问非常快，并且和mysql的custer最大区别是mongodb是应用全透明，你表面上看到的可能是1个但是下面可能是10个100个，你不需要关注的，业务全透明。

![image](/mongodb/fenpian.png)  

#### 技术优势总结
JSON 结构和对象模型接近，开发代码量低

JSON的动态模型意味着更容易响应新的业务需求

复制集提供99.9999%高可用

分片架构支持海量数据和无缝扩容


