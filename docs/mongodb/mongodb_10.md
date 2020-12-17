#### MongoDB全家桶 各个软件模块

| 软件模块  | 描述 |
|  ----  | ---- |
| mongod  | MongoDB 数据库软件 |
| mongo  | MongoDB 命令行工具，管理 MongoDB 数据库 |
| mongos  | MongoDB 路由进程，分片环境下使用|
| mongodump / mongorestore  | 命令行数据库备份与恢复工具|
| mongoexport / mongoimport  | CSV/JSON 导入与导出，主要用于不同系统间数据迁移|
| Compass  | MongoDB GUI 管理工具|
| Ops Manager(企业版）  | MongoDB 集群管理软件|
| BI Connector(企业版） | SQL 解释器 / BI 套接件|
| MongoDB Charts(企业版） | MongoDB 可视化软件|
| Atlas（付费及免费） | MongoDB 云托管服务，包括永久免费云数据库|

#### mongodump / mongorestore
```
类似于 MySQL 的 dump/restore 工具
可以完成全库 dump：不加条件
也可以根据条件 dump 部分数据：-q 参数
Dump 的同时跟踪数据就更：--oplog
Restore 是反操作，把 mongodump 的输出导入到 mongodb
mongodump -h 127.0.0.1:27017 -d test -c test
mongorestore -h 127.0.0.1:27017 -d test -c test xxx.bson
```

#### Atlas – MongoDB 公有云托管服务
![image](/mongodb/mongo-Atlas.png) 

#### MongoDB BI Connector
这个东西是收费的插件，它的作用是可以将传统的SQL转换为MQL，比如将Mysql的SQL操作语句转换为MongoDB的MQL语句，需要注意的是Connector工具并不是为了替代MQL，也不是说用了这款插件，那么就可以写SQL来替代MQL这种是错误的观念。

![image](/mongodb/mongo-connector.png) 

#### MongoDB Ops Manager - 集群管理平台
![image](/mongodb/mongo-manager.png) 

分片的备份以及操作目前只能用MongoDB Ops Manager来可视化管理，好像目前还没有其它的第三方软件做到。

#### MongoDB Charts
![image](/mongodb/mongo-map.png) 

MongoDB的报表插件MongoDB Charts，和前端JavaScript有一个组件库Echarts非常的像，这款唯一的好处就是不用写代码，通过拖拽组件，然后通过自定义查询或者选择关键字来生成图表，然后可以将生成的图表，以html代码来嵌入你想要放的页面，非常的方便。

它有那些特性：
```
托拉拽创建 MongoDB 图表
创建、分享和嵌入 MongoDB 数据可视化的最快、最便捷方式
专为 MongoDB 文档模型设计
一行代码在你网页应用程序中嵌入图表
```










