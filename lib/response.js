async function response (stream, headers) {
    const res = {}

    res.statusCode = 200

    res.headers = headers
    res.stream = stream

    res.status = code => res.statusCode = code
    res.end = message => stream.end(message)
    res.send = message => {
        stream.respond({"content-type": "text/plain", ':status': res.statusCode })
        stream.end(message)
    }

    res.html = data => {
        stream.respond({"content-type": "text/html", ':status': res.statusCode})
        stream.end(data)
    }

    res.json = data => {
        stream.respond({"content-type": "application/json", ':status': res.statusCode })
        stream.end(JSON.stringify(data))
    }
    
    return res
}

module.exports = response