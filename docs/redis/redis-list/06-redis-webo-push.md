
# 基于redis的微博个人首页
### 微博个人首页业务场景分析

### 微博个人首页的redis技术方案





### 3.案例实战:基于push技术，实现微博个人列表
#### 步骤1：发微博后，写入个人主页-队列
``` 
    /**
     * push到个人主页
     */
    public void pushHomeList(Integer userId,Integer postId){
        String key= Constants.CACHE_MY_POST_BOX_LIST_KEY+userId;
        this.redisTemplate.opsForList().leftPush(key,postId);
    }
```

#### 步骤2：查看个人列表
``` 
    /**
     * 获取个人主页列表
     */
    public PageResult<Content> homeList(Integer userId,int page, int size){
        PageResult<Content> pageResult=new PageResult();

        List<Integer> list=null;
        long start = (page - 1) * size;
        long end = start + size - 1;
        try {
            String key= Constants.CACHE_MY_POST_BOX_LIST_KEY+userId;
            //1.查询用户的总数
            int total=this.redisTemplate.opsForList().size(key).intValue();
            pageResult.setTotal(total);

            //2.采用redis list数据结构的lrange命令实现分页查询。
            list = this.redisTemplate.opsForList().range(key, start, end);

            //3.去拿明细
            List<Content> contents=this.getContents(list);
            pageResult.setRows(contents);
        }catch (Exception e){
            log.error("异常",e);
        }
        return pageResult;
    }
```

``` 

    protected List<Content> getContents(List<Integer> list){
        List<Content> contents=new ArrayList<>();

        //发布内容的key
        List<String> hashKeys=new ArrayList<>();
        hashKeys.add("id");
        hashKeys.add("content");
        hashKeys.add("userId");

        HashOperations<String, String ,Object> opsForHash=redisTemplate.opsForHash();
        for (Integer id:list){
            String hkey= Constants.CACHE_CONTENT_KEY+id;
            List<Object> clist=opsForHash.multiGet(hkey,hashKeys);
            //redis没有去db找
            if (clist.get(0)==null && clist.get(1)==null){
                Content obj=this.contentMapper.selectByPrimaryKey(id);
                contents.add(obj);
            }else{
                Content content=new Content();
                content.setId(clist.get(0)==null?0:Integer.valueOf(clist.get(0).toString()));
                content.setContent(clist.get(1)==null?"":clist.get(1).toString());
                content.setUserId(clist.get(2)==null?0:Integer.valueOf(clist.get(2).toString()));
                contents.add(content);
            }
        }
        return contents;
    }
```

#### 步骤3：体验
用户和id的数据库对应关系
阿甘->id=1  
雷军->id=2  
王石->id=3  
潘石岂->id=4  

关注顺序
阿甘关注：雷军 王石 潘石岂
雷军关注：王石 潘石岂
王石关注: 雷军
潘石岂关注：王石

雷军发微博：
第一条微博：123
第二条微博: abc
第一条微博：wwww

体验步骤：
1.雷军先发微博
2.查看雷军的个人主页




### 4.案例实战:基于push技术，实现微博关注列表
#### 步骤1：发一条微博，批量推送给所有粉丝
``` 
    /**
     * 发一条微博，批量推送给所有粉丝
     */
    private void pushFollower(int userId,int postId){
        SetOperations<String, Integer> opsForSet = redisTemplate.opsForSet();

        //读取粉丝集合
        String followerkey=Constants.CACHE_KEY_FOLLOWER+userId;
        //千万不能取set集合的所有数据，如果数据量大的话，会卡死
        // Set<Integer> sets= opsForSet.members(followerkey);
        Cursor<Integer> cursor = opsForSet.scan(followerkey, ScanOptions.NONE);
        try{
            while (cursor.hasNext()){
                //拿出粉丝的userid
                Integer object = cursor.next();
                String key= Constants.CACHE_MY_ATTENTION_BOX_LIST_KEY+object;
                this.redisTemplate.opsForList().leftPush(key,postId);

            }
        }catch (Exception ex){
            log.error("",ex);
        }finally {
            try {
                cursor.close();
            } catch (IOException e) {
                log.error("",e);
            }
        }
    }
```

#### 步骤2：查看关注列表
``` 
    /**
     * 获取关注列表
     */
    public PageResult<Content> attentionList(Integer userId,int page, int size){
        PageResult<Content> pageResult=new PageResult();

        List<Integer> list=null;
        long start = (page - 1) * size;
        long end = start + size - 1;
        try {
            String key= Constants.CACHE_MY_ATTENTION_BOX_LIST_KEY+userId;
            //1.设置总数
            int total=this.redisTemplate.opsForList().size(key).intValue();
            pageResult.setTotal(total);

            //2.采用redis,list数据结构的lrange命令实现分页查询。
            list = this.redisTemplate.opsForList().range(key, start, end);

            //3.去拿明细数据
            List<Content> contents=this.getContents(list);
            pageResult.setRows(contents);
        }catch (Exception e){
            log.error("异常",e);
        }
        return pageResult;
    }
```
#### 步骤3：体验
用户和id的数据库对应关系
阿甘->id=1  
雷军->id=2  
王石->id=3  
潘石岂->id=4  

关注顺序
阿甘关注：雷军 王石 潘石岂
雷军关注：王石 潘石岂
王石关注: 雷军
潘石岂关注：王石

雷军发微博：
第一条微博：今天出太阳了
第二条微博: 下雨了
第一条微博：出现彩虹了

体验步骤：
1.雷军先发微博
2.查看雷军的个人主页
3.阿甘查看推荐首页









