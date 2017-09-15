import Head from 'next/head'
import React from 'react'
import fetch from 'isomorphic-unfetch'

function getOrigin () {
  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? ':' + port : ''}`
  } else {
    return `http://localhost:${process.env.PORT || 3000}`
  }
}

export default class Index extends React.Component {

  static async getInitialProps ({ req }) {
    let query = req.query.q
    let results
    if (query != null) {
      let res = await fetch(getOrigin() + '/query')
      results = await res.json()
    }
    return { query, results }
  }

  render () {
    let { query, results } = this.props
    return (
    <div>

      <Head>
        <title>Aspen</title>
        <meta name="robots" content="noindex, nofollow"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"/>
      </Head>

      <div className="container">
        <style jsx>{`
          background: #eee;
          padding: 1em 0;
          margin-bottom: 1em;
          .lead {
            margin-bottom: 0;
          }
          form > * {
            margin-right: 1em;
          }
          input[type=text] {
            width: 55%;
            padding: 5px 7px;
          }
          img { width: 100px; }
        `}</style>

        <form>
          <a href="/">
            <img src="/static/dodge-aspen.png"/>
            <label htmlFor="query" className="lead hidden-xs">Aspen</label>
            <input id="query" type="text" value={query == null ? '' : query}/>
          </a>
          <button className="btn btn-primary">
            <span className="hidden-xs">Search</span>
            <span className="visible-xs fa fa-search fa-reverse"/>
          </button>
          <span className="nowrap">
            <input id="slop" type="checkbox"/>
            <label htmlFor="slop" className="hidden-xs">Sloppy</label>
            <label htmlFor="slop" className="visible-xs-inline">S</label>
          </span>
        </form>

      </div>

      <div className="container results">
        <pre>{JSON.stringify(results, null, '  ')}</pre>
      </div>

    </div>
    )
  }
}