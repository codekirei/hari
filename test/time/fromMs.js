/* global
 , assert
 , time
 */

'use strict'

module.exports =
  describe('fromMs', () => {
    it('convert ms count to H:M:S string', () => {
      const pairs =
        [ [ 77777777, '21:36:17' ]
        , [ 7777777, '2:09:37' ]
        , [ 777777, '0:12:57' ]
        , [ 77777, '0:01:17' ]
        , [ 7777, '0:00:07']
        ]
      pairs.map(pair =>
        assert.equal(time.fromMs(pair[0]), pair[1]))
    })
  })
