const RedisSidebarConfig = require('../redis/')
const RabbitMQConfig = require('../rmq/')
const ArithmeticConfig = require('../arithmetic/')
const SpringBootConfig = require('../springboot/')
const KafkaConfig = require('../kafka/')
const Java8Config = require('../java8/')
const JavaProcess = require('../process/')
const mogodbConfig = require('../mongodb/')
const JdkConfig = require('../jdk/')
const DubboConfig = require('../dubbo/')
module.exports = {
    // dest: 'build/.vuepress/dist',  // 目录配置在外,纯粹是有代码洁癖和强迫症，并不能规避开发模式下同时构建不报错的问题
  host: 'localhost', // dev 的域名
  port: 8080,
  title: '技术无止境的笔记',
  description: '用来记录工作和学习过程中的笔记，汇总成册方便查阅，类容涵盖各类技术，如：Java、Redis、MongoDB、SpringBoot、SpringCloud、Dubbo等',
  plugins: {
    'sitemap': {
      hostname: 'http://ityoudream.cn'
    },
    //top插件
    '@vuepress/back-to-top': true,
    //复制代码
    'vuepress-plugin-code-copy': true,
    //图片缩放
    '@vuepress/medium-zoom':{
      selector: '.theme-default-content img'
    },
    'vuepress-plugin-baidu-autopush': true,
  },
  head: [
    ['link', { rel: 'shortcut icon', type: "image/x-icon", href: "/public/favicon.ico" }]
],
  //静态资源相对路径配置
  //配置显示行号
  markdown: {
    lineNumbers: true
  },
  // 导航栏配置
  themeConfig: {
    docsDir: 'docs',
    sidebar: 'auto',
    sidebarDepth: 3,
    lastUpdated: '上次更新',
    repo: '',
    repoLabel: 'GitHub',
    docsDir: 'docs',
    editLinks: true,
    editLinkText: '帮助我们改善此页面！',
     // 主题级别的配置
        serviceWorker: {
            updatePopup: true // Boolean | Object, 默认值是 undefined.
            // 如果设置为 true, 默认的文本配置将是:
            // updatePopup: {
            //    message: "New content is available.",
            //    buttonText: "Refresh"
            // }
        },
    nav: [
      { text: 'Home', link: '/' },
      {
        text: 'NoSQL',
        ariaLabel: 'NoSQL Menu',
        items: [
          { text: 'Redis', link: '/redis/' },
          { text: 'MogoDB', link: '/mongodb/' }
        ]
      },
      {
        text: 'Nginx', link: '/nginx/'
      },
      {
        text: 'RabbitMQ',
        ariaLabel: 'Queue',
        items: [
          { text: 'RabbitMQ', link: '/rmq/'},
          { text: 'KaFka', link: '/kafka/'}
        ]
      },
      {
        text: '数据结构与算法', link: '/arithmetic/'
      },
      {
        text: '大数据',
        ariaLabel: 'BigData Menu',
        items: [
          { text: 'Flink', link: '/flink/' },
          { text: 'ElasticSearch', link: '/es/' },
          { text: 'spark', link: '/spark/' },
          { text: 'hadoop', link: '/hadoop/' }
        ]
      },
      {
        text: 'Java编程',
        ariaLabel: 'Java',
        items: [
          {text: 'Java多线程', link: '/process/'},
          {text: 'Java8', link: '/java8/'},
          {text: 'JDK核心源码', link: '/jdk/'},
          { text: 'SpringBoot', link: '/springboot/' },
          { text: 'SpringCloud', link: '/springcloud/' },
          { text: 'Dubbo入门到源码分析', link: '/dubbo/' },
          { text: 'WebFlux', link: '/webflux/' },
          { text: 'Docker', link: '/docker/' },
          { text: 'K8s', link: '/k8s/' }
        ]
      },
      {
        text: 'Github', link: 'https://github.com/zhoubiao188'
      },
    ],
  sidebar: {
    '/redis/': RedisSidebarConfig(),
    '/rmq/': RabbitMQConfig(),
    '/arithmetic/': ArithmeticConfig(),
    '/springboot/': SpringBootConfig(),
    '/kafka/': KafkaConfig(),
    '/java8/':Java8Config(),
    '/jdk/':JdkConfig(),
    '/mongodb/':mogodbConfig(),
    '/dubbo/':DubboConfig(),
    '/process/':JavaProcess()
  },
  }
}


