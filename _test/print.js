/* global
 * Emitter
 , assert
 , sinon
 , Hari
 , utils
 */

'use strict'

module.exports = describe('print', () => {
  let hari
    , killed
    , write

  before(() => {
    hari = new Hari()
    hari.cmd = () => new Emitter()
    hari.subP =
      { exitCode: null
      , kill: () => killed = true
      }
    sinon.stub(hari, 'ansi')
    sinon.stub(utils, 'header').returns('')
    write = sinon.stub(process.stdout, 'write')
    hari.print()
    process.stdout.write.restore()
  })

  after(() => {
    hari.ansi.restore()
    utils.header.restore()
  })

  it('increment runs prop', () => assert.equal(hari.runs, 1))

  it('kill subprocess', () => assert.isTrue(killed))

  it('clear terminal', () =>
    assert.isTrue(hari.ansi.calledWith(['2J', 'H']))
  )

  it('log header', () => {
    assert.isTrue(write.called)
    assert.isTrue(
      utils.header.calledWith(
        hari.startTime
        , hari.timestamp
        , hari.runs
      )
    )
  })

  it('assign subprocess', () => assert.isTrue(hari.subP instanceof Emitter))
})
