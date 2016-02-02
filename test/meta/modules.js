'use strict'

// require modules used in testing and add to global object
// this file is injected by mocha.opts

//----------------------------------------------------------
// node
//----------------------------------------------------------
global.EOL = require('os').EOL
global.child = require('child_process')
global.Emitter = require('events')

//----------------------------------------------------------
// npm
//----------------------------------------------------------
global.billboard = require('multiline-billboard')
global.chokidar = require('chokidar')
global.reqDir = require('require-directory')

// chai
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
global.assert = chai.assert

// sinon
const sinon = require('sinon')
const clock = () => {
  let c
  return { freeze: () => c = sinon.useFakeTimers()
          , tick: ms => c.tick(ms)
          , restore: () => c.restore()
          }
}
global.sinon = sinon
global.clock = clock()

//----------------------------------------------------------
// local
//----------------------------------------------------------
global.Hari = require('../..')
global.time = require('../../lib/time')
global.utils = require('../../lib/utils')
