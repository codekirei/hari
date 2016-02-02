/* global
 , assert
 , sinon
 , Hari
 */

'use strict'

module.exports = describe('constructor', () => {
  it('bind props', () => {
    const hari = new Hari()
    const pairs =
      [ [ hari.cmd, void 0 ]
      , [ hari.debounce, void 0 ]
      , [ hari.running, false ]
      , [ hari.runs, 0 ]
      , [ hari.startTime, void 0 ]
      , [ hari.subP, void 0 ]
      , [ hari.timestamp, void 0 ]
      ]
    pairs.map(pair => assert.equal(pair[0], pair[1]))
  })
})
