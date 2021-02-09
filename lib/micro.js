const http = require('http2')
const response = require('./response')
const request = require('./request')
const pathToRegex = require('path-to-regex')


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
        listen: (port, host, cb) => server.listen(port, host, cb)
    }
}

module.exports = micro