const http = require('http2')
const response = require('./response')
const request = require('./request')
const middleware = require('./middleware')
const router = require('./router')
const { queryParse } = require('./router')

function app(options) {
    const server = http.createSecureServer(options, async(_request, _response) => {
        const req = await request(_request)
        const res = await response(_request, _response)
        const parts = req.url.split('?')
        const path = parts[0]
        
        req.query = queryParse(req.url)
        req.path = path

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
    server.on('error', e => console.error(e))

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