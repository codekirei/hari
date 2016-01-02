'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// node
import test from 'ava'

// npm
// const sinon = require('sinon')
// const chokidar = require('chokidar')

// local
import Hari from '../'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test('constructor', t => {
  const hari = new Hari()
  t.false(hari.running)
  t.is(hari.runs, 0)
  t.is(hari.cmd, void 0)
  t.is(hari.startTime, void 0)
  t.is(hari.timestamp, void 0)
})
