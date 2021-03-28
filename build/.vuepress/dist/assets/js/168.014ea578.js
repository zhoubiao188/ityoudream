(window.webpackJsonp=window.webpackJsonp||[]).push([[168],{612:function(s,t,a){"use strict";a.r(t);var n=a(21),r=Object(n.a)({},(function(){var s=this,t=s.$createElement,a=s._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[a("h3",{attrs:{id:"一、本课程目标"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#一、本课程目标"}},[s._v("#")]),s._v(" 一、本课程目标：")]),s._v(" "),a("ol",[a("li",[s._v("如何使用Assert参数校验？")]),s._v(" "),a("li",[s._v("为什么用了Validator参数校验，还必须再用Assert参数校验？")])]),s._v(" "),a("h3",{attrs:{id:"二、什么是assert参数校验"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#二、什么是assert参数校验"}},[s._v("#")]),s._v(" 二、什么是Assert参数校验？")]),s._v(" "),a("p",[s._v('Assert翻译为中文为"断言".它是spring的一个util类，org.springframework.util.Assert\n一般用来断定某一个实际的值是否为自己预期想得到的,如果不一样就抛出异常.')]),s._v(" "),a("h3",{attrs:{id:"三、为什么用了validator参数校验-还必须再用assert参数校验"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#三、为什么用了validator参数校验-还必须再用assert参数校验"}},[s._v("#")]),s._v(" 三、为什么用了Validator参数校验，还必须再用Assert参数校验？")]),s._v(" "),a("p",[s._v("主要是2个原因："),a("br"),s._v("\n1.因为validator只解决了参数自身的数据校验，解决不了参数和业务数据之间校验。\n例如以下代码，validator是搞不定的")]),s._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("test1")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" userId"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("User")]),s._v(" user "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" userDao"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("selectById")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("userId"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("if")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("user "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("==")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("null")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("throw")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("new")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("IllegalArgumentException")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"用户不存在！"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])]),a("p",[s._v("2.采用Assert能使代码更优雅\n下以上代码可以转变为以下优雅代码")]),s._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("test2")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("int")]),s._v(" userId"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("User")]),s._v(" user "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" userDao"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("selectById")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("userId"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Assert")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("notNull")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("user"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"用户不存在！"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br")])]),a("h3",{attrs:{id:"四、案例实战-修改用户信息时-用assert校验用户是否存在"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#四、案例实战-修改用户信息时-用assert校验用户是否存在"}},[s._v("#")]),s._v(" 四、案例实战：修改用户信息时，用Assert校验用户是否存在？")]),s._v(" "),a("h4",{attrs:{id:"步骤1-校验用户是否存在"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#步骤1-校验用户是否存在"}},[s._v("#")]),s._v(" 步骤1：校验用户是否存在")]),s._v(" "),a("div",{staticClass:"language-java line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-java"}},[a("code",[s._v("    "),a("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[s._v("@PostMapping")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("value "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/user/update"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" produces "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" APPLICATION_JSON_UTF8_VALUE"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" consumes "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" APPLICATION_JSON_UTF8_VALUE"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("public")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("void")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("updateUser")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),a("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[s._v("@RequestBody")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token annotation punctuation"}},[s._v("@Validated")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("UserVO")]),s._v(" userVO"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("UserVO")]),s._v(" user "),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("null")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token comment"}},[s._v("//user = userDao.selectById(userId);")]),s._v("\n        "),a("span",{pre:!0,attrs:{class:"token class-name"}},[s._v("Assert")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[s._v("notNull")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("(")]),s._v("user"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"用户不存在！"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(";")]),s._v("\n    "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br")])]),a("h4",{attrs:{id:"测试结果"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#测试结果"}},[s._v("#")]),s._v(" 测试结果：")]),s._v(" "),a("div",{staticClass:"language-json line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"timestamp"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"2019-10-03T07:40:29.416+0000"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"status"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("500")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"error"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Internal Server Error"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"message"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"用户不存在！"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"path"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/user/user/update"')]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br")])]),a("p",[s._v("从以上测试结果可以知道：")]),s._v(" "),a("ol",[a("li",[s._v("参数校验，一般都是validator和assert 一起结合使用的，validator只解决了参数自身的数据校验，解决不了参数和业务数据之间校验。")]),s._v(" "),a("li",[s._v("从测试结果看，assert抛出异常是一个json，这个json 不是我们想要的，所以必须和《全局异常处理器》一起使用封装。")])]),s._v(" "),a("h3",{attrs:{id:"五、常用的assert场景"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#五、常用的assert场景"}},[s._v("#")]),s._v(" 五、常用的Assert场景")]),s._v(" "),a("ul",[a("li",[s._v("逻辑断言")])]),s._v(" "),a("ol",[a("li",[s._v("isTrue()\n"),a("br"),s._v("如果条件为假抛出IllegalArgumentException 异常。")]),s._v(" "),a("li",[s._v("state()\n"),a("br"),s._v("该方法与isTrue一样，但抛出IllegalStateException异常。")])]),s._v(" "),a("ul",[a("li",[s._v("对象和类型断言")])]),s._v(" "),a("ol",[a("li",[s._v("notNull()\n"),a("br"),s._v("通过notNull()方法可以假设对象不null：")]),s._v(" "),a("li",[s._v("isNull()\n"),a("br"),s._v("用来检查对象为null:")]),s._v(" "),a("li",[s._v("isInstanceOf()\n"),a("br"),s._v("使用isInstanceOf()方法检查对象必须为另一个特定类型的实例")]),s._v(" "),a("li",[s._v("isAssignable()\n"),a("br"),s._v("使用Assert.isAssignable()方法检查类型")])]),s._v(" "),a("ul",[a("li",[s._v("文本断言")])]),s._v(" "),a("ol",[a("li",[s._v("hasLength()\n"),a("br"),s._v("如果检查字符串不是空符串，意味着至少包含一个空白，可以使用hasLength()方法。")]),s._v(" "),a("li",[s._v("hasText()\n"),a("br"),s._v("我们能增强检查条件，字符串至少包含一个非空白字符，可以使用hasText()方法。")]),s._v(" "),a("li",[s._v("doesNotContain()\n"),a("br"),s._v("我们能通过doesNotContain()方法检查参数不包含特定子串。")])]),s._v(" "),a("ul",[a("li",[s._v("Collection和map断言")])]),s._v(" "),a("ol",[a("li",[s._v("Collection应用notEmpty()\n"),a("br"),s._v("如其名称所示，notEmpty()方法断言collection不空，意味着不是null并包含至少一个元素。")]),s._v(" "),a("li",[s._v("map应用notEmpty()\n"),a("br"),s._v("同样的方法重载用于map，检查map不null，并至少包含一个entry（key，value键值对）。")])]),s._v(" "),a("ul",[a("li",[s._v("数组断言")])]),s._v(" "),a("ol",[a("li",[s._v("notEmpty()\n"),a("br"),s._v("notEmpty()方法可以检查数组不null，且至少包括一个元素：")]),s._v(" "),a("li",[s._v("noNullElements()\n"),a("br"),s._v("noNullElements()方法确保数组不包含null元素：")])]),s._v(" "),a("h3",{attrs:{id:"五、案例实战-把assert异常加入《全局异常处理器》"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#五、案例实战-把assert异常加入《全局异常处理器》"}},[s._v("#")]),s._v(" 五、案例实战：把Assert异常加入《全局异常处理器》")]),s._v(" "),a("p",[s._v("为什么要加？\n因为assert的异常结构如下：")]),s._v(" "),a("div",{staticClass:"language-json line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"timestamp"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"2019-10-03T07:40:29.416+0000"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"status"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("500")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"error"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"Internal Server Error"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"message"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"用户不存在！"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"path"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"/user/user/update"')]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br"),a("span",{staticClass:"line-number"},[s._v("6")]),a("br"),a("span",{staticClass:"line-number"},[s._v("7")]),a("br")])]),a("p",[s._v("这种异常一般是不允许和客户端联调的！！必须加入加入《全局异常处理器》")]),s._v(" "),a("p",[s._v("执行结果：")]),s._v(" "),a("div",{staticClass:"language-json line-numbers-mode"},[a("pre",{pre:!0,attrs:{class:"language-json"}},[a("code",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"status"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token number"}},[s._v("4000")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"desc"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[s._v('"用户不存在！"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v(",")]),s._v("\n  "),a("span",{pre:!0,attrs:{class:"token property"}},[s._v('"data"')]),a("span",{pre:!0,attrs:{class:"token operator"}},[s._v(":")]),s._v(" "),a("span",{pre:!0,attrs:{class:"token null keyword"}},[s._v("null")]),s._v("\n"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n")])]),s._v(" "),a("div",{staticClass:"line-numbers-wrapper"},[a("span",{staticClass:"line-number"},[s._v("1")]),a("br"),a("span",{staticClass:"line-number"},[s._v("2")]),a("br"),a("span",{staticClass:"line-number"},[s._v("3")]),a("br"),a("span",{staticClass:"line-number"},[s._v("4")]),a("br"),a("span",{staticClass:"line-number"},[s._v("5")]),a("br")])])])}),[],!1,null,null,null);t.default=r.exports}}]);