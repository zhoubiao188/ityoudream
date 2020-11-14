module.exports = () => {
    return [
      '',
      {
        title: "lambda编程",
        collapsable: true,
        children: [
            'lambda/Thread.md',
            'lambda/SampleFormat.md',
            'lambda/Min.md',
            'lambda/Lazy.md',
            'lambda/FunctionInterface.md',
            'lambda/Function2.md',
            'lambda/Function',
            'lambda/Curry.md',
            'lambda/Core.md'
        ]
      },
      {
        title: "Stream流编程",
        collapsable: true,
        children: [
          'stream/Collect.md',
          'stream/Stream1.md',
          'stream/Stream2.md',
          'stream/Stream3.md',
          'stream/Stream4.md'
        ]
      }
    ]
  }