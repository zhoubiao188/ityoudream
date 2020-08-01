
### 京东京豆抽奖实战
#### 一、京东京豆抽奖的业务场景分析


#### 二、京东京豆抽奖的技术方案
京豆抽奖一般是采用redis的set集合来操作的，那为什么是set集合适用于抽奖呢？
2个原因：
1.set集合的特点是元素不重复 存放1个 5个 10个京豆 谢谢参与
2.set集合支持随机读取
具体的技术方案是采用set集合的srandmember命令来实现，随机返回set的一个元素


#### 三、案例实战：SpringBoot+Redis 实现京东京豆抽奖
##### 步骤1：奖品的初始化
由于set集合是不重复，故在奖品初始化的时候，要为每个奖品设置一个序列号。
``` 
    /**
     *提前先把数据刷新到redis缓存中。
     */
    @PostConstruct
    public void init(){
        log.info("启动初始化..........");

        boolean bo=this.redisTemplate.hasKey(Constants.PRIZE_KEY);
        if(!bo){
            List<String> crowds=this.prize();
            crowds.forEach(t->this.redisTemplate.opsForSet().add(Constants.PRIZE_KEY,t));
        }
    }

    /**
     *按一定的概率初始化奖品
     */
    public List<String> prize() {
        List<String> list=new ArrayList<>();
        //10个京豆，概率10%
        for (int i = 0; i < 10; i++) {
            list.add("10-"+i);
        }
        //5个京豆，概率20%
        for (int i = 0; i < 20; i++) {
            list.add("5-"+i);
        }
        //1个京豆，概率60%
        for (int i = 0; i < 60; i++) {
            list.add("1-"+i);
        }
        //0个京豆，概率10%
        for (int i = 0; i < 10; i++) {
            list.add("0-"+i);
        }
        return list;
    }
```
##### 步骤2：抽奖
``` 

    @GetMapping(value = "/prize")
    public String prize() {
        String result="";
        try {
            //随机取1次。
            String object = (String)this.redisTemplate.opsForSet().randomMember(Constants.PRIZE_KEY);
            if (!StringUtils.isEmpty(object)){
                //截取序列号 例如10-1
                int temp=object.indexOf('-');
                int no=Integer.valueOf(object.substring(0,temp));
                switch (no){
                    case 0:
                        result="谢谢参与";
                        break;
                    case 1:
                        result="获得1个京豆";
                        break;
                    case 5:
                        result="获得5个京豆";
                        break;
                    case 10:
                        result="获得10个京豆";
                        break;
                    default:
                        result="谢谢参与";
                }
            }
            log.info("查询结果：{}", object);
        } catch (Exception ex) {
            log.error("exception:", ex);
        }
        return result;
    }
```
##### 步骤3：体验
