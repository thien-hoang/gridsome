const execa = require('execa')
const args = ['--config', 'jest.config.js']

execa('jest', args, {
  stdio: 'inherit',
  env: {
    WITH_BUILD: process.argv.some(v => v === '--build')
  }
})
