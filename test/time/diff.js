/* global
 , assert
 , clock
 , sinon
 , time
 */

'use strict'

module.exports =
  describe('diff', () => {
    it('call time.fromMs with correct param', () => {
      sinon.spy(time, 'fromMs')
      const from = new Date()
      clock.tick(100)
      const to = new Date()

      time.diff(from, to)
      assert.isTrue(time.fromMs.calledWith(to - from))

      time.fromMs.restore()
    })
  })
