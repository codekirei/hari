'use strict'

describe 'buildCmdFn', ->

  beforeEach -> sinon.stub child, 'spawn'
  afterEach -> child.spawn.restore()

  perms =
    [ { text: 'no args', cmd: ['test'] }
    , { text: 'args', cmd: ['test', ['--foo', '--bar']] }
    ]

  test = (perm) ->
    it perm.text, ->
      cmd = perm.cmd
      utils.buildCmdFn(cmd)()
      actual = child.spawn.args[0]
      expected = cmd.concat stdio: 'inherit'
      assert.deepEqual actual, expected

  test perm for perm in perms
