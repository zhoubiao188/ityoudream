#### 模型设计基础
#### 数据模型
```
什么是数据模型？
数据模型是一组由符号、文本组成的集合，用以准确表达信息，达到有效交流、沟通
的目的。
Steve Hoberman 霍伯曼. 数据建模经典教程
```

#### 数据模型设计的元素
##### 实体 Entity
```
 描述业务的主要数据集合
 谁，什么，何时，何地，为何，
如何
```
##### 属性 Attribute
描述实体里面的单个信息

##### 关系 Relationship
```
描述实体与实体之间的数据规则
结构规则：1-N， N-1, N-N
引用规则：电话号码不能单独存在
```

#### 数据模型设计的元素
##### 实体 Entity
```
描述业务的主要数据集合
谁，什么，何时，何地，为何，
如何
```
##### 属性 Attribute
```
描述实体里面的单个信息
```

##### 关系 Relationship
```
描述实体与实体之间的数据规则
结构规则：1-N， N-1, N-N
引用规则：电话号码不能单独存在
```

#### 数据模型设计的元素
##### 实体 Entity
```
描述业务的主要数据集合
谁，什么，何时，何地，为何，
如何
```
##### 属性 Attribute
```
描述实体里面的单个信息
```

##### 关系 Relationship
```
描述实体与实体之间的数据规则
结构规则：1-N， N-1, N-N
引用规则：电话号码不能单独存在
```

#### 数据模型设计的元素

##### 实体 Entity
```
描述业务的主要数据集合
谁，什么，何时，何地，为何，
如何
```

##### 属性 Attribute
```
描述实体里面的单个信息
```
##### 关系 Relationship
```
描述实体与实体之间的数据规则
结构规则：1-N， N-1, N-N
引用规则：电话号码不能单独存在
```

#### 传统模型设计：从概念到逻辑到物理

|  | 概念模型 CDM  | 逻辑模型 LDM | 物理模型 PDM |
|  ----  | ---- | ---- | ---- |
| 目的  | 描述业务系统要管理的对象 |  基于概念模型，详细列出 所有实体、实体的属性及关系 | 根据逻辑模型，结合数据库的物理结构，设计具体的表结构，字段列表及主外键 |
| 特点  | 用概念名词来描述现实中的实体及业务规则，如联系人 |基于业务的描述和数据库无关| 技术实现细节和具体的数据库类型相关 |
| 主要使用者  | 用户需求分析师 | 需求分析师架构师及开发者 | 开发者DBA |