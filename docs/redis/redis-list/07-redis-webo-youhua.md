###微博个人列表和关注列表的性能瓶颈

#### 微博个人和关注列表的性能瓶颈分析
上节课，我们已经实现了2个list对不对，一个是个人list,一个是关注list
这2个list存在性能的问题，就是这个list无线增长。
大家想想，每个人有2个list,而这2个list每次发微博都会push到个人和关注list，
时间久了必定把redis撑爆对不对，那怎么办呢 ？限定list的长度
给大家看看微博和百度是怎么做到的？
微博限定20页
百度搜索限定了76页



#### 微博个人和关注列表的性能优化方案


优化方案采用：限定个人和关注list的长度为1000，即，
发微博的时候，往个人和关注list push完成后，把list的长度剪切为1000，
具体的技术方案采用list 的ltrim命令来实现。
LTRIM key start end
截取队列指定区间的元素,其余元素都删除






#### 案例实战:微博个人和关注列表的性能优化
``` 
//性能优化，截取前1000条
if(this.redisTemplate.opsForList().size(key)>1000){
    this.redisTemplate.opsForList().trim(key,0,1000);
}
```

