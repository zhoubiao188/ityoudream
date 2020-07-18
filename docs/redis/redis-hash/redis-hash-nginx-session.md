### 四、采用docker安装部署Nginx
在主机192.168.1.138下，安装nginx，docker 的安装命令如下：
``` 
docker  run \
-d \
-p 8080:80 \
--name session-nginx \
nginx
```
- -d：在后台运行
- -p：容器的80端口映射到物理机的8080端口
- --name：容器的名字为session-nginx


- 关于为什么要用docker安装？<br>
因为用docker安装非常方便，docker安装1分钟不到就安装完，如果用传统安装，会各自安装包和命令，
最起码需要10分钟才能安装完。所以建议大家用docker安装。


体验:http://192.168.1.138:8080/


### 五、采用docker部署Nginx的集群负载均衡
#### 步骤1：在物理机建3个文件夹目录
- /data/volume/nginx/www    存放nginx的静态文件
- /data/volume/nginx/config 存放nginx的配置文件
- /data/volume/nginx/logs   存放nginx的日志

#### 步骤2：把nginx容器的配置文件拷贝出来
命令如下：
``` 
docker cp session-nginx:/etc/nginx/nginx.conf /data/volume/nginx/config/
docker cp session-nginx:/etc/nginx/conf.d/default.conf /data/volume/nginx/config/
```

#### 步骤3：修改nginx的集群负载均衡配置文件

为达到负载均衡目的，需要修改主机配置文件/data/volume/nginx/config/default.conf

- server外部追加，
```
upstream web {
      server 192.168.1.8:9090;
      server 192.168.1.8:9091; 
}
```
192.168.1.8代表Springboot用户登录服务部署主机

- server里边增加
``` 
location = / {
      proxy_pass http://web;
}
```
修改后 完整的default.conf源码，如下：
``` 
upstream web {
      server 192.168.1.8:9090;
      server 192.168.1.8:9091;
}

server {
    listen       80;
    server_name  localhost;

    #charset koi8-r;
    #access_log  /var/log/nginx/host.access.log  main;

    location / {
        root   /usr/share/nginx/html;
        index  index.html index.htm;
        proxy_pass http://web;
    }

    #error_page  404              /404.html;

    # redirect server error pages to the static page /50x.html
    #
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }

    # proxy the PHP scripts to Apache listening on 127.0.0.1:80
    #
    #location ~ \.php$ {
    #    proxy_pass   http://127.0.0.1;
    #}

    # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
    #
    #location ~ \.php$ {
    #    root           html;
    #    fastcgi_pass   127.0.0.1:9000;
    #    fastcgi_index  index.php;
    #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
    #    include        fastcgi_params;
    #}

    # deny access to .htaccess files, if Apache's document root
    # concurs with nginx's one
    #
    #location ~ /\.ht {
    #    deny  all;
    #}
}
```


#### 步骤4：启动nginx
- 删除原先安装的nginx容器，不然会报错
docker rm -f session-nginx

- 启动nginx容器

``` 
docker  run \
-d \
-p 8080:80 \
--name session-nginx \
-v /data/volume/nginx/www:/usr/share/nginx/html \
-v /data/volume/nginx/config/default.conf:/etc/nginx/conf.d/default.conf \
-v /data/volume/nginx/config/nginx.conf:/etc/nginx/nginx.conf \
-v /data/volume/nginx/logs:/var/log/nginx \
nginx
```
-v的意思就是把目标目录，映射到容器文件目录，例如：把容器的/var/log/nginx目录映射到主机的/data/volume/nginx/logs目录



### 剖析SpringBoot+Nginx的分布式Session不一致性
#### 步骤1：启动SpringBoot用户登录服务
把Springboot用户登录服务，启动2个服务，端口分别为9090和 9091

#### 步骤2：用IE体验效果

http://192.168.1.138:8080/user/login?username=agan1&password=agan1
http://192.168.1.138:8080/user/find/agan1

结论：
1. 用户第一次访问Nginx，请求落到了服务器A，服务器A生成了一个sessionId,并保存在用户的cookie中。
2. 用户第二次再来访问Nginx，它这次把cookie里面的sessionId加入http的请求头中，这时请求落到了服务器B，服务器B发现没有找到sessionId,于是创建了一个新的sessionId并保存在用户的cookie中。
以上2个步骤，在分布式系统中，必将导致session错乱。


