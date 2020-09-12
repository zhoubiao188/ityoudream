

### 案例实战：基于redis的直播发言弹幕
#### 步骤1：模拟直播间的数据
``` java
/**
     *模拟直播间的数据
     */
    public void refreshRoom(){
        List<Content> contents=new ArrayList<>();
        //模拟直播100房间号 的弹幕数据
        String  key= Constants.ROOM_KEY+100;
        Random rand = new Random();
        for(int i=1;i<=5;i++){
            Content content=new Content();
            int id= rand.nextInt(1000);
            content.setUserId(id);

            int temp= rand.nextInt(100);
            content.setContent("发表"+temp);

            long time=System.currentTimeMillis()/1000;
            this.redisTemplate.opsForZSet().add(key,content,time);

            log.debug("模拟直播间100的发言弹幕数据={}",content);
        }
    }
```
#### 步骤2：第一次进入房间,返回最新的前5条弹幕
``` java
    @GetMapping(value = "/goRoom")
    public List<Content> goRoom(Integer roomId,Integer userId){

        List<Content> list= new ArrayList<>();

        String  key= Constants.ROOM_KEY+roomId;
        //进入房间,返回最新的前5条弹幕
        Set<ZSetOperations.TypedTuple<Content>> rang=
                this.redisTemplate.opsForZSet().reverseRangeWithScores(key,0,5);
        for (ZSetOperations.TypedTuple<Content> obj:rang){
            list.add(obj.getValue());
            log.debug("content={},score={}",obj.getValue(),obj.getScore().longValue());
        }

        String userkey=Constants.ROOM_USER_TIME_KEY+userId;
        //把当前的时间T,保持到redis，供下次拉取用
        Long now=System.currentTimeMillis()/1000;
        this.redisTemplate.opsForValue().set(userkey,now);
        return list;
    }
```

#### 步骤3：登录房间后 客户端间隔5秒钟来拉取数据
``` java
    /**
     *登录房间后 客户端间隔1-5秒钟来拉取数据
     */
    @GetMapping(value = "/commentList")
    public List<Content>  commentList(Integer roomId,Integer userId){
        List<Content> list= new ArrayList<>();

        String key= Constants.ROOM_KEY+roomId;
        String userkey=Constants.ROOM_USER_TIME_KEY+userId;

        long now=System.currentTimeMillis()/1000;
        //拿取上次的读取时间
        Long ago=Long.parseLong(this.redisTemplate.opsForValue().get(userkey).toString());
        log.debug("查找范围：{}  {}",ago,now);
        //获取上次到现在的数据
        Set<ZSetOperations.TypedTuple<Content>> rang= this.redisTemplate.opsForZSet().rangeByScoreWithScores(key,ago,now);
        for (ZSetOperations.TypedTuple<Content> obj:rang){
            list.add(obj.getValue());
            log.debug("content={},score={}",obj.getValue(),obj.getScore().longValue());
        }

        //把当前的时间T,保持到redis，供下次拉取用
        now=System.currentTimeMillis()/1000;
        this.redisTemplate.opsForValue().set(userkey,now);
        return list;
    }
```