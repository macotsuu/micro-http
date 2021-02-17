const fs = require('fs')
const mime = require('mime')
const { resolve, join, normalize } = require('path')

module.exports = (root, options) => {
    const opts = Object.assign({}, options)
    const prefix = opts.prefix || '/static'

    return async(req, res, next) => {
        const method = req.method
        const path = resolve(root)
        
        if (req.url.startsWith(prefix)
            && req.url[prefix.length] === '/') {
            if (method !== 'GET' && method !== 'HEAD') {
                res.set('content-length', 0)
                res.set('Access-Control-Allow-Method', 'GET, HEAD')
                
                return res.status(405).end()
            }

            const file = req.url.slice(prefix.length)
            const pathToFile = normalize(join(path, file))

            const data = fs.readFileSync(pathToFile)
            const stat = fs.statSync(pathToFile)
            const type = mime.getType(pathToFile)

            res
                .set('content-type', type)
                .set('content-length', stat.size)
                .set('last-modified', stat.mtime.toUTCString())
                .status(200)
                .end(data)

            return
        }

        next()
    }
}