const RedisSidebarConfig = require('../redis/')
const RabbitMQConfig = require('../rmq/')
const ArithmeticConfig = require('../arithmetic/')
const SpringBootConfig = require('../springboot/')
const KafkaConfig = require('../kafka/')
const Java8Config = require('../java8/')
const mogodbConfig = require('../mongodb')
module.exports = {
  title: '技术无止境的笔记',
  description: 'jishu',
  plugins: {
    'sitemap': {
      hostname: 'http://ityoudream.cn'
    },
    'vuepress-plugin-baidu-autopush': true
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
          { text: 'MogoDB', link: '/mogodb/' }
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
          {text: 'Java8', link: '/java8/'},
          { text: 'SpringBoot', link: '/springboot/' },
          { text: 'SpringCloud', link: '/springcloud/' },
          { text: 'SpringCloud for AliBaBa', link: '/alibabaCloud/' },
          { text: 'WebFlux', link: '/webflux/' },
          { text: 'Docker', link: '/docker/' },
          { text: 'K8s', link: '/k8s/' }
        ]
      }
    ],
  sidebar: {
    '/redis/': RedisSidebarConfig(),
    '/rmq/': RabbitMQConfig(),
    '/arithmetic/': ArithmeticConfig(),
    '/springboot/': SpringBootConfig(),
    '/kafka/': KafkaConfig(),
    '/java8/':Java8Config(),
    '/mogodb/':mogodbConfig()
  },
  }
}
