'use strict'

path = require 'path'

describe 'readJson', ->

  it 'read file and parse json', ->
    fixture = path.join process.cwd(), 'test', 'meta', 'fixture.json'
    promise = utils.readJson fixture
    expected =
      hari:
        run: 'node test.js'
        watch: 'test.js'
    assert.eventually.deepEqual promise, expected

  it 'throw on error', ->
    promise = utils.readJson './notReal'
    assert.isRejected promise, Error
