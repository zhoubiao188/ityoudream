(window.webpackJsonp=window.webpackJsonp||[]).push([[138],{582:function(n,s,e){"use strict";e.r(s);var a=e(21),r=Object(a.a)({},(function(){var n=this,s=n.$createElement,e=n._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[e("h3",{attrs:{id:"删除死信消息"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#删除死信消息"}},[n._v("#")]),n._v(" 删除死信消息")]),n._v(" "),e("p",[n._v("如果某个消息，不能被消费者处理，也就是不能被XACK，这是要长时间处于Pending列表中，即使被反复的转移给各个消费者也是如此。\n此时该消息的delivery counter就会累加（上一节的例子可以看到），当累加到某个我们预设的临界值时，\n我们就认为是坏消息（也叫死信，DeadLetter，无法投递的消息），\n由于有了判定条件，我们将坏消息处理掉即可，删除即可。\n删除一个消息，使用XDEL语法.")]),n._v(" "),e("div",{staticClass:"language- line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[n._v('#查看已读未处理的消息明细\n39.100.196.99:6379> xpending ordermq ordergroup - + 10\n1) 1) "1588560150590-0"\n   2) "consumerA"\n   3) (integer) 1256545\n   4) (integer) 2\n2) 1) "1588560150590-1"\n   2) "consumer-score"\n   3) (integer) 2681964\n   4) (integer) 1\n   \n#查看队列 \n39.100.196.99:6379> xrange ordermq - +\n1) 1) "1588560150589-0"\n   2) 1) "orderno"\n      2) "10001"\n2) 1) "1588560150590-0"\n   2) 1) "orderno"\n      2) "10002"\n3) 1) "1588560150590-1"\n   2) 1) "orderno"\n      2) "10003"\n\n# 使用xdel删除队列的消息\n39.100.196.99:6379> xdel ordermq 1588560150590-0\n(integer) 1\n(0.87s)\n\n\n39.100.196.99:6379> xrange ordermq - +\n1) 1) "1588560150589-0"\n   2) 1) "orderno"\n      2) "10001"\n2) 1) "1588560150590-1"\n   2) 1) "orderno"\n      2) "10003"\n\n# 删除了队列后，居然未处理的消息居然还存在  \n39.100.196.99:6379> xpending ordermq ordergroup - + 10\n1) 1) "1588560150590-0"\n   2) "consumerA"\n   3) (integer) 1436364\n   4) (integer) 2\n2) 1) "1588560150590-1"\n   2) "consumer-score"\n   3) (integer) 2861783\n   4) (integer) 1\n#为了把未处理的消息列表，也删除，我们给他一个ack  \n39.100.196.99:6379> xack ordermq ordergroup 1588560150590-0\n(integer) 1\n#最终删除成功了\n39.100.196.99:6379> xpending ordermq ordergroup - + 10\n1) 1) "1588560150590-1"\n   2) "consumer-score"\n   3) (integer) 3000787\n   4) (integer) 1\n')])]),n._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[n._v("1")]),e("br"),e("span",{staticClass:"line-number"},[n._v("2")]),e("br"),e("span",{staticClass:"line-number"},[n._v("3")]),e("br"),e("span",{staticClass:"line-number"},[n._v("4")]),e("br"),e("span",{staticClass:"line-number"},[n._v("5")]),e("br"),e("span",{staticClass:"line-number"},[n._v("6")]),e("br"),e("span",{staticClass:"line-number"},[n._v("7")]),e("br"),e("span",{staticClass:"line-number"},[n._v("8")]),e("br"),e("span",{staticClass:"line-number"},[n._v("9")]),e("br"),e("span",{staticClass:"line-number"},[n._v("10")]),e("br"),e("span",{staticClass:"line-number"},[n._v("11")]),e("br"),e("span",{staticClass:"line-number"},[n._v("12")]),e("br"),e("span",{staticClass:"line-number"},[n._v("13")]),e("br"),e("span",{staticClass:"line-number"},[n._v("14")]),e("br"),e("span",{staticClass:"line-number"},[n._v("15")]),e("br"),e("span",{staticClass:"line-number"},[n._v("16")]),e("br"),e("span",{staticClass:"line-number"},[n._v("17")]),e("br"),e("span",{staticClass:"line-number"},[n._v("18")]),e("br"),e("span",{staticClass:"line-number"},[n._v("19")]),e("br"),e("span",{staticClass:"line-number"},[n._v("20")]),e("br"),e("span",{staticClass:"line-number"},[n._v("21")]),e("br"),e("span",{staticClass:"line-number"},[n._v("22")]),e("br"),e("span",{staticClass:"line-number"},[n._v("23")]),e("br"),e("span",{staticClass:"line-number"},[n._v("24")]),e("br"),e("span",{staticClass:"line-number"},[n._v("25")]),e("br"),e("span",{staticClass:"line-number"},[n._v("26")]),e("br"),e("span",{staticClass:"line-number"},[n._v("27")]),e("br"),e("span",{staticClass:"line-number"},[n._v("28")]),e("br"),e("span",{staticClass:"line-number"},[n._v("29")]),e("br"),e("span",{staticClass:"line-number"},[n._v("30")]),e("br"),e("span",{staticClass:"line-number"},[n._v("31")]),e("br"),e("span",{staticClass:"line-number"},[n._v("32")]),e("br"),e("span",{staticClass:"line-number"},[n._v("33")]),e("br"),e("span",{staticClass:"line-number"},[n._v("34")]),e("br"),e("span",{staticClass:"line-number"},[n._v("35")]),e("br"),e("span",{staticClass:"line-number"},[n._v("36")]),e("br"),e("span",{staticClass:"line-number"},[n._v("37")]),e("br"),e("span",{staticClass:"line-number"},[n._v("38")]),e("br"),e("span",{staticClass:"line-number"},[n._v("39")]),e("br"),e("span",{staticClass:"line-number"},[n._v("40")]),e("br"),e("span",{staticClass:"line-number"},[n._v("41")]),e("br"),e("span",{staticClass:"line-number"},[n._v("42")]),e("br"),e("span",{staticClass:"line-number"},[n._v("43")]),e("br"),e("span",{staticClass:"line-number"},[n._v("44")]),e("br"),e("span",{staticClass:"line-number"},[n._v("45")]),e("br"),e("span",{staticClass:"line-number"},[n._v("46")]),e("br"),e("span",{staticClass:"line-number"},[n._v("47")]),e("br"),e("span",{staticClass:"line-number"},[n._v("48")]),e("br"),e("span",{staticClass:"line-number"},[n._v("49")]),e("br"),e("span",{staticClass:"line-number"},[n._v("50")]),e("br"),e("span",{staticClass:"line-number"},[n._v("51")]),e("br"),e("span",{staticClass:"line-number"},[n._v("52")]),e("br"),e("span",{staticClass:"line-number"},[n._v("53")]),e("br"),e("span",{staticClass:"line-number"},[n._v("54")]),e("br"),e("span",{staticClass:"line-number"},[n._v("55")]),e("br"),e("span",{staticClass:"line-number"},[n._v("56")]),e("br")])])])}),[],!1,null,null,null);s.default=r.exports}}]);