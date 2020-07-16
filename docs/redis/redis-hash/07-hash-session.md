# redis解决了分布式系统的session一致性问题
### 一、Session有什么作用？
Session 是客户端与服务器通讯会话跟踪技术，服务器与客户端保持整个通讯的会话基本信息。  
客户端在第一次访问服务端的时候，服务端会响应一个sessionId并且将它存入到本地cookie中，
在之后的访问会将cookie中的sessionId放入到请求头中去访问服务器，  
如果通过这个sessionid没有找到对应的数据,那么服务器会创建一个新的sessionid并且响应给客户端。


### 二、分布式session有什么问题？