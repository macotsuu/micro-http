const readBody = stream => new Promise((resolve, reject) => {
    const chunks = []

    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => resolve(chunks.join('')))
    stream.on('error', reject)
})

async function request(stream, headers) {
    const req = {}
    const body = await readBody(stream)

    req.headers = headers
    req.stream = stream
    req.body = body ? JSON.parse(body) : {}

    return req
}

module.exports = request