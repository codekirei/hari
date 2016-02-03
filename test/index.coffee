'use strict'

describe 'lib/time', ->
  beforeEach -> clock.freeze()
  afterEach -> clock.restore()
  reqDir module, './time'

modules =
  'lib/utils': './utils'
  'methods': './methods'

test = (str, path) -> describe str, -> reqDir module, path
test str, path for str, path of modules
