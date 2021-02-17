module.exports = options => async (req, res, next) => {
    res.set('Access-Control-Allow-Origin', '*')
    res.set('Access-Control-Request-Method', '*')
    res.set('Access-Control-Allow-Methods', 'OPTIONS, GET')
    res.set('Access-Control-Allow-Headers', '*')

    if (req.method === 'OPTIONS') {
        return res.status(204).end()
    }

    next()
}