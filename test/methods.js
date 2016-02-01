describe('methods', () => {
  [ 'ansi'
  , 'bindTimes'
  , 'constructor'
  , 'init'
  , 'print'
  ].map(method => require(`./methods/${method}`))
})
