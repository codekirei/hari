/* global
 , Hari
 , assert
 , clock
 , sinon
 , time
 */

'use strict'

module.exports =
  describe('bindTimes', () => {
    before(() => clock.freeze())
    after(() => clock.restore())

    it('bind to props', () => {
      const hari = new Hari()
      const now = new Date()
      assert.equal(hari.startTime, void 0)
      assert.equal(hari.timestamp, void 0)
      hari.bindTimes(now)
      assert.equal(hari.startTime, time.fromOb(now))
      assert.equal(hari.timestamp, now.valueOf())
    })
  })
