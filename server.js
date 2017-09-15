const express = require('express')
const next = require('next')

const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

async function main () {
  await app.prepare()
  const server = express()

  server.get('/query', (req, res) => {
    let q = req.query.q
    res.json({
      timed_out: false,
      took: 123,
      hits: {
        total: 48,
        max_score: 0.012345,
        hits: [
          {
            highlight: {
              text: ["foo"+q, "bar"+q, "baz"+q],
              "text.english": ["foo", "bar", "baz"],
            },
            highlight_locations: [
              [0,2], [0,2], [0,2]
            ],
            _id: '190831028302983091830982',
            _index: 'aspen',
            _score: 0.012345,
            _type: 'file',
            _source: {
              path: "honk/blat.txt",
              title: "Sample Result "+q
            }
          }
        ]
      }
    })
  })

  server.get('*', (req, res) => {
    const params = { q: req.params.q }
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
