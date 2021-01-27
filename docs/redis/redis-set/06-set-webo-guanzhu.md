# 基于Redis的微博关注与粉丝

### 一、微博关注与粉丝的业务场景分析
周標关注了马化腾：周標就是马化腾的粉丝follower
马化腾被周標关注：马化腾就是周標的关注followee

### 二、微博关注与粉丝的redis技术方案
技术方案：每个用户都有2个集合：关注集合和粉丝集合
例如 周標关注了马化腾，做了2个动作

1.把周標的userid加入马化腾的粉丝follower集合set
2.把马化腾的userid加入周標的关注followee集合set
 集合key设计
 周標的关注集合 key=followee:周標userid
 马化腾的粉丝集合 key=follower：马化腾userid


### SpringBoot+Redis 实现微博关注与粉丝
#### 功能1：关注
``` java
    /**
     * 周標关注了马化腾，周標即使马化腾的粉丝 follower
     * userId=周標
     * followeeId=马化腾
     */
    @ApiOperation(value="关注")
    @PostMapping(value = "/follow")
    public void follow(Integer userId,Integer followeeId) {
        relationService.follow(userId,followeeId);
    }
```
``` java
    /**
     * 周標关注了马化腾
     */
    public void follow(Integer userId,Integer followeeId){
        SetOperations<String, Integer> opsForSet = redisTemplate.opsForSet();
        //周標的关注集合
        String followeekey = Constants.CACHE_KEY_FOLLOWEE + userId;
        //把马化腾的followeeId，加入周標的关注集合中
        opsForSet.add(followeekey,followeeId);

        //马化腾的粉丝集合
        String followerkey=Constants.CACHE_KEY_FOLLOWER+followeeId;
        //把周標的userid加入马化腾的粉丝follower集合set
        opsForSet.add(followerkey,userId);

    }
```
#### 功能2：我的关注
``` java
    @ApiOperation(value="查看我的关注")
    @GetMapping(value = "/myFollowee")
    public List<UserVO> myFollowee(Integer userId){

        return this.relationService.myFollowee(userId);
    }
    
    /**
     * 查看我的关注
     */
    public List<UserVO> myFollowee(Integer userId){
        SetOperations<String, Integer> opsForSet = redisTemplate.opsForSet();
        //关注集合
        String followeekey = Constants.CACHE_KEY_FOLLOWEE + userId;
        Set<Integer> sets= opsForSet.members(followeekey);
        return this.getUserInfo(sets);
    }
```

#### 功能3：我的粉丝
``` java
    @ApiOperation(value="查看我的粉丝")
    @GetMapping(value = "/myFollower")
    public List<UserVO> myFollower(Integer userId){
        return this.relationService.myFollower(userId);
    }
```
``` java
    /**
     * 查看我的粉丝
     */
    public List<UserVO> myFollower(Integer userId){
        SetOperations<String, Integer> opsForSet = redisTemplate.opsForSet();
        //粉丝集合
        String followerkey=Constants.CACHE_KEY_FOLLOWER+userId;
        Set<Integer> sets= opsForSet.members(followerkey);

        return this.getUserInfo(sets);
    }
```
### 三、体验效果
用户和id的数据库对应关系
周標->id=1  
马化腾->id=2  
王石->id=3  
潘石岂->id=4  

关注顺序
周標关注：马化腾 王石 潘石岂
马化腾关注：王石 潘石岂
王石关注: 马化腾
潘石岂关注：王石
