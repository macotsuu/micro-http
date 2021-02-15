const pathToRegex = require('path-to-regex')

function router() {
    const routesTable = {}

    const match = req => {
        let isMatched = false
        const method = req.headers[':method'].toLowerCase()
        const path = req.headers[':path']

        for (const [key, value] of Object.entries(routesTable)) {
            const parser = new pathToRegex(key)
            const match = parser.match(path)

            if (match) {
                isMatched = true
                return {
                    handler: routesTable[key][method],
                    params: match
                }
            }
        }

        if (!isMatched) {
            return false
        }
    }

    return {
        get: (path, cb) => routesTable[path] = { 'get': cb },
        post: (path, cb) => routesTable[path] = { 'post': cb },
        delete: (path, cb) => routesTable[path] = { 'delete': cb },
        put: (path, cb) => routesTable[path] = { 'put': cb },
        match
    }
}

module.exports = router()