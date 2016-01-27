'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
import child from 'child_process'

// npm
import test from 'ava'
import sinon from 'sinon'
import billboard from 'multiline-billboard'

// local
import utils from '../lib/utils'

//----------------------------------------------------------
// tests
//----------------------------------------------------------

// header
//----------------------------------------------------------
test('header', t => {
  const clock = sinon.useFakeTimers()
  const date = new Date()
  const strs =
    [ 'First Run │ 4:00:00'
    , 'Last Run  │ 4:00:00'
    , 'Elapsed   │ 0:00:00'
    , 'Runs      │ 0'
    ]
  t.is(
    utils.header('4:00:00', Date.parse(date), 0)
    , billboard(strs, {justify: 'left'})
  )
  clock.restore()
})

// shift
//----------------------------------------------------------
test('shift', t => t.same(
  utils.shift(['a', 'b', 'c'])
  , ['a', ['b', 'c']]
))

// readJson
//----------------------------------------------------------

// buildCmdFn
//----------------------------------------------------------
test('buildCmdFn - no args', t => {
  // prep
  sinon.stub(child, 'spawn')
  const cmd = ['test']

  // test
  utils.buildCmdFn(cmd)()
  t.same(child.spawn.args[0], ['test', {stdio: 'inherit'}])

  // cleanup
  child.spawn.restore()
})

test('buildCmdFn - with args', t => {
  // prep
  sinon.stub(child, 'spawn')
  const cmd = ['test', ['--foo', '--bar']]

  // test
  utils.buildCmdFn(cmd)()
  t.same(child.spawn.args[0], cmd.concat({stdio: 'inherit'}))

  // cleanup
  child.spawn.restore()
})

// parseCmd
//----------------------------------------------------------
test('parseCmd', t => {
  // prep
  sinon.stub(child, 'spawn')
  const cmd = 'test --foo'

  // test
  utils.parseCmd(cmd)()
  t.same(child.spawn.args[0], ['test', ['--foo'], {stdio: 'inherit'}])

  // cleanup
  child.spawn.restore()
})
