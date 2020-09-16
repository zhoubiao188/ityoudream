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
            'redis-list/01-about-redis-list.md',
            'redis-list/02-taobao-juhuasuan.md',
            'redis-list/03-redis-jichuan.md',
            'redis-list/04-redis-list-redpacket.md',
            'redis-list/05-redis-list-pv.md',
            'redis-list/06-redis-webo-push.md',
            'redis-list/07-redis-webo-youhua.md',
            'redis-list/docker-redis-fbs.md',
            'redis-list/redis-lock-about.md',
            'redis-list/redis-lock-waitTime.md',
            'redis-list/redis-setnx.md',
            'redis-list/redis-lock-cr.md',
            'redis-list/redis-lock-lua.md',
            'redis-list/redis-leaseTime.md',
            'redis-list/redis-lock-core.md',
            'redis-list/redis-lock-cfs.md',
            'redis-list/redis-lock-digui.md',
            'redis-list/redis-lock-fbs-crs.md'
          ]
          },
          {
            title: "Redis之Zset部分",
            collapsable: true,
            children: [
             'redis-zset/about-zset.md',
             'redis-zset/redis-webo-rank.md',
             'redis-zset/redis-geo-hotel.md',
             'redis-zset/redis-geo-hotel-coding.md',
             'redis-zset/redis-zset-live.md',
             'redis-zset/redis-im-01.md',
             'redis-zset/redis-bloom-filter.md',
             'redis-zset/redis-stream-mq-01.md'
            ]
            }
    ]
  }