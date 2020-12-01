### 如何安装mongodb
首先安装方式有多种，如windows平台，有linux平台、macos平台、以及可以使用docker容器进行安装

#### windows 安装
<a href="https://www.mongodb.com/try/download/enterprise">download mongodb install</a>

首先去官网下载mongodb，这里我们选择windows然后下载msi就可以了，如果网速慢的话，可以使用vpn代理来安装

![image][mongodb/mongodb-href.png] 


安装完成后，修改mongodb.cnf
```yml
#数据库路径
dbpath=D:\Mongo\data
#日志输出文件路径
logpath=D:\Mongo\logs\mongo.log
#错误日志采用追加模式
logappend=true
#启用日志文件，默认启用
journal=true
#这个选项可以过滤掉一些无用的日志信息，若需要调试使用请设置为false
quiet=true
#端口号 默认为27017
port=27017 
```
最后通过cmd 窗口进行启动输入如下命令
```yml
mongod --config "D:\Mongo\mongo.conf" 
```

#### centos安装mongodb
首先去官网下载
<a href="https://downloads.mongodb.com/linux/mongodb-linux-x86_64-enterprise-rhel70-4.4.2.tgz
">download mongodb install</a>

然后在etc目录下创建mogodb_install目录
```linux
mkdir -p mogodb_install
cd mogodb_install
tar -xvzf xxxxmogo.tgz
mv xxxxmogo mogo_版本号
```

然后我们需要在mogodb文件夹中创建日志文件夹以及存放数据文件的db目录
```linux
mkdir -p logs
mkdir -p db
```

然后修改mongodb.conf
```linux
cd bin/
vim mongodb.conf
设置数据文件的存放目录
dbpath = /etc/mongodb/mongodb4.4.2/bin/data/db

设置日志文件的存放目录及其日志文件名
dbpath = /etc/mongodb/mongodb4.4.2/bin/data/logs/mongodb.log

设置端口号（默认的端口号是 27017）
port = 27017

设置为以守护进程的方式运行，即在后台运行
fork = true


是否禁止http接口,即28017端口开启的服务,默认false,支持

nohttpinterface = true
```


