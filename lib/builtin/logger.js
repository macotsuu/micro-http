module.exports = async (req, res, next) => {
    console.log(`${req.ip} [${new Date().toLocaleString()}] "${req.method} ${req.url} HTTP/${req.httpVersion}"`)

    next()
}