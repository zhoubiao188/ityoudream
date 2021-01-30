
### 高并发的微信抢红包

### 一、微信抢红包的并发场景分析
关于微信抢红包，每个人应该都用过，我们今天就来聊聊这个抢红包的技术实现。
像微信抢红包的高峰期一般是在年底公司开年会和春节2个时间段，高峰的并发量是在几千万以上。
高峰的抢红包有3大特点：
1. 包红包的人多：也就是创建红包的任务比较多，即红包系统是以单个红包的任务来区分，特点就是在高峰期红包任务多。
2. 抢红包的人更多：当你发红包出去后，是几十甚至几百人来抢你的红包，即单红包的请求并发量大。
3. 抢红包体验：当你发现红包时，要越快抢到越开心，所以要求抢红包的响应速度要快，一般1秒响应。

### 一、微信抢红包的技术实现原理
- 包红包
1.先把金额拆解为小金额的红包，例如 总金额100元，发20个，用户在点保存的时候，就自动拆解为20个随机小红包。
2.这里的存储就是个难题，多个金额（例如20个小金额的红包）如何存储？采用set？ list？ hash？

- 抢红包
高并发的抢红包时核心的关键技术，就是控制各个小红包的原子性。
例如 20个红包在500人的群里被抢，20个红包被抢走一个的同时要不红包的库存减1，即剩下19个。
在整个过程中抢走一个 和 红包库存减1个 是一个原子操作。
那数据类型符合 "抢走一个 和 红包库存减1个 是一个原子操作" 采用set？ list？ hash？
list比较适合？？？？？
list的pop操作弹出一个元素的同时会自动从队列里面剔除该元素，它是一个原子性操作。

### 二、案例实战:SpringBoot+Redis实现微信抢红包
``` java
    /**
     * 包红包的接口
     */
    @GetMapping(value = "/set")
    public long setRedpacket(int total, int count) {
        //拆解红包
        Integer[] packet= this.splitRedPacket(total,count);
        //为红包生成全局唯一id
        long n=this.incrementId();
        //采用list存储红包
        String key=RED_PACKET_KEY+n;
        this.redisTemplate.opsForList().leftPushAll(key,packet);
        //设置3天过期
        this.redisTemplate.expire(key,3, TimeUnit.DAYS);
        log.info("拆解红包{}={}",key,packet);
        return n;
    }
    
    
    /**
     * 抢红包接口
     */
    @GetMapping(value = "/rob")
    public int rob(long redid,long userid) {
        //第一步：验证该用户是否抢过
        Object packet=this.redisTemplate.opsForHash().get(RED_PACKET_CONSUME_KEY+redid,String.valueOf(userid));
        if(packet==null){
            //第二步：从list队列，弹出一个红包
            Object obj=this.redisTemplate.opsForList().leftPop(RED_PACKET_KEY+redid);
            if(obj!=null){
                //第三步：抢到红包存起来
                this.redisTemplate.opsForHash().put(RED_PACKET_CONSUME_KEY+redid,String.valueOf(userid),obj);
                log.info("用户={}抢到{}",userid,obj);
                //TODO 异步把数据落地到数据库上
                return (Integer) obj;
            }
            //-1 代表抢完
            return -1;
        }
        //-2 该用户代表已抢
        return -2;
    }


```