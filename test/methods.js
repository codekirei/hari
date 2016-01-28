describe('methods', () => {
  [ 'ansi'
  , 'bindTimes'
  , 'constructor'
  , 'print'
  ].map(method => require(`./methods/${method}`))
})
