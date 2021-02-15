module.exports = (options) => async (req, res, next) => {
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Request-Method'] = '*'
    res.headers['Access-Control-Allow-Methods'] = 'OPTIONS, GET'
    res.headers['Access-Control-Allow-Headers'] = '*';

    if (req.headers[':method'] === 'OPTIONS') {
        res.status(204)
        res.end()

        return
    }

    next()
}