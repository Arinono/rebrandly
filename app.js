const axios = require('axios')
const http = require('http')

const API_KEY = process.env.REBRANDLY_API_KEY

http.createServer((req, res) => {
  let body = ''
  req.on('data', chunk => { body += chunk.toString() })
  req.on('end', () => {
    if (!['/shorten'].includes(req.url)) {
      res.writeHead(404)
      res.end()
    }

    let url
    try {
      url = JSON.parse(body).url.toString()
    } catch (e) {
      res.writeHead(400)
      res.end()
    }

    let ret
    axios.get(`https://api.rebrandly.com/v1/links/new?apikey=${API_KEY}&destination=${url}`)
      .then(response => {
        ret = response.data.shortUrl
        res.writeHead(200, {'Content-Length': Buffer.byteLength(ret), 'Content-Type': 'text/plain'})
      }).catch(() => {
      res.writeHead(400)
    }).finally(() => {
      res.end(ret)
    })
  })
}).listen(process.env.PUBSUB_PORT || 5000)
