## 什么是redis zset类型？
zset 是 set 的一个升级版本，它在 set 的基础上增加了一个顺序属性，
它和 set 一样，zset也是 string 类型元素的集合,且不允许重复的成员，不同的是每个元素都会关联一个 double类型的 score。
集合是通过哈希表实现的，所以添加，删除，查找的复杂度都是O(1)。 
集合中最大的成员数为 2的（32 - 1）次方 (4294967295, 每个集合可存储40多亿个成员)。
zset 最经典的应用场景就是排行榜。





##ZADD
ZADD key score member [[score member] [score member] ...]
将一个或多个member元素及其score值加入到有序集key当中。

##ZRANGE
ZRANGE key start stop [WITHSCORES]
返回有序集key中，指定区间内的成员。

```
案例：创业公司招进了4个员工，分别为： alex 工资2000元  tom工资5000元 jack工资6000元 阿甘1000元，请按工资升序排序
39.100.196.99:6379> zadd salary 2000  alex  5000 tom 6000 jack 1000 zhoubiao
(integer) 4
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "zhoubiao"
2) "1000"
3) "alex"
4) "2000"
5) "tom"
6) "5000"
7) "jack"
8) "6000"
(1.21s)

```
##ZREM
ZREM key member [member ...]
移除有序集key中的一个或多个成员，不存在的成员将被忽略。
``` 
案例：创业公司 tom离职了
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "zhoubiao"
2) "1000"
3) "alex"
4) "2000"
5) "tom"
6) "5000"
7) "jack"
8) "6000"
(1.21s)
39.100.196.99:6379> zrem salary tom
(integer) 1
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "zhoubiao"
2) "1000"
3) "alex"
4) "2000"
5) "jack"
6) "6000"
```
##ZCARD
ZCARD key
返回有序集key的基数。
``` 
案例：创业公司 有多少人
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "zhoubiao"
2) "1000"
3) "alex"
4) "2000"
5) "jack"
6) "6000"
39.100.196.99:6379> zcard salary
(integer) 3

```
##ZCOUNT
ZCOUNT key min max
返回有序集key中，score值在min和max之间(默认包括score值等于min或max)的成员。
``` 
案例：创业公司老板问你 ，工资在2000 至 6000有多少人
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "zhoubiao"
2) "1000"
3) "alex"
4) "2000"
5) "tom"
6) "5000"
7) "jack"
8) "6000"
39.100.196.99:6379> ZCOUNT salary 2000 6000
(integer) 3
```
##ZSCORE
ZSCORE key member
返回有序集key中，成员member的score值。
```  
案例：创业公司老板问你 ，阿甘的工资是多少 ？
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "zhoubiao"
2) "1000"
3) "alex"
4) "2000"
5) "tom"
6) "5000"
7) "jack"
8) "6000"
39.100.196.99:6379> zscore salary zhoubiao
"1000"
```

##ZINCRBY
ZINCRBY key increment member
为有序集key的成员member的score值加上增量increment。
``` 
案例：创业公司老板说阿甘表现很好，给他加500元吧 
39.100.196.99:6379> ZINCRBY salary 500 zhoubiao
"1500"
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "zhoubiao"
2) "1500"
3) "alex"
4) "2000"
5) "tom"
6) "5000"
7) "jack"
8) "6000"

```
##ZREVRANGE
ZREVRANGE key start stop [WITHSCORES]
返回有序集key中，指定区间内的成员,降序。
```
案例：创业公司老板说经济不好，成本太大，看工资最多的是哪些人？
39.100.196.99:6379> zrange salary 0 -1 withscores  #升序
1) "zhoubiao"
2) "1500"
3) "alex"
4) "2000"
5) "tom"
6) "5000"
7) "jack"
8) "6000"
39.100.196.99:6379> ZREVRANGE salary 0 -1 withscores #降序
1) "jack"
2) "6000"
3) "tom"
4) "5000"
5) "alex"
6) "2000"
7) "zhoubiao"
8) "1500"

```
##ZRANGEBYSCORE 取某个范围score的member，可以用于分页查询
ZRANGEBYSCORE key min max [WITHSCORES] [LIMIT offset count]

