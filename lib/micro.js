const app = require('./app')

// middlewares
const cors = require('./builtin/cors')
const static = require('./builtin/static')
const logger = require('./builtin/logger')

function micro (options) {
    return app(options)
}

exports = module.exports = micro


// Builtin Middlewares
exports.cors = cors
exports.static = static
exports.logger= logger