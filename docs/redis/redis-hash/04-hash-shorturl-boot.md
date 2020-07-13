#### 短链接转换器实战
#### 步骤1：编写生成短链接Service
```java
/**
 * 将长网址 md5 生成 32 位签名串,分为 4 段, 每段 8 个字节
 * 对这四段循环处理, 取 8 个字节, 将他看成 16 进制串与 0x3fffffff(30位1) 与操作, 即超过 30 位的忽略处理
 * 这 30 位分成 6 段, 每 5 位的数字作为字母表的索引取得特定字符, 依次进行获得 6 位字符串
 * 总的 md5 串可以获得 4 个 6 位串,取里面的任意一个就可作为这个长 url 的短 url 地址
 */
public class ShortUrlGenerator {
    //26+26+10=62
    public static  final  String[] chars = new String[]{"a", "b", "c", "d", "e", "f", "g", "h",
            "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
            "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5",
            "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H",
            "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T",
            "U", "V", "W", "X", "Y", "Z"};



    /**
     * 一个长链接URL转换为4个短KEY
     */
    public static String[] shortUrl(String url) {
        String key = "";
        //对地址进行md5
        String sMD5EncryptResult = DigestUtils.md5Hex(key + url);
        System.out.println(sMD5EncryptResult);
        String hex = sMD5EncryptResult;
        String[] resUrl = new String[4];
        for (int i = 0; i < 4; i++) {
            //取出8位字符串，md5 32位，被切割为4组，每组8个字符
            String sTempSubString = hex.substring(i * 8, i * 8 + 8);

            //先转换为16进账，然后用0x3FFFFFFF进行位与运算，目的是格式化截取前30位
            long lHexLong = 0x3FFFFFFF & Long.parseLong(sTempSubString, 16);

            String outChars = "";
            for (int j = 0; j < 6; j++) {
                //0x0000003D代表什么意思？他的10进制是61，61代表chars数组长度62的0到61的坐标。
                //0x0000003D & lHexLong进行位与运算，就是格式化为6位，即61内的数字
                //保证了index绝对是61以内的值
                long index = 0x0000003D & lHexLong;

                outChars += chars[(int) index];
                //每次循环按位移5位，因为30位的二进制，分6次循环，即每次右移5位
                lHexLong = lHexLong >> 5;
            }

            // 把字符串存入对应索引的输出数组
            resUrl[i] = outChars;
        }
        return resUrl;
    }

    public static void main(String[] args) {
        // 长连接
        String longUrl = "https://detail.tmall.com/item.htm?id=597254411409";
        // 转换成的短链接后6位码，返回4个短链接
        String[] shortCodeArray = shortUrl(longUrl);

        for (int i = 0; i < shortCodeArray.length; i++) {
            // 任意一个都可以作为短链接码
            System.out.println(shortCodeArray[i]);
        }
    }
}

```

#### 步骤2：编写controller
```java
@RestController
@Slf4j
public class ShortUrlController {

    @Autowired
    private HttpServletResponse response;

    @Autowired
    private RedisTemplate redisTemplate;
    private  final static  String SHORT_URL_KEY="short:url";

    /**
     * 长链接转换为短链接
     * 实现原理：长链接转换为短加密串key，然后存储在redis的hash结构中。
     */
    @GetMapping(value = "/encode")
    public String encode(String url) {
        //一个长链接url转换为4个短加密串key
        String [] keys= ShortUrlGenerator.shortUrl(url);
        //任意取出其中一个，我们就拿第一个
        String key=keys[0];
        //用hash存储，key=加密串，value=原始url
        this.redisTemplate.opsForHash().put(SHORT_URL_KEY,key,url);
        log.info("长链接={}，转换={}",url,key);
        return "http://127.0.0.1:9090/"+key;
    }

    /**
     * 重定向到原始的URL
     * 实现原理：通过短加密串KEY到redis找出原始URL，然后重定向出去
     */
    @GetMapping(value = "/{key}")
    public void decode(@PathVariable String key) {
        //到redis中把原始url找出来
        String url=(String) this.redisTemplate.opsForHash().get(SHORT_URL_KEY,key);
        try {
            //重定向到原始的url
            response.sendRedirect(url);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
```
#### 步骤3：用swagger体验效果