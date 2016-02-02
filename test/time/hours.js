/* global
 , assert
 , time
 */

'use strict'

module.exports =
  describe('hours', () => {
    it('> 12', () =>
      assert.equal(
        time.hours(14)
        , 2)
      )
    it('<= 12', () =>
      assert.equal(time.hours(12), 12))
  })
