'use strict'

describe 'parseCmd', ->

  before -> sinon.stub child, 'spawn'
  after -> child.spawn.restore()

  it 'parse command and call buildCmdFn', ->
    utils.parseCmd('test --foo')()
    actual = child.spawn.args[0]
    expected = ['test', ['--foo'], stdio: 'inherit']
    assert.deepEqual actual, expected