返回有序集key中，所有score值介于min和max之间(包括等于min或max)的成员。有序集成员按score值递增(从小到大)次序排列。
``` 
案例：创业公司老板要给工资低的人加薪水，老板要求先看低于5000元的有哪些人？人多的话分页查看
39.100.196.99:6379> ZREVRANGE salary 0 -1 withscores
1) "jack"
2) "6000"
3) "tom"
4) "5000"
5) "alex"
6) "2000"
7) "zhoubiao"
8) "1500"
39.100.196.99:6379> ZRANGEBYSCORE salary 1 5000
1) "zhoubiao"
2) "alex"
3) "tom"
39.100.196.99:6379> ZRANGEBYSCORE salary 1 5000 LIMIT 0 2
1) "zhoubiao"
2) "alex"
39.100.196.99:6379> ZRANGEBYSCORE salary 1 5000 LIMIT 2 2
1) "tom"

```
## ZREVRANGEBYSCORE 和上面的功能意义，但是这次是降序的
ZREVRANGEBYSCORE key max min [WITHSCORES] [LIMIT offset count]
返回有序集key中，score值介于max和min之间(默认包括等于max或min)的所有的成员。有序集成员按score值递减(从大到小)的次序排列。


## ZRANK 取某个member的排名,升序
ZRANK key member
``` 
案例：创业公司老板要查，工资从低到高，查某个员工排第几名？
9.100.196.99:6379> ZREVRANGE salary 0 -1 withscores
1) "jack"
2) "6000"
3) "tom"
4) "5000"
5) "alex"
6) "2000"
7) "zhoubiao"
8) "1500"
(0.75s)
39.100.196.99:6379> ZRANK salary zhoubiao
(integer) 0
```
##ZREVRANK 取某个member的排名，降序
ZREVRANK key member

##ZREMRANGEBYRANK 移除指定排名(rank)区间内的所有成员。
ZREMRANGEBYRANK key start stop
``` 
案例：经济不好，老板要裁员了，把工资最低的2个人裁掉
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "zhoubiao"
2) "1500"
3) "alex"
4) "2000"
5) "tom"
6) "5000"
7) "jack"
8) "6000"
39.100.196.99:6379> ZREMRANGEBYRANK salary 0 1
(integer) 2
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "tom"
2) "5000"
3) "jack"
4) "6000"
```
##ZREMRANGEBYSCORE 移除指定score值介于min和max之间(包括等于min或max)的成员。
ZREMRANGEBYSCORE key min max
``` 
案例：经济不好，老板要裁员了，把工资1000至2000之间的人裁掉
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "zhoubiao"
2) "1000"
3) "alex"
4) "2000"
5) "tom"
6) "5000"
7) "jack"
8) "6000"
39.100.196.99:6379> ZREMRANGEBYSCORE salary 1000 2000
(integer) 2
39.100.196.99:6379> zrange salary 0 -1 withscores
1) "tom"
2) "5000"
3) "jack"
4) "6000"
```
##ZINTERSTORE 求交集
ZINTERSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
计算给定的一个或多个有序集的交集，其中给定key的数量必须以numkeys参数指定，并将该交集(结果集)储存到destination。
``` 
39.100.196.99:6379> zadd group1 10 a 20 b 30 c
(integer) 3
39.100.196.99:6379> zadd group2 10 x 20 y 30 z 20 c
(integer) 4
39.100.196.99:6379> ZINTERSTORE group3 group1 group2
(error) ERR value is not an integer or out of range
39.100.196.99:6379> ZINTERSTORE group3 2 group1 group2
(integer) 1
39.100.196.99:6379> zrange group3 0 -1 withscores
1) "c"
2) "50"
```
##ZUNIONSTORE 求并集
ZUNIONSTORE destination numkeys key [key ...] [WEIGHTS weight [weight ...]] [AGGREGATE SUM|MIN|MAX]
计算给定的一个或多个有序集的并集，其中给定key的数量必须以numkeys参数指定，并将该并集(结果集)储存到destination。
``` 
39.100.196.99:6379> ZUNIONSTORE group4  2 group1 group2
(integer) 6
39.100.196.99:6379> zrange group4 0 -1 withscores
 1) "a"
 2) "10"
 3) "x"
 4) "10"
 5) "b"
 6) "20"
 7) "y"
 8) "20"
 9) "z"
10) "30"
11) "c"
12) "50"
```
