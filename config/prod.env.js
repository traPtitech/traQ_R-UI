'use strict'

const hash = require('child_process').execSync('git rev-parse HEAD').toString().trim()

module.exports = {
  NODE_ENV: '"production"',
  REVISION: '"' + hash + '"'
}
