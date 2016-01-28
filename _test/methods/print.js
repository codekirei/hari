'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
import Emitter from 'events'

// npm
import test from 'ava'
import sinon from 'sinon'

// local
import Hari from '../../'
import util from '../../lib/utils'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test.before('stub console.log', t => sinon.stub(console, 'log'))

test.beforeEach('assign context', t => {
  t.context.hari = new Hari()
  t.context.hari.cmd = () => new Emitter()
  sinon.stub(t.context.hari, 'ansi')
})

test.afterEach('restore hari.ansi', t => t.context.hari.ansi.restore())

test.after('restore console.log', t => console.log.restore())

test('increment runs', t => {
  const hari = t.context.hari
  t.is(hari.runs, 0)
  hari.print()
  t.is(hari.runs, 1)
})

test('kill subprocess', t => {
  const hari = t.context.hari
  let killed = false
  hari.subP =
    { exitCode: null
    , kill: () => killed = true
    }
  hari.print()
  t.true(killed)
})

test('clear terminal', t => {
  const hari = t.context.hari
  hari.print()
  t.true(hari.ansi.calledOnce)
  t.same(hari.ansi.args[0][0], ['2J', 'H'])
})

test('log header', t => {
  const hari = t.context.hari
  hari.print()
  t.true(console.log.called)
  t.true(console.log.calledWith(
    util.header(
      hari.startTime
      , hari.timestamp
      , hari.runs
    )
  ))
})

test('assign subprocess', t => {
  const hari = t.context.hari
  t.notOk(hari.subP)
  hari.print()
  t.ok(hari.subP)
})
