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

/**
  Pad a string with spaces to a specified length.

  @param {Number} max - length to pad to
  @returns {Function} curried fn
 */
const pad = max => str => {
  const len = str.length
  return max > len ? str + ' '.repeat(max - len) : str
}

/**
  Wrap a string with a padded character on both sides.

  @param {String} ch - character(s) to wrap string with
  @returns {String} wrapped string
 */
const wrap = ch => str => `${ch} ${str} ${ch}`

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports =
  { longest
  , pad
  , wrap
  }
