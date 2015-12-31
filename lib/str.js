'use strict'

/**
  Find character count of longest string in array.

  @param {String[]} ar - array of strings
  @returns {Number} number of characters in longest string
  */
const longest = ar =>
  ar.reduce((prev, cur) => {
    const len = cur.length
    return len > prev ? len : prev
  }, 0)

// TODO jsdoc
const pad = max => str => {
  const len = str.length
  return max > len ? str + ' '.repeat(max - len) : str
}

// TODO jsdoc
const wrap = ch => str => `${ch} ${str} ${ch}`

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports =
  { longest
  , pad
  , wrap
  }
