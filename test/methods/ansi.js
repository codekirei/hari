'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
const assert = require('chai').assert
const sinon = require('sinon')

// local
const Hari = require('../../')

//----------------------------------------------------------
// tests
//----------------------------------------------------------
module.exports = describe('ansi', () => {
  beforeEach(() => sinon.stub(process.stdout, 'write'))

  it('str param', () => {
    const hari = new Hari()
    hari.ansi('H')
    assert.equal(process.stdout.write.args[0][0], '\u001b[H')
    process.stdout.write.restore()
  })

  it('ar param', () => {
    const hari = new Hari()
    hari.ansi(['foo', 'bar'])
    assert.equal(process.stdout.write.args[0][0], '\u001b[foo')
    assert.equal(process.stdout.write.args[1][0], '\u001b[bar')
    process.stdout.write.restore()
  })
})
