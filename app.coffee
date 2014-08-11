#!./node_modules/coffee-script/bin/coffee

bodyParser = require 'body-parser'
coffeeMiddleware = require 'coffee-middleware'
express = require 'express'
fs = require 'fs'
less = require 'less-middleware'
logger = require 'morgan'
request = require 'request'
pathlib = require 'path'

require './localenv'

app = express()
app.set 'views', pathlib.join(__dirname, 'views')
app.set 'view engine', 'jade'
app.use logger('dev')
app.use bodyParser.json()
app.use bodyParser.urlencoded(extended: true)
app.use less(pathlib.join(__dirname, 'static'))
app.use coffeeMiddleware(src: pathlib.join(__dirname, 'static'))
app.use express.static(pathlib.join(__dirname, 'static'))

app.get '/', (req, res) ->
  res.render 'index'

app.get '/query', (req, res) ->
  res.header 'Cache-Control', 'no-cache'
  options =
    method: 'GET'
    url: "#{ process.env.SOLR_URL }/query"
    json: true
    qs:
      q: req.query.q
      hl: true
      fl: 'id,url,title'
      'hl.fl': 'content'
      'hl.fragsize': 300
      'hl.snippets': 3
      'hl.mergeContiguous': true
  request options, (err, result, body) ->
    res.json body

port = process.env.PORT ? 8080
app.listen port, ->
  console.log "Listening on http://localhost:#{ port }"
