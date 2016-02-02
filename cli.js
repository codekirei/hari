#!/usr/bin/env node
'use strict'

//----------------------------------------------------------
// modules
//----------------------------------------------------------
// npm
const Liftoff = require('liftoff')
const argv = require('minimist')(process.argv.slice(2))

//----------------------------------------------------------
// build cli env
//----------------------------------------------------------
const HariCLI = new Liftoff(
  { name: 'hari'
  , configName: '.hari'
  , extensions:
    { rc: null
    }
  , completions: null // todo
  }
)

HariCLI.launch(
  { configPath: argv.config || argv.conf
  }
  , init
)

//----------------------------------------------------------
// launch app
//----------------------------------------------------------
function init(env) {
  console.log(env.configPath)
}
