#### 搭建MongoDB复制集
##### 步骤一 安装
```
安装最新的 MongoDB 版本

Windows 系统请事先配置好 MongoDB 可执行文件的环境变量

Linux 和 Mac 系统请配置 PATH 变量

确保有 10GB 以上的硬盘空间
```

##### 步骤二 创建数据目录
```
MongoDB 启动时将使用一个数据目录存放所有数据文件。我们将为3个复制集节
点创建各自的数据目录。

Linux/MacOS:
mkdir -p /data/db{1,2,3}

Windows:
md d:\data\db1 
md d:\data\db2
md d:\data\db3
```

##### 步骤二 准备配置文件(一)
复制集的每个mongod进程应该位于不同的服务器。我们现在在一台机器上运行3个进程，因此要
为它们各自配置：
```
不同的端口。示例中将使用28017/28018/28019

不同的数据目录。示例中将使用：
/data/db1或d:\data\db1
/data/db2或d:\data\db2
/data/db3或d:\data\db3

不同日志文件路径。示例中将使用：

/data/db1/mongod.log或d:\data\db1\mongod.log
/data/db2/mongod.log或d:\data\db2\mongod.log
/data/db3/mongod.log或d:\data\db3\mongod.log
```

##### 步骤三 准备配置文件(二)
###### Linux/MacOS
```
# /data/db1/mongod.conf
systemLog:
destination: file
path: /data/db1/mongod.log # log path
logAppend: true
storage:
dbPath: /data/db1 # data directory
net:
bindIp: 0.0.0.0
port: 28017 # port
replication:
replSetName: rs0
processManagement:
fork: true
```
###### Windows
```
# c:\data\db1\mongod.conf
systemLog:
destination: file
path: c:\data1\mongod.log # 日志文件路径
logAppend: true
storage:
dbPath: c:\data1 # 数据目录
net:
bindIp: 0.0.0.0
port: 28017 # 端口
replication:
replSetName: rs0
```
##### 步骤四启动 MongoDB 进程
Linux/Mac:
```
mongod -f /data/db1/mongod.conf
mongod -f /data/db2/mongod.conf
mongod -f /data/db3/mongod.conf
注意：如果启用了 SELinux，可能阻止上述进程启动。简单起见请关闭 SELinux。
```

Windows:
```
mongod -f d:\data1\mongod.conf
mongod -f d:\data2\mongod.conf
mongod -f d:\data3\mongod.conf
因为 Windows 不支持 fork，以上命令需要在3个不同的窗口执行，执行后不可关闭窗口否则
进程将直接结束。
```

#### 步骤五 配置复制集
##### 方法1 
```
# mongo --port 28017
> rs.initiate()
> rs.add(”HOSTNAME:28018")
> rs.add(”HOSTNAME:28019")
注意：此方式hostname 需要能被解析
```

##### 方法2
```javascript
# mongo --port 28017
> rs.initiate({
_id: "rs0",
members: [{
_id: 0,
host: "localhost:28017"
},{
_id: 1,
host: "localhost:28018"
},{
_id: 2,
host: "localhost:28019"
}]
})
```

#### 步骤六 验证
MongoDB 主节点进行写入
```
# mongo localhost:28017
db.test.insert({ a:1 })
db.test.insert({ a:2 });
```
MongoDB 从节点进行读
```
# mongo localhost:28018
rs.slaveOk()
db.test.find()
db.test.find()
```



