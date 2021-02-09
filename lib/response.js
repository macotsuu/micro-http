function response (stream) {
    const res = {}

    res.statusCode = 200
    
    res.status = code => res.statusCode = code

    res.send = message => {
        stream.respond({"content-type": "text/plain", ':status': res.statusCode })
        stream.end(message)
    }
    res.json = data => {
        stream.respond({"content-type": "application/json", ':status': res.statusCode })
        stream.end(JSON.stringify(data))
    }
    
    return res

}

module.exports = response