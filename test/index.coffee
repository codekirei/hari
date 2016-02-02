'use strict'

# describe('methods', () => reqDir(module, './methods'))

# describe('lib/time', () => {
#   beforeEach(() => clock.freeze())
#   afterEach(() => clock.restore())
#   reqDir(module, './time')
# })

describe 'lib/time', ->
  beforeEach -> clock.freeze()
  afterEach -> clock.restore()
  reqDir module, './time'

describe 'lib/utils', -> reqDir module, './utils'

describe 'methods', -> reqDir module, './methods'
