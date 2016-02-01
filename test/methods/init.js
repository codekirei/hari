'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const Emitter = require('events')

// npm
const assert = require('chai').assert
const sinon = require('sinon')
const chokidar = require('chokidar')
const mock = require('mock-fs')

// local
const Hari = require('../../')
const utils = require('../../lib/utils')
const fixtures = require('../fixtures')

//----------------------------------------------------------
// tests
//----------------------------------------------------------
module.exports = describe('init', () => {
  // hooks
  //----------------------------------------------------------
  let clock

  before(() => {
    clock = sinon.useFakeTimers()
    sinon.stub(chokidar, 'watch').returns(new Emitter())
  })

  after(() => {
    chokidar.watch.restore()
    clock.restore()
  })

  // cases
  //----------------------------------------------------------
  it('restore cursor')

  // cases - success
  //----------------------------------------------------------
  describe('success', () => {
    let hari
      , watcher

    before(cb => {
      mock(fixtures)
      hari = new Hari()
      sinon.stub(hari, 'print')
      sinon.stub(hari, 'bindTimes')
      sinon.stub(utils, 'parseCmd').returns('test')
      hari.init().then(res => {
        watcher = res
        cb()
      })
    })

    after(() => {
      mock.restore()
      hari.print.restore()
      hari.bindTimes.restore()
      utils.parseCmd.restore()
    })

    it('bind times', () => {
      assert.isTrue(hari.bindTimes.calledWith(new Date()))
    })

    it('parse cmd', () => {
      assert.isTrue(utils.parseCmd.calledWith('node test.js'))
      assert.equal(hari.cmd, 'test')
    })

    it('watch with chokidar', () => {
      assert.isTrue(chokidar.watch.calledWith('test.js'))
    })

    it('debounce and call chokidar cb', () => {
      assert.isFalse(hari.print.called)
      watcher.emit('all')
      clock.tick(30)
      watcher.emit('all')
      clock.tick(20)
      assert.isFalse(hari.print.called)
      clock.tick(30)
      assert.isTrue(hari.print.called)
    })
  })

  // cases - err
  //----------------------------------------------------------
  describe('err', () => {
    it.skip('catch and handle read error', () => {
      // prep
      mock()
      const logger = sinon.stub(console, 'error')
      const hari = new Hari()

      // run
      const prom = hari.init()

      // clean
      console.error.restore()
      mock.restore()

      // assertions
      prom.then(res => {
        assert.isTrue(logger.called)
      })
    })
  })
})
