const pathToRegex = require('path-to-regex')

function router() {
    const routesTable = {}

    const match = req => {
        let isMatched = false
        const method = req.method.toLowerCase()
        const path = req.path

        for (const [key, value] of Object.entries(routesTable)) {
            const parser = new pathToRegex(key)
            const match = parser.match(path)

            if (match) {
                isMatched = true

                return {
                    handler: routesTable[key][method],
                    params: match,
                }
            }
        }

        if (!isMatched) {
            return false
        }
    }

    const queryParse = url => {
        const results = url.match(/\?(?<query>.*)/)

        if (!results) {
          return {};
        }

        const { groups: { query } } = results;
      
        const pairs = query.match(/(?<param>\w+)=(?<value>\w+)/g);
        const params = pairs.reduce((acc, curr) => {
            const [key, value] = curr.split(("="));
            acc[key] = value;
            
            return acc;
        }, {});

        return params;
    }

    return {
        get: (path, cb) => routesTable[path] = { 'get': cb },
        post: (path, cb) => routesTable[path] = { 'post': cb },
        delete: (path, cb) => routesTable[path] = { 'delete': cb },
        put: (path, cb) => routesTable[path] = { 'put': cb },
        match,
        queryParse
    }
}

module.exports = router()