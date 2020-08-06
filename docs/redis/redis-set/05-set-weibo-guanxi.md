
# 基于Redis的微博计算好友关系
### 一、计算好友关系业务场景分析
 微博微关系：
 共同关注：是计算出周標和马化腾共同关注的人有哪些？
 我关注的人也关注他：是计算出我周標关注的人群中，有哪些人同时和我一样关注了马化腾

### 二、计算好友关系的redis技术方案
思考题：如果是采用数据库来实现用户的关系，一般SQL怎么写？ 例如 周標关注10个人，马化腾关注100个人，让你计算2人的共同关注那些人？

SQL的写法，一般是采用in 或 not in 来实现。但是对于互联网高并发的系统来说，in  not in 明显不适合。  
一般的做法是采用redis的set集合来实现。  
Redis Set数据结构，非常适合存储好友、关注、粉丝、感兴趣的人的集合。然后采用set的命令就能得出我们想要的数据。  
1. sinter命令：获得A和B两个用户的共同好友  
2. sismember命令：判断C是否为B的好友  
3. scard命令：获取好友数量  




### SpringBoot+Redis 计算微博好友关系
目标：共同关注：是计算出周標和马化腾共同关注的人有哪些？
``` 
@ApiOperation(value="求2个用户的关注交集")
@GetMapping(value = "/intersect")
public List<UserVO> intersect(Integer userId1, Integer userId2){
    return  this.relationService.intersect(userId1,userId2);
}
```
``` 
/**
 * 求2个用户的关注交集
 */
public List<UserVO> intersect(Integer userId1,Integer userId2){
    SetOperations<String, Integer> opsForSet = redisTemplate.opsForSet();

    String followeekey1 = Constants.CACHE_KEY_FOLLOWEE + userId1;
    String followeekey2 = Constants.CACHE_KEY_FOLLOWEE + userId2;
    //求2个集合的交集
    Set<Integer> sets= opsForSet.intersect(followeekey1,followeekey2);
    return this.getUserInfo(sets);
}
```
 
#### 体验效果
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

微关系： 
周標和马化腾的共同关注={王石,潘石岂}  

### 作业
写微关系的代码，实现微关系中的“我关注的人也关注他”功能，把作业提交到我的微信：agan-java，我会为你点评。


