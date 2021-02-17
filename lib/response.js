async function response (request, response) {
    const res = {
        statusCode: 200,
        
        status: function(status) {
            this.statusCode = status
            return this
        },
        json: function(data) {
            response.writeHead(this.statusCode, { 'Content-Type': 'application/json;charset=utf-8' })
            response.end(JSON.stringify(data))
        },
        send: function(data) {
            response.writeHead(this.statusCode, { 'Content-Type': 'text/plain;charset=utf-8' })
            response.end(data)
        },
        html: function (data) {
            response.writeHead(this.statusCode, { 'Content-Type': 'text/html;charset=utf-8' })
            response.end(data)
        },
        end: function (data) {
            response.writeHead(this.statusCode)
            response.end(data)
        },
        set: function(header, value) {
            response.setHeader(header, value)
            return this
        },
        get: function(header) {
            return response.getHeader(header)
        }
    }

    return res
}

module.exports = response