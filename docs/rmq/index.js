module.exports = () => {
    return [
      '',
      {
        title: "RabbitMQ入门",
        collapsable: true,
        children: [
            'rmq-what.md',
            'rmq-01-install.md',
            'rmq-02-install.md',
            'rmq-03-quick-start.md',
            'rmq-04-connection.md',
            'rmq-05-direct.md',
            'rmq-06-topic.md',
            'rmq-07.fanout.md',
            'rmq-08-durable.md'
        ]
      }
    ]
  }