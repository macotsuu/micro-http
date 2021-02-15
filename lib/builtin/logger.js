module.exports = async (req, res, next) => {
    const method = req.headers[':method']
    const path = req.headers[':path']

    console.log(`${method} ${path}`)
    next()
}