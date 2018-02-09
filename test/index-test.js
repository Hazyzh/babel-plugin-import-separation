const { transform } = require('@babel/core')
const plugin = require('../lib/index.js')
const fs = require('fs')
const assert = require('assert')
const { join } = require('path')
require('colors')

const { readdirSync, readFileSync } = fs

const fixturesDir = join(__dirname, 'fixtures')
const fixtures = readdirSync(fixturesDir);

describe('#index', () => {
  fixtures.forEach(item => {
    it(`test for *** ${item.green.bold}`, () => {
      const expectCode = readFileSync(join(fixturesDir, item, 'expected.js'), 'utf-8')
      const config = require(join(fixturesDir, item, 'config.js'))
      const code = readFileSync(join(fixturesDir, item, 'actual.js'), 'utf-8')

      const resCode = transform(code, {
        plugins: [
          [ plugin, config ]
        ]
      }).code

      assert.strictEqual(expectCode.trim(), resCode.trim())
    })
  })
})
