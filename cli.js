#! /usr/bin/env node

'use strict'

const Liftoff = require('liftoff')
const argv = require('minimist')(process.argv.slice(2))
const Hari = require('./')

new Liftoff(
  { name: 'hari'
  , configName: '.hari'
  , extensions:
    { rc: null
    }
  , completions: null
  }
).launch(
  { configPath: argv.config || argv.conf
  }
  , env => new Hari(env, argv)
)
