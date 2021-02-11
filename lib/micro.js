const http = require('http2')
const response = require('./response')
const request = require('./request')
const pathToRegex = require('path-to-regex')
const mime = require('mime')
const fs = require('fs')

function micro(options) {
    const routeTable = {}
    const server = http.createSecureServer(options)

    server.on('error', e => console.error(`${e.message}${e.stack}`))
    server.on('stream', async(stream, headers) => {
        let match = false
        const method = headers[':method'].toLowerCase()
        const path = headers[':path']

        for (let[key, value] of Object.entries(routeTable)) {
            const parser = new pathToRegex(key)
            const result = parser.match(path)

            if (result) {
                const cb = routeTable[key][method]

                let req = await request(stream, headers)
                let res = response(stream)

                req.params = result
                match = true

                await cb(req, res)
                break
            }
        }

        if (!match) {
            stream.respond({':status': 404, 'content-type': 'text/plain'})
            stream.end('Not found')
        }
    })

    return {
        get: (path, cb) => routeTable[path] = { 'get': cb },
        post: (path, cb) => routeTable[path] = { 'post': cb },
        delete: (path, cb) => routeTable[path] = { 'delete': cb },
        put: (path, cb) => routeTable[path] = { 'put': cb },
        listen: (port, host, cb) => server.listen(port, host, cb),
        close: (cb) => server.close(cb),
        static: (path) => async (req, res) => {
            const fd = fs.openSync( `${path}${req.path}`, 'r')
            const stat = fs.fstatSync(fd)
            const type = mime.getType(`${path}${req.path}`)

            req.stream.respondWithFD(fd, {
                'content-length': stat.size,
                'last-modified': stat.mtime.toUTCString(),
                'content-type': type
            })
            req.stream.end()
        }
    }
}

module.exports = micro