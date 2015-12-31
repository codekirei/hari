'use strict'

/**
  Parse milliseconds between two unix timestamps.

  @param {Number} from - timestamp to start from
  @param {Number} to - timestamp after elapsed time
  @returns {String} H:M:S passed
  */
const diff = (from, to) => fromMs(to - from)

/**
  Prepend a leading 0 to single-digit times.

  @param {Number} num - number to potentially prepend
  @returns {String|Number} num or prepended string
  */
const digit = num => num.toString().length === 1 ? `0${num}` : num

/**
  Convert milliseconds to hours, minutes, and seconds.

  @param {Number} ms - a number of milliseconds
  @returns {String} H:M:S
  */
const fromMs = ms =>
  [ Math.floor(ms / 3600000)
  , digit(Math.floor(ms / 60000 % 60))
  , digit(Math.floor(ms / 1000 % 60))
  ].join(':')

/**
  Convert Date object to hours, minutes, and seconds.

  @param {Object} ob - Date object
  @returns {String} H:M:S
 */
const fromOb = ob =>
  [ hours(ob.getHours())
  , digit(ob.getMinutes())
  , digit(ob.getSeconds())
  ].join(':')

/**
  Convert 24 hour notation to 12 hour notation.

  @param {Number} num - hours to convert
  @returns {Number} converted hours
  */
const hours = num => num > 12 ? num - 12 : num

//----------------------------------------------------------
// exports
//----------------------------------------------------------
module.exports =
  { diff
  , digit
  , fromMs
  , fromOb
  , hours
  }
