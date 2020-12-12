### mongodb基本操作
#### CRUD操作
##### insert操作
格式：
```javascript
db.<集合名称>.insertOne(<JSON对象>)
db.<集合名称>.insertMany([<JSON对象1>, <JSON对象2>,...<JSON对象N>])
```
注意的是`insertOne`每次只能插入一条数据，而`insertMany`每次可以插入一条或者多条数据

示例：
```javascript
db.girl.insertOne({name: '小蕾'})
db.girl.insertMany([
    {name: '小林'},
    {name: '小雪'},
    {name: '小爱',age: 20}
])
```

#### 使用find查询
##### 什么是find
find是mongodb中查询数据的基本指令，类似于关系型数据库的select
find返回的是游标

##### find示例
```javascript
db.girl.find({name: '小林'}) //单条件查询
db.girl.find({name: '小爱',age: 20})//多条件and查询
db.girl.find({$and:[{name: '小爱'},{age: 20}]}) //and的另一种形式
db.girl.find({$or:[{name: '小林'},{age: 20}]})//多条件or查询
db.girl.find({name: /^林/})//正则查询
```
#### 查询条件对照表
| SQL  | MQL  |
|  ----  | ---- |
| a = 1  | {a: 1} |
| a <> 1  | {a: {$ne: 1}} |
| a > 1  | {a: {$gt: 1}} |
| a >= 1  | {a: {$gte: 1}} |
| a < 1  | {a: {$lt: 1}} |
| a <= 1  | {a: {$lte: 1}} |

#### 查询逻辑对照表
| SQL  | MQL  |
|  ----  | ---- |
| a = 1 and b = 1  | {a: 1, b: 1} 或 {$and:[{a: 1}, {b: 1}]} |
| a = 1 or b = 1  | {$or:[{a: 1}, {b: 1}]} |
| a is null  | {a: {$exists: false}} |
| a IN (1, 2, 3)  | {a: {$in: [1, 2, 3]}} |

#### 查询逻辑运算符
```javascript
$lt: 存在并小于
$lte: 存在并小于等于
$gt: 存在并大于
$gte: 存在并大于等于
$ne: 不存在或存在但不等于
$in: 存在并在指定数组中
$nin: 不存在或不在指定数组中
$or: 匹配两个或多个条件中的一个
$and: 匹配全部条件
```

#### 使用 find 搜索子文档
find 支持使用`field.sub_field`的形式查询子文档。假设有一个文档
```javascript
db.girl.insertOne({
    name: '小秋',
    love: {
      person: 'i',
      city: 'chengdou'
    }
})
```

使用子查询
```javascript
db.girl.find( { "love.person" : "i" } )
```
首先`love`是最外层的名称，person是`love`的儿子字段名称，这就是子查询

##### 使用 find 搜索数组
find 支持对数组中的元素进行搜索。假设有一个文档：
```javascript
db.girl.insert([
{name: '小张', hobby: ['打游戏','唱歌']},
{name: '小惠', hobby: ['蹦迪','喝酒']}
])
```
下面的查询有什么不同：
```javascript
db.girl.find({hobby: '蹦迪'})//单条件查询
db.girl.find({$or:[{hobby: '蹦迪'},{hobby: '唱歌'}]})//多条件查询或
```
##### 使用 find 搜索数组中的对象
find 支持搜索数组中的对象，假设有一个文档：













