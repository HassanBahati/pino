'use strict'

var test = require('tap').test
var pino = require('../')
var writer = require('flush-write-stream')

function capture () {
  var ws = writer(function (chunk, enc, cb) {
    this.data += chunk.toString()
    cb()
  })
  ws.data = ''
  return ws
}

test('pino uses LF by default', ({end, ok}) => {
  var stream = capture()
  var logger = pino(stream)
  logger.info('foo')
  logger.error('bar')
  ok(/foo[^\r\n]+\n[^\r\n]+bar[^\r\n]+\n/.test(stream.data))

  end()
})

test('pino can log CRLF', ({end, ok}) => {
  var stream = capture()
  var logger = pino({
    crlf: true
  }, stream)
  logger.info('foo')
  logger.error('bar')
  ok(/foo[^\n]+\r\n[^\n]+bar[^\n]+\r\n/.test(stream.data))

  end()
})
