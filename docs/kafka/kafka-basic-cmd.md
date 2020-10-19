## Kafka常用命令
### 启动Kafka
bin/kafka-server-start.sh config/server.properties &

### 停止Kafka
bin/kafka-server-stop.sh
### 创建Topic
bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic jiangzh-topic

### 查看已经创建的Topic信息
bin/kafka-topics.sh --list --zookeeper localhost:2181

### 发送消息
bin/kafka-console-producer.sh --broker-list 192.168.220.128:9092 --topic jiangzh-topic

### 接收消息
bin/kafka-console-consumer.sh --bootstrap-server 192.168.220.128:9092 --topic jiangzh-topic --from-beginning


{"orderId":"002","price":"80"}