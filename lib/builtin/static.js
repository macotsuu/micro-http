const fs = require('fs')
const mime = require('mime')
const { resolve, join, normalize } = require('path')

module.exports = options => {
    const opts = Object.assign({}, options)
    const root = opts.path || 'public'
    const prefix = opts.prefix || '/static'

    return async(req, res, next) => {
        const method = req.headers[':method']
        const path = resolve(root)

        if (req.headers[':path'].startsWith(prefix)
            && req.headers[':path'][prefix.length] === '/') {
            if (method !== 'GET' && method !== 'HEAD') {
                res.status(405)
                res.headers['content-length'] = 0
                res.headers['Access-Control-Allow-Method'] = 'GET, HEAD'
                res.end()

                return
            }

            const file = req.headers[':path'].slice(prefix.length)
            const pathToFile = normalize(join(path, file))

            const fd = fs.openSync(pathToFile, 'r')
            const stat = fs.fstatSync(fd)
            const type = mime.getType(pathToFile)

            res.stream.respondWithFD(fd, {
                'content-type': type,
                'content-length': stat.size,
                'last-modified': stat.mtime.toUTCString()
            })
            res.stream.end()

            return
        }

        next()
    }
}