'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
const process = require('child_process')
const Emitter = require('events').EventEmitter

// npm
const t = require('chai').assert
const sinon = require('sinon')
const chokidar = require('chokidar')

// local
const Hari = require('../')
const util = require('../lib/utils')

//----------------------------------------------------------
// tests
//----------------------------------------------------------
describe('hari', () => {
  beforeEach(() => {
    sinon.stub(process, 'spawn')
    sinon.stub(chokidar, 'watch').returns(new Emitter())
  })

  it('autoruns', cb => {
    sinon.spy(util, 'readJson')
    const hari = new Hari()
    t.isTrue(util.readJson.calledOnce)
    return cb()
  })

  afterEach(() => {
    process.spawn.restore()
    chokidar.watch.restore()
  })
})

// test('hari - default path', t => {
//   sinon.spy(util, 'readJson')
//   sinon.stub(console, 'log')

//   hari()
//   t.true(util.readJson.calledOnce)
//   t.true(util.readJson.calledWith('./package.json'))

//   util.readJson.restore()
//   console.log.restore()
// })

// test('hari - custom path', t => {
//   sinon.spy(util, 'readJson')

//   hari('fixture')
//   t.true(util.readJson.calledOnce)
//   t.same(
//     util.readJson.firstCall.returnValue._fulfillmentHandler0
//     , hari.init
//   )

//   util.readJson.restore()
// })
