import * as functions from 'firebase-functions'
import Koa from 'koa'
import cors from '@koa/cors'
import bodyParser from 'koa-body'
import router from './routes'

const app = new Koa()
app
  .use(cors())
  .use(async (ctx, next) => {
    if (
      ['GET', 'HEAD', 'DELETE'].includes(ctx.method.toUpperCase()) === false
    ) {
      ctx.request.body = ctx.req.body
    }
    await next()
  })
  .use(async (ctx, next) => {
    try {
      await next()
    } catch (e) {
      ctx.status = e.status || 500
      ctx.body = {
        message: e.message,
      }
      ctx.app.emit('error', e, ctx)
    }

    if (ctx.status === 404) {
      ctx.body = {
        message: 'not found'
      }
    }
  })
  .use(router.routes())
  .use(router.allowedMethods())

exports.index = functions.https.onRequest(app.callback())

app.on('error', (err, ctx) => {
  console.error(err)
})
