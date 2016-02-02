'use strict'

const packageJsonContent = `
{
  "hari":
    { "run": "node test.js"
    , "watch": "test.js"
    }
}
`

const fixtures = module.exports =
  {
    'package.json': packageJsonContent
  }
