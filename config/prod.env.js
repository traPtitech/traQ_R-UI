'use strict'

let hash 
  
try {
  hash = require('child_process').execSync('git rev-parse HEAD').toString().trim()
} catch (e) {
  hash = 'not git repository'
}

module.exports = {
  NODE_ENV: '"production"',
  REVISION: '"' + hash + '"'
}
