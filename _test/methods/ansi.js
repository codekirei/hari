'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
import test from 'ava'
import sinon from 'sinon'

// local
import Hari from '../../'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test('ansi', t => {
  // setup
  const ps = process.stdout
  sinon.stub(ps, 'write')
  const hari = new Hari()

  // param is str
  hari.ansi('H')
  t.true(ps.write.calledOnce)
  t.is(ps.write.firstCall.args[0], '\u001b[H')

  // param is ar
  hari.ansi(['2J', 'H'])
  t.true(ps.write.calledThrice)
  t.is(ps.write.secondCall.args[0], '\u001b[2J')
  t.is(ps.write.thirdCall.args[0], '\u001b[H')

  // teardown
  ps.write.restore()
})
