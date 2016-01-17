'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
import test from 'ava'

// local
import utils from '../lib/utils'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
// header

test('shift', t => t.same(
  utils.shift(['a', 'b', 'c'])
  , ['a', ['b', 'c']]
))

// readJson

// buildCmdFn

// parseCmd
