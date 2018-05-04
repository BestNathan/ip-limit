const koa = require('koa')
const iplimit = require('../lib')
const app = new koa()
const onerror = require('koa-onerror')

onerror(app)

app.use(iplimit({}))

app.use(async (ctx) => {
    ctx.body = 'success'
})

app.on('error', err => {
    throw err

})

app.listen(3000)