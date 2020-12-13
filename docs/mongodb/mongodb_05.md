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
```javascript
db.girl.insertOne({
 group: '女神',
 persons: [
   {name: '小林', age: 20, hobby: '打游戏'},
   {name: '小晴', age: 22, hobby: '吃美食'},
   {name: '小爱', age: 21, hobby: '男人'}
 ]
})
```

查找名称是小爱的记录
```javascript
db.girl.find({'persons.name': '小爱'})
```

##### 使用 find 搜索数组中的对象
在数组中搜索子对象的多个字段时，如果使用 $elemMatch，它表示必须是同一个
子对象满足多个条件。考虑以下两个查询：

```javascript
db.getCollection('girl').find({
    'persons.name': '小林',
    'persons.hobby': '吃美食'
})

db.getCollection('girl').find({
    'persons': {
      $elemMatch: {'name': '小林', 'hobby': '吃美食'}
    }
})
```

##### 控制 find 返回的字段
find 可以指定只返回指定的字段；
_id字段必须明确指明不返回，否则默认返回；
在 MongoDB 中我们称这为投影（projection）；
db.girl.find({},{"_id":0, name:'小晴'})"
'_id': 0 不返回_id
name: '小晴' 只返回name字段

#### 使用 remove 删除文档
remove 命令需要配合查询条件使用；
匹配查询条件的的文档会被删除；
指定一个空文档条件会删除所有文档；

以下示例：
```javascript
db.girl.remove({name: '小林'}) //删除name等于小林的记录
db.girl.remove({age: ${$lt: 21}}) //删age小于21的记录
db.girl.remove({}) //删除所有记录
db.girl.remove()//报错
```

#### 使用 update 更新文档
Update 操作执行格式：db.<集合>.update(<查询条件>, <更新字段>)

```javascript
db.shop.insertMany([
{name: "apple"},
{name: "pear"},
{name: "orange"}
])//先插入一些数据

db.girl.updateOne({name: 'apple'}, {$set: {name: 'iphone'}}) //将name为apple的修改为iphone
```

使用 `updateOne` 表示无论条件匹配多少条记录，始终只更新第一条；

使用 `updateMany` 表示条件匹配多少条就更新多少条；

`updateOne/updateMany` 方法要求更新条件部分必须具有以下之一，否则将报错：
```javascript
$set/$unset
$push/$pushAll/$pop
$pull/$pullAll
$addToSet
```

错误用法
```javascript
db.shop.updateOne({name: "apple"}, {name: "iphone"})//报错
```
方法要求更新条件部分必须具有以上条件关键字`$xxx`

#### 使用 update 更新数组
```javascript
$push: 增加一个对象到数组底部
$pushAll: 增加多个对象到数组底部
$pop: 从数组底部删除一个对象
$pull: 如果匹配指定的值，从数组中删除相应的对象
$pullAll: 如果匹配任意的值，从数据中删除相应的对象
$addToSet: 如果不存在则增加一个值到数组
```

#### 使用 drop 删除集合
使用 db.<集合>.drop() 来删除一个集合;
集合中的全部文档都会被删除;
集合相关的索引也会被删除;

```javascript
db.girl.drop()
```

#### 使用 dropDatabase 删除数据库
使用 db.dropDatabase() 来删除数据库;
数据库相应文件也会被删除，磁盘空间将被释放;
```javascript
use study
db.dropDatabase()
show collections //  No collections
show dbs // The db is gone
```

















