# Nginx

### 功能

1. nginx作为http服务器：类似apache，tomcat，遵循http协议。
   - 访问图片服务器，加载图片
   - 页面静态化：nginx访问html页面。
2. 负载均衡（反向代理服务器）
   - 高并发
   - 提高网站性能
3. 高速缓存，不建议使用，网站访问量小可以使用
4. 保护网站安全

### 安装与启动

1. 安装：brew install nginx

2. 配置文件路径：/usr/local/etc/nginx/nginx.conf

3. 启动Nginx：sudo nginx

4. 关闭Nginx：

   ```shell
   ps -ef|grep nginx
   sudo kill -QUIT pid
   ```


### conf

```nginx
#user  nobody;
worker_processes  1;  //全局块

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;   //events块
}


http {   //http块
    include       mime.types;
    default_type  application/octet-stream;  

    sendfile        on;
   
    keepalive_timeout  65;

    server {  //server块
        listen       80;
        server_name  localhost;

        location / { //资源路径块
            root   html;
            index  index.html index.htm;
        }

      
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

- 全局块：配置影响nginx全局参数，配置工作进程数。默认1
- Events：工作连接数，默认1024.
- http块：配置多个Server，配置虚拟主机，负载均衡等等。
- Server块：配置服务器，服务器端口，服务器IP地址。
- Location块：定位资源文件位置。

### 虚拟主机

> 虚拟主机**(Virtual Host)** 是在同一台机器搭建属于不同域名或者基于不同 IP 的多个网站服务的技术. 可以为运行在同一物理机器上的各个网站指配不同的 IP 和端口, 也可让多个网站拥有不同的域名.
>
> 1. 基于端口的虚拟主机
> 2. 基于域名的虚拟主机

#### 端口虚拟主机

```nginx
http {
    include       mime.types;
    default_type  application/octet-stream;  

    sendfile        on;
   
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  localhost;
        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
     server {
        listen       81;
        server_name  localhost;
        location / {
            root   html-81;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

#### 域名虚拟主机

**host：**

```
127.0.0.1 www.jd.com
127.0.0.1 jd.search.com
```

**conf：**

```nginx
http {
    include       mime.types;
    default_type  application/octet-stream;  

    sendfile        on;
   
    keepalive_timeout  65;

    server {
        listen       80;
        server_name  www.jd.com;

        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
     server {
        listen       80;
        server_name  jd.search.com;
        location / {
            root   html-81;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
}
```

### 反向代理

```nginx
http {
    include       mime.types;
    default_type  application/octet-stream;  

    sendfile        on;
   
    keepalive_timeout  65;

    upstream mytomcat1{
		server 192.168.66.66:8080;
    }

    upstream mytomcat2{
		server 192.168.66.66:8081;
    }

    server {
          listen       80;
          server_name  www.jd.com;
        location / {
	    	proxy_pass http://mytomcat1; # 对应upstream名称
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
  
     server {
          listen       80;
          server_name  jd.search.com;
        location / {
	    	proxy_pass http://mytomcat2;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
              root   html;
        }
    }
}
```

1. 客户机发送请求www.jd.com
2. ​Nginx接受请求：通过nginx.conf配置主机Server地址匹配：www.jd.com
3. 匹配成功：就会去location下面寻找需要资源
4. 在location配置代理：去寻找代理服务器。http://mytomcat1
5. 寻找名称是mytomcat1的upstream
6. Upstream负责把请求转发tomcat1，或者tomcat2.

### 负载均衡

```nginx
upstream backend{
	server 127.0.0.1:8080 weight=1;
  	server 127.0.0.1:8081 weight=2;
}
```

- **IP地址和端口：**用来配置上游服务器的IP地址和端口
- **权重(weight)：**默认都是1，权重越高分配给这台服务器的请求就越多，如上配置8081收到的请求将是8080的2倍

```nginx
location / {
    proxy_pass http://backend;
}
```

当访问Nginx时，会将请求反向代理到backend配置的upstream server。

### 失败重试

失败重试主要分两部分配置：upstream server和proxy_pass。

```nginx
upstream backend{
	server 127.0.0.1:8080 max_fails=2 fail_timeout=10s weight=1;
  	server 127.0.0.1:8081 max_fails=2 fail_timeout=10s weight=1;
}
```

1. 当fail_timeout时间内失败了max_fails此请求，则认为该上游服务器不可用并摘除该上游服务器
2. fail_timeout时间后会再次将该服务器加入到存活上游服务器列表进行重试

## nginx websocket配置示例

```nginx
location /socket/ {
           proxy_pass   http://221.225.80.170:9098/socket/;
           proxy_redirect off;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection  "upgrade";
           client_max_body_size 50m;
           client_body_buffer_size 128k;
           proxy_connect_timeout 900000000;
           proxy_send_timeout 30000000000;
           proxy_read_timeout 300000000;
           proxy_buffer_size 4k;
           proxy_buffers 32 4k;
           proxy_busy_buffers_size 64k;
        }
```

## tcp 转发
```
worker_processes  1;
 
events {
    worker_connections  1024;
}
 
# 此为TCP转发请求 stream 
stream {
    # 后端指向 server 的 8085 端口 stream_backend 组
    upstream stream_backend {
         server 10.50.2.11:8085;
         server 10.50.2.19:8085;
    }
    
    # 后端指向 server 的 8090 端口 cns组
    upstream cns {
         server 10.50.2.11:8090;
         server 10.50.2.19:8090;
    }
     server {
        listen                443 ssl;
        proxy_pass            stream_backend;
        # 指定key 和 crt 地址
        ssl_certificate       /etc/ssl/certs/my.crt;
        ssl_certificate_key   /etc/ssl/certs/my.key;
        ssl_protocols         SSLv3 TLSv1 TLSv1.1 TLSv1.2;
        ssl_ciphers           HIGH:!aNULL:!MD5;
        ssl_session_cache     shared:SSL:20m;
        ssl_session_timeout   4h;
        ssl_handshake_timeout 30s;
    }
  server {
        # 本机监听端口 8080 
        listen                8080;
        
        # 请求抛给 stream_backend 组
        proxy_pass            stream_backend;
       }
  server {
        # 本机监听端口 8090 
        listen                8090;
        
        # 请求抛给 cns 组
        proxy_pass            cns;
       }       
    }
 
    # 此为HTTP 转发请求 http
    http {
        log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                          '$status $body_bytes_sent "$http_referer" '
                          '"$http_user_agent" "$http_x_forwarded_for"';
 
        access_log  /var/log/nginx/access.log  main;
 
        sendfile            on;
        tcp_nopush          on;
        gzip_comp_level 9;
        gzip_types  text/css text/xml  application/javascript;
        gzip_vary on;
 
        include             /etc/nginx/mime.types;
        default_type        application/octet-stream;
        
      # 后端指向 server 的 8585 端口 cns_node 组
      upstream  cns_node {
             server 10.50.2.51:8585 weight=3;
             server 10.50.2.59:8585 weight=3;
        }
       
       server {
        listen       8585;
        server_name umout.com;
 
        access_log  /etc/nginx/logs/server02_access.log main;
 
        location /{
          index index.html index.htm index.jsp;
          proxy_pass http://cns_node1;
          include /etc/nginx/proxy.conf; 
        }
      }
    }
```

