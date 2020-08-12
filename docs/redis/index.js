module.exports = () => {
    return [
      '',
      {
        title: "Redis之String部分",
        collapsable: true,
        children: [
          'redis-string/01-aboutRedis.md',
          'redis-string/02-redis-string入门.md',
          'redis-string/03-redis-string-mybatis.md',
          'redis-string/04-redis-string-serializable.md',
          'redis-string/05-redis-mybatis-cache.md',
          'redis-string/06-redis-string-pv.md',
          'redis-string/07-redis-string-id.md',
          'redis-string/08-redis-string-lua.md',
          'redis-string/09-redis-string-lua.md',
          'redis-string/10-redis-string-lua.md'
        ]
      },
      {
      title: "Redis之Hash部分",
      collapsable: true,
      children: [
        'redis-hash/01-aboutHash.md',
        'redis-hash/02-hash-quickstart.md',
        'redis-hash/03-taobao-shorturl.md',
        'redis-hash/04-hash-shorturl-boot.md',
        'redis-hash/05-hash-shoppingcard.md',
        'redis-hash/06-hash-concurrent-shoppingcard.md',
        'redis-hash/07-hash-session.md',
        'redis-hash/08-hash-login-manger.md',
        'redis-hash/redis-hash-nginx-session.md',
        'redis-hash/redis-hash-nginx-session-request.md',
        'redis-hash/redis-hash-session-source.md',
        'redis-hash/09-hash-webo-send.md',
        'redis-hash/redis-hash-webo-register.md'
      ]
      },
      {
        title: "Redis之Set部分",
        collapsable: true,
        children: [
          'redis-set/01-aboutSet.md',
          'redis-set/02.set-quickstart.md',
          'redis-set/03-set-taobao-blacklist.md',
          'redis-set/04-set-jd-choujiang.md',
          'redis-set/05-set-alipay-taobao.md',
          'redis-set/06-set-webo-guanzhu.md',
          'redis-set/07-set-webo-start.md',
          'redis-set/08-redis-hyper.md',
          'redis-set/09-redis-set-current.md'
        ]
        },
        {
          title: "Redis之List部分",
          collapsable: true,
          children: [
            'redis-list/01-about-redis-list.md'
          ]
          }
    ]
  }