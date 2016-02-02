/* global
 , clock
 , reqDir
 , time
 */

'use strict'

describe('methods', () => reqDir(module, './methods'))

describe('lib/time', () => {
  beforeEach(() => clock.freeze())
  afterEach(() => clock.restore())
  reqDir(module, './time')
})
