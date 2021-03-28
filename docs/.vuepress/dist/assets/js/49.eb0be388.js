(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{491:function(a,t,r){"use strict";r.r(t);var s=r(21),e=Object(s.a)({},(function(){var a=this,t=a.$createElement,r=a._self._c||t;return r("ContentSlotsDistributor",{attrs:{"slot-key":a.$parent.slotKey}},[r("h2",{attrs:{id:"kafka常用命令"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#kafka常用命令"}},[a._v("#")]),a._v(" Kafka常用命令")]),a._v(" "),r("h3",{attrs:{id:"启动kafka"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#启动kafka"}},[a._v("#")]),a._v(" 启动Kafka")]),a._v(" "),r("p",[a._v("bin/kafka-server-start.sh config/server.properties &")]),a._v(" "),r("h3",{attrs:{id:"停止kafka"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#停止kafka"}},[a._v("#")]),a._v(" 停止Kafka")]),a._v(" "),r("p",[a._v("bin/kafka-server-stop.sh")]),a._v(" "),r("h3",{attrs:{id:"创建topic"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#创建topic"}},[a._v("#")]),a._v(" 创建Topic")]),a._v(" "),r("p",[a._v("bin/kafka-topics.sh --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic jiangzh-topic")]),a._v(" "),r("h3",{attrs:{id:"查看已经创建的topic信息"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#查看已经创建的topic信息"}},[a._v("#")]),a._v(" 查看已经创建的Topic信息")]),a._v(" "),r("p",[a._v("bin/kafka-topics.sh --list --zookeeper localhost:2181")]),a._v(" "),r("h3",{attrs:{id:"发送消息"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#发送消息"}},[a._v("#")]),a._v(" 发送消息")]),a._v(" "),r("p",[a._v("bin/kafka-console-producer.sh --broker-list 192.168.220.128:9092 --topic jiangzh-topic")]),a._v(" "),r("h3",{attrs:{id:"接收消息"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#接收消息"}},[a._v("#")]),a._v(" 接收消息")]),a._v(" "),r("p",[a._v("bin/kafka-console-consumer.sh --bootstrap-server 192.168.220.128:9092 --topic jiangzh-topic --from-beginning")]),a._v(" "),r("p",[a._v('{"orderId":"002","price":"80"}')]),a._v(" "),r("h2",{attrs:{id:"kafka基本原理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#kafka基本原理"}},[a._v("#")]),a._v(" kafka基本原理")]),a._v(" "),r("p",[r("img",{attrs:{src:"/kafka/kafka-basic.png",alt:""}})])])}),[],!1,null,null,null);t.default=e.exports}}]);