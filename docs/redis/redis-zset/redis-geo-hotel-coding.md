#### 代码实现美团附近酒店搜索
````java
@RestController
@Slf4j
public class Controller {

    @Autowired
    private RedisTemplate redisTemplate;


    @GetMapping(value = "/init")
    public void init() {
        Map<String, Point> map= Maps.newHashMap();
        map.put("世界之窗",new Point(113.9807127428,22.5428248089));
        map.put("南山威尼斯酒店",new Point(113.9832042690 ,22.5408496326));
        map.put("福田喜来登酒店" ,new Point(114.0684865267,22.5412294122));
        map.put("大梅沙海景酒店",new Point(114.3135524539 ,22.5999265998));
        map.put("南山新年酒店",new Point(113.9349465491,22.5305488659));
        map.put("深圳华强广场酒店",new Point(114.0926367279 ,22.5497917634));
        this.redisTemplate.opsForGeo().add(Constants.HOTEL_KEY,map);
    }

    @GetMapping(value = "/position")
    public Point position(String member) {
        //获取经纬度坐标
        List<Point> list= this.redisTemplate.opsForGeo().position(Constants.HOTEL_KEY,member);
        return list.get(0);
    }


    @GetMapping(value = "/hash")
    public String hash(String member) {
        //geohash算法生成的base32编码值
        List<String> list= this.redisTemplate.opsForGeo().hash(Constants.HOTEL_KEY,member);
        return list.get(0);
    }


    @GetMapping(value = "/distance")
    public Distance distance(String member1, String member2) {
        Distance distance= this.redisTemplate.opsForGeo().distance(Constants.HOTEL_KEY,member1,member2, RedisGeoCommands.DistanceUnit.KILOMETERS);
        return distance;
    }



    /**
     * 通过经度，纬度查找附近的
     */
    @GetMapping(value = "/radiusByxy")
    public GeoResults radiusByxy() {
        //这个坐标是腾讯大厦位置
        Circle circle = new Circle(113.9410499639, 22.5461508801, Metrics.KILOMETERS.getMultiplier());
        //返回50条
        RedisGeoCommands.GeoRadiusCommandArgs args = RedisGeoCommands.GeoRadiusCommandArgs.newGeoRadiusArgs().includeDistance().includeCoordinates().sortAscending().limit(50);
        GeoResults<RedisGeoCommands.GeoLocation<String>> geoResults= this.redisTemplate.opsForGeo().radius(Constants.HOTEL_KEY,circle, args);
        return geoResults;
    }

    /**
     * 通过地方查找附近
     */
    @GetMapping(value = "/radiusByMember")
    public GeoResults radiusByMember() {
        String member="世界之窗";
        //返回50条
        RedisGeoCommands.GeoRadiusCommandArgs args = RedisGeoCommands.GeoRadiusCommandArgs.newGeoRadiusArgs().includeDistance().includeCoordinates().sortAscending().limit(50);
        //半径10公里内
        Distance distance=new Distance(10, Metrics.KILOMETERS);
        GeoResults<RedisGeoCommands.GeoLocation<String>> geoResults= this.redisTemplate.opsForGeo().radius(Constants.HOTEL_KEY,member, distance,args);
        return geoResults;
    }


}
````