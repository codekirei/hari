'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const EOL = require('os').EOL

// node
const child = require('child_process')

// npm
const assert = require('chai').assert
const sinon = require('sinon')
const billboard = require('multiline-billboard')
const mock = require('mock-fs')

// local
const utils = require('../lib/utils')
const fixtures = require('./fixtures')

//----------------------------------------------------------
// tests
//----------------------------------------------------------
describe('lib/utils', () => {
  // header
  //----------------------------------------------------------
  describe('header', () => {
    it('build header with multiline-billboard', () => {
      const clock = sinon.useFakeTimers()
      const content =
        [ 'First Run │ 4:00:00'
        , 'Last Run  │ 4:00:00'
        , 'Elapsed   │ 0:00:00'
        , 'Runs      │ 0'
        ]
      assert.equal(
        utils.header('4:00:00', Date.parse(new Date()), 0)
        , billboard(content, { justify: 'left' }) + EOL
      )
      clock.restore()
    })
  })

  // shift
  //----------------------------------------------------------
  describe('shift', () => {
    it('[a, b, c] => [a, [b, c]]', () =>
      assert.deepEqual(
        utils.shift(['a', 'b', 'c'])
        , ['a', ['b', 'c']]
      ))
  })

  // readJson
  //----------------------------------------------------------
  describe('readJson', () => {
    it('read json file', () => {
      mock(fixtures)
      const expected =
        { hari:
          { run: 'node test.js'
          , watch: 'test.js'
          }
        }
      utils.readJson('package.json').then(res => {
        assert.deepEqual(res, expected)
        mock.restore()
      })
    })

    it('throw on error', () => {
      utils.readJson('package.json').catch(e => {
        assert.isTrue(e instanceof Error)
      })
    })
  })

  // buildCmdFn
  //----------------------------------------------------------
  describe('buildCmdFn', () => {
    beforeEach(() => {
      sinon.stub(child, 'spawn')
    })

    afterEach(() => {
      child.spawn.restore()
    })

    it('no args', () => {
      const cmd = ['test']
      utils.buildCmdFn(cmd)()
      assert.deepEqual(
        child.spawn.args[0]
        , cmd.concat({ stdio: 'inherit' })
      )
    })

    it('args', () => {
      const cmd = ['test', ['--foo', '--bar']]
      utils.buildCmdFn(cmd)()
      assert.deepEqual(
        child.spawn.args[0]
        , cmd.concat({ stdio: 'inherit' })
      )
    })
  })

  // parseCmd
  //----------------------------------------------------------
  describe('parseCmd', () => {
    // prep
    sinon.stub(child, 'spawn')
    const cmd = 'test --foo'

    // test
    utils.parseCmd(cmd)()
    assert.deepEqual(
      child.spawn.args[0]
      ['test', ['--foo'], { stdio: 'inherit' }]
    )

    // clean
    child.spawn.restore()
  })
})
