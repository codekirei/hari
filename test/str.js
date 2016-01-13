'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
import test from 'ava'

// local
import {longest, pad, wrap} from '../lib/str'

//----------------------------------------------------------
// tests
//----------------------------------------------------------
test('longest', t => t.is(longest(['one', 'two', 'three']), 5))

test('pad - matches max', t => t.is(pad(5)('three'), 'three'))
test('pad - needs padding', t => t.is(pad(8)('three'), 'three   '))

test('wrap', t=> t.is(wrap('|')('foo'), '| foo |'))
