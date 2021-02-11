function response (stream) {
    const res = {}

    res.statusCode = 200
    res.status = code => res.statusCode = code

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

    res.file = file => {
        stream
    }
    
    return res
}

module.exports = response