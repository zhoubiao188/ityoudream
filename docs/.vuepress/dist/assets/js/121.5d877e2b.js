(window.webpackJsonp=window.webpackJsonp||[]).push([[121],{565:function(s,e,a){"use strict";a.r(e);var n=a(21),t=Object(n.a)({},(function(){var s=this,e=s.$createElement,a=s._self._c||e;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h1",{attrs:{id:"redis常用命令入门"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#redis常用命令入门"}},[s._v("#")]),s._v(" redis常用命令入门")]),s._v(" "),a("h1",{attrs:{id:"有三种类型-字符串-整数-浮点。"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#有三种类型-字符串-整数-浮点。"}},[s._v("#")]),s._v(" 有三种类型：字符串，整数，浮点。")]),s._v(" "),a("p",[s._v('例子：把java对象转换为json，然后作为字符串存储\n\'{"id":1,"username":"jswzj","password":"123456","sex":1}\'')]),s._v(" "),a("h1",{attrs:{id:"客户端连接服务器"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#客户端连接服务器"}},[s._v("#")]),s._v(" 客户端连接服务器")]),s._v(" "),a("p",[s._v("./redis-cli -h {host} -p {port} 方式连接，然后所有的操作都是在交互的方式实现")]),s._v(" "),a("h2",{attrs:{id:"set"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#set"}},[s._v("#")]),s._v(" SET")]),s._v(" "),a("p",[s._v("语法： SET key value [NX] [XX] [EX seconds] [PX [millseconds]] 设置一对key value\n必选参数说明"),a("br"),s._v("\nSET：命令\nkey：待设置的key\nvalue: 设置的key的value")]),s._v(" "),a("p",[s._v("可选参数说明"),a("br"),s._v("\nNX：表示key不存在才设置，如果存在则返回NULL\nXX：表示key存在时才设置，如果不存在则返回NULL\nEX seconds：设置过期时间，过期时间精确为秒\nPX millsecond：设置过期时间，过期时间精确为毫秒")]),s._v(" "),a("p",[s._v("SET：命令")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> set user1 \'{"id":1,"username":"jswzj","password":"123456","sex":1}\'\nOK\n127.0.0.1:6379> get user1\n"{\\"id\\":1,\\"username\\":\\"jswzj\\",\\"password\\":\\"123456\\",\\"sex\\":1}"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[s._v("NX：表示key不存在才设置，如果存在则返回NULL")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> set user1 \'{"id":1,"username":"jswzj","password":"123456","sex":1}\' NX\n(nil)\n因为user1已经存在，所以设置失败，返回nil\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br")])]),a("p",[s._v("XX：表示key存在时才设置，如果不存在则返回NULL")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> set user1 \'{"id":2,"username":"jswzj","password":"123456","sex":1}\' XX\nOK\n127.0.0.1:6379> get user1\n"{\\"id\\":2,\\"username\\":\\"jswzj\\",\\"password\\":\\"123456\\",\\"sex\\":1}"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[s._v("EX seconds：设置过期时间，过期时间精确为秒\n采用ttl查看剩余过期时间")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> set user1 \'{"id":2,"username":"jswzj","password":"123456","sex":1}\' EX 600\nOK\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("p",[s._v("PX millsecond：设置过期时间，过期时间精确为毫秒")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> set user1 \'{"id":2,"username":"jswzj","password":"123456","sex":1}\' PX 600000\nOK\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br")])]),a("h2",{attrs:{id:"setnx"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#setnx"}},[s._v("#")]),s._v(" SETNX")]),s._v(" "),a("p",[s._v("语法：SETNX key value\n所有参数为必选参数,设置一对key value，如果key存在，则设置失败，等同于 SET key value NX\n##SETEX\n语法：SETEX key expire value\n所有参数为必选参数，设置一对 key value，并设过期时间,单位为秒，等同于 SET key value EX expire\n##PSETEX\n语法：PSETEX key expire value\n所有参数为必选参数，设置一对 key value，并设过期时间,单位为毫秒，等同于 SET key value PX expire")]),s._v(" "),a("h2",{attrs:{id:"mset"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mset"}},[s._v("#")]),s._v(" MSET")]),s._v(" "),a("p",[s._v("作用：批量设值\n语法：MSET key1 value1 [key2 value2 key3 value3 ...]\n所有参数为必选，key、value对至少为一对。该命令功能是设置多对key-value值。")]),s._v(" "),a("h2",{attrs:{id:"mget"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#mget"}},[s._v("#")]),s._v(" MGET")]),s._v(" "),a("p",[s._v("作用：批量取值\n语法：MGET key1 [key2 key3 ...]\n所有参数为必选，key值至少为一个，获取多个key的value值，key值存的返回对应的value，不存在的返回NULL")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> mset k1 v1 k2 v2 k3 v3\nOK\n127.0.0.1:6379> mget k1 k2 k3\n1) "v1"\n2) "v2"\n3) "v3"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])]),a("h2",{attrs:{id:"getset"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getset"}},[s._v("#")]),s._v(" GETSET")]),s._v(" "),a("p",[s._v("作用：先查key出value的值，然后再修改新值\n语法：GETSET key value\n所有参数为必选参数，获取指定key的value，并设置key的值为新值value")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> getset user1 jswzj\n"{\\"id\\":2,\\"username\\":\\"jswzj\\",\\"password\\":\\"123456\\",\\"sex\\":1}"\n127.0.0.1:6379> get user1\n"jswzj"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("h2",{attrs:{id:"setrange"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#setrange"}},[s._v("#")]),s._v(" SETRANGE")]),s._v(" "),a("p",[s._v("作用：为某个key，修改偏移量offset后的值为value\n语法：SETRANGE key offset value\n所有参数为必选参数，设置指定key，偏移量offset后的值为value，影响范围为value的长度， offset不能小于0")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> set user 123456\nOK\n127.0.0.1:6379> setrange user 2 agan\n(integer) 6\n127.0.0.1:6379> get user\n"12agan"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])]),a("h2",{attrs:{id:"getrange"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#getrange"}},[s._v("#")]),s._v(" GETRANGE")]),s._v(" "),a("p",[s._v("作用：截取字符串\n语法：GETRANGE key start end\n所有参数为必选参数，获取指定key指定区间的value值,\nstart、end可以为负数，如果为负数则反向取区间")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> get user\n"12agan"\n127.0.0.1:6379> getrange user 1 3\n"2ag"\n127.0.0.1:6379> getrange user 0 3\n"12ag"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])]),a("h2",{attrs:{id:"append"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#append"}},[s._v("#")]),s._v(" APPEND")]),s._v(" "),a("p",[s._v("作用：字符串拼接\n语法：APPEND key str")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> set user 123\nOK\n127.0.0.1:6379> append user abc\n(integer) 6\n127.0.0.1:6379> get user\n"123abc"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])]),a("h2",{attrs:{id:"substr"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#substr"}},[s._v("#")]),s._v(" SUBSTR")]),s._v(" "),a("p",[s._v("作用：字符串截取\n语法：SUBSTR key str")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> get user\n"123abc"\n127.0.0.1:6379> substr user 0 3\n"123a"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("p",[s._v("#数字操作")]),s._v(" "),a("h2",{attrs:{id:"incr"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#incr"}},[s._v("#")]),s._v(" INCR")]),s._v(" "),a("p",[s._v("作用：计数器\n语法： INCR key\n所有参数为必选，指定key做加1操作。指定key对应的值必须为整型，否则返回错误,操作成功后返回操作后的值")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> incr product01\n(integer) 1\n127.0.0.1:6379> get product01\n"1"\n127.0.0.1:6379> incr product01\n(integer) 2\n127.0.0.1:6379> incr product01\n(integer) 3\n127.0.0.1:6379> get product01\n"3"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br"),a("span",{staticClass:"line-number"},[s._v("9")]),a("br"),a("span",{staticClass:"line-number"},[s._v("10")]),a("br")])]),a("h2",{attrs:{id:"decr"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#decr"}},[s._v("#")]),s._v(" DECR")]),s._v(" "),a("p",[s._v("语法： DECR key\n所有参数为必选，指定key做减1操作。指定key对应的值必须为整型，否则返回错误,操作成功后返回操作后的值。为DECR的逆操作。")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> get product01\n"3"\n127.0.0.1:6379> decr product01\n(integer) 2\n127.0.0.1:6379> decr product01\n(integer) 1\n127.0.0.1:6379> get product01\n"1"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br")])]),a("h2",{attrs:{id:"incrby"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#incrby"}},[s._v("#")]),s._v(" INCRBY")]),s._v(" "),a("p",[s._v("作用：加法\n语法：INCRBY key data\n所有参数为必选参数，指定key做加data操作,指定key对应的值和data必须为整型，否则返回错误,操作成功后返回操作后的值")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> set product01 100\nOK\n127.0.0.1:6379> get product01\n"100"\n127.0.0.1:6379> incrby product01 20\n(integer) 120\n127.0.0.1:6379> get product01\n"120"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br"),a("span",{staticClass:"line-number"},[s._v("8")]),a("br")])]),a("h2",{attrs:{id:"decrby"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#decrby"}},[s._v("#")]),s._v(" DECRBY")]),s._v(" "),a("p",[s._v("作用：减法\n语法：DECRBY key data\n所有参数为必选参数，指定key做减data操作,指定key对应的值和data必须为整型，否则返回错误,操作成功后返回操作后的值")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> get product01\n"120"\n127.0.0.1:6379> decrby product01 30\n(integer) 90\n127.0.0.1:6379> get product01\n"90"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])]),a("h3",{attrs:{id:"incrbyflout-key-num"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#incrbyflout-key-num"}},[s._v("#")]),s._v(" INCRBYFLOUT KEY NUM")]),s._v(" "),a("p",[s._v("在原有的key上加上浮点数")]),s._v(" "),a("div",{staticClass:"language- line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[s._v('127.0.0.1:6379> set money 10.5\nOK\n127.0.0.1:6379> incrbyfloat money 2.2\n"12.7"\n')])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])])])}),[],!1,null,null,null);e.default=t.exports}}]);