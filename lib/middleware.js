function middleware () {
    const middleware = []
    let currentMiddleware = 0

    const run =  function (req, res) {
        const next = createNext(req, res, middleware)
        next()
    }

    const createNext = function (req, res, middleware) {
        currentMiddleware = -1

        const next = function() {
            currentMiddleware += 1
            const handle = middleware[currentMiddleware]

            if (handle) {
                handle(req, res, next)
            } else {
                req.handler(req, res)
            }
        }

        return next
    }

    const use = function (handler) {
        middleware.push(handler)
    }

    return { use, run }
}

module.exports = middleware()