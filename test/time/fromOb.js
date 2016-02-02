/* global
 , assert
 , time
 */

'use strict'

module.exports =
  describe('fromOb', () => {
    it('convert date object to H:M:S string', () =>
      assert.equal(
        time.fromOb(new Date())
        , '4:00:00')
      )
  })
