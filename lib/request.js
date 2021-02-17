const readBody = data => new Promise((resolve, reject) => {
    const chunks = []

    data.on('data', chunk => chunks.push(chunk))
    data.on('end', () => resolve(chunks.join('')))
    data.on('error', reject)
})

async function request(request) {
    const req = {}
    
    req.method = request.method
    req.url = request.url
    req.status = request.statusCode
    req.httpVersion = request.httpVersion
    req.ip = (request.headers['x-forwarded-for'] || request.connection.remoteAddress || '').split(',')[0].trim()
    req.body = await readBody(request.httpVersion === '2.0' ? request.stream : request)

    if (request.httpVersion === '2.0') {
        req.host = request.authority
        req.protocol = request.scheme
        req.stream = request.stream
    } else { 
        req.host = request.headers['host']
        req.protocol = request.socket.encrypted ? 'https' : 'http'
    }
    
    return req
}

module.exports = request