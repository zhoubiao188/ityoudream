# 在Centos中安装RabbitMQ

### 步骤一 下载文件
1.安装准备，下载安装文件
```
wget https://packages.erlang-solutions.com/erlang-solutions-1.0-1.noarch.rpm
	rpm -Uvh erlang-solutions-1.0-1.noarch.rpm
```
2.安装erlang
```
yum install erlang
```
3.安装完成后可以用erl命令查看是否安装成功
```
erl -version
```

### 步骤二 安装RabbitMQ Server
1.安装准备，下载RabbitMQ Server
```
wget http://www.rabbitmq.com/releases/rabbitmq-server/v3.5.1/rabbitmq-server-3.5.1-1.noarch.rpm
```
2.安装RabbitMQ Server
```
rpm --import http://www.rabbitmq.com/rabbitmq-signing-key-public.asc
	yum install rabbitmq-server-3.5.1-1.noarch.rpm
```

### 步骤三 启动RabbitMQ
1.配置为守护进程随系统自动启动，root权限下执行:
```
chkconfig rabbitmq-server on
```

2.启动rabbitMQ服务
```
/sbin/service rabbitmq-server start
```

### 步骤四 安装Web管理界面插件
1.安装命令
```
rabbitmq-plugins enable rabbitmq_management
```

2.安装成功后会显示如下内容
```
The following plugins have been enabled:
	  mochiweb
	  webmachine
	  rabbitmq_web_dispatch
	  amqp_client
	  rabbitmq_management_agent
	  rabbitmq_management
	Plugin configuration has changed. Restart RabbitMQ for changes to take effect.
```

### 步骤五 设置RabbitMQ远程ip登录
这里我们以创建个zhoubiao帐号，密码123456为例，创建一个账号并支持远程ip访问。

1.创建账号
```
rabbitmqctl add_user zhoubiao 123456
```

2.设置用户角色
```
rabbitmqctl  set_user_tags  zhoubiao  administrator
```

3.设置用户权限
```
rabbitmqctl set_permissions -p "/" zhoubiao ".*" ".*" ".*"
```

4.设置完成后可以查看当前用户和角色(需要开启服务)
```
rabbitmqctl list_users
```

### 步骤六 访问RabbitMQ
浏览器输入：serverip:15672。其中serverip是RabbitMQ-Server所在主机的ip。