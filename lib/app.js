const http = require('http2')
const response = require('./response')
const request = require('./request')
const middleware = require('./middleware')
const router = require('./router')

function app(options) {
    const server = http.createSecureServer(options)

    server.on('error', e => console.error(`${e.message}${e.stack}`))
    server.on('stream', async(stream, headers) => {
        const req = await request(stream, headers)
        const res = await response(stream, headers)

        const match = router.match(req)

        if (match) {
            req.params = match.params
            req.handler = match.handler
        } else {
            req.handler = async (req, res) => {
                res.status(404)
                res.send('Not found')
            }
        }

        middleware.run(req, res)
    })

    return {
        listen: (port, host, cb) => server.listen(port, host, cb),
        close: (cb) => server.close(cb),
        get: router.get,
        post: router.post,
        delete: router.delete,
        put: router.put,
        use: middleware.use
    }
}

module.exports = app