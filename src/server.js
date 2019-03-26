const express = require('express')
const nunjucks = require('nunjucks')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const path = require('path')
const flash = require('connect-flash')
const dateFilter = require('nunjucks-date-filter-local')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.middleWare()
    this.views()
    this.routes()
  }

  middleWare () {
    this.express.use(express.urlencoded({ extended: false }))
    this.express.use(flash())
    this.express.use(
      session({
        name: 'root',
        secret: 'myAppSecret',
        resave: true,
        store: new FileStore({
          path: path.resolve(__dirname, '..', 'tmp', 'sessions')
        }),
        saveUnitiliaze: true
      })
    )
  }

  views () {
    const env = nunjucks.configure(path.resolve(__dirname, 'app', 'views'), {
      autoescape: true,
      express: this.express,
      watch: this.isDev
    })

    env.addFilter('date', dateFilter)

    this.express.use(express.static(path.resolve(__dirname, 'public')))
    this.express.set('view engine', 'njk')
  }

  routes () {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express
