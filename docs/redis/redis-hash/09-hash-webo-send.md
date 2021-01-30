# 基于Redis的用户发微博

### 一、用户发微博业务场景分析


### 二、用户发微博的redis技术方案




### 三、SpringBoot+Redis 实现用户发微博
#### 步骤1：创建content表
``` sql
CREATE TABLE `content` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) NOT NULL DEFAULT '0' COMMENT '用户id',
  `content` varchar(5000) NOT NULL DEFAULT '' COMMENT '内容',
  `deleted` tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '删除标志，默认0不删除，1删除',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='内容表';
```
#### 步骤2：发微博逻辑
``` java
    @ApiOperation(value="用户发微博")
    @PostMapping(value = "/post")
    public void post(@RequestBody ContentVO contentVO) {
        Content content=new Content();
        BeanUtils.copyProperties(contentVO,content);
        contentService.post(content);
    }




    /**
     * 用户发微博
     */
    public Content addContent(Content obj){
        //步骤1：先入库
        this.contentMapper.insertSelective(obj);
        //步骤2：入库成功后 写redis
        obj=this.contentMapper.selectByPrimaryKey(obj.getId());
        //将Object对象里面的属性和值转化成Map对象
        Map<String, Object> map= ObjectUtil.objectToMap(obj);
        //设置缓存key
        String key= Constants.CACHE_CONTENT_KEY+obj.getId();
        //微博内容的redis数据结构 用hash
        HashOperations<String, String ,Object> opsForHash=redisTemplate.opsForHash();
        opsForHash.putAll(key,map);

        //步骤3：设置30天过期
        this.redisTemplate.expire(key,30, TimeUnit.DAYS);
        return obj;
    }

```

#### 步骤3：体验


