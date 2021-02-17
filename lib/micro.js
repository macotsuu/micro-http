const app = require('./app')

// middlewares
const cors = require('./builtin/cors')
const static = require('./builtin/static')
const logger = require('./builtin/logger')

function micro (options) {
    const opts = Object.assign({}, options)

    opts['allowHTTP1'] = true
    return app(opts)
}

exports = module.exports = micro

// Builtin Middlewares
exports.cors = cors
exports.static = static
exports.logger= logger