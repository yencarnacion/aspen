const express = require('express')
const next = require('next')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const { search } = require('./lib/elasticsearch')

async function main () {
  await app.prepare()
  const server = express()

  server.get('/search', async (req, res) => {
    res.header('Cache-Control', 'no-cache')
    let query = req.query.query
    let page = Number(req.query.page) || 0
    let sloppy = !!req.query.sloppy
    let results
    try {
      results = await search(query, page, sloppy)
    } catch (err) {
      console.error(`Error while searching for "${query}": ${err.stack}`)
      results = { error: `Error: ${err}` }
    }
    res.json(results)
  })

  server.get('*', (req, res) => {
    const params = { q: req.query.q }
    return handle(req, res, null, params)
  })

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
}

try {
  main()
} catch (err) {
  console.error(err.stack)
  process.exit(1)
}
