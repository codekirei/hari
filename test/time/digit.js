/* global
 , assert
 , time
 */

'use strict'

module.exports =
  describe('digit', () => {
    it('prepend', () =>
       assert.equal(time.digit(1), '01'))
    it('noop', () =>
      assert.equal(time.digit(10), 10))
  })
