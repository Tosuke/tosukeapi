import Router from 'koa-router'
import login from './login'
import { log } from 'util';

const router = new Router()

router.post('/login', async ctx => {
  const body = ctx.request.body
  if (!body.team) {
    ctx.throw(400, 'missing param "team"')
  }
  if (!body.email) {
    ctx.throw(400, 'missing param "email"')
  }
  if (!body.password) {
    ctx.throw(400, 'missing param "password"')
  }

  const { team, email, password } = body
  try {
    ctx.body = await login(team, email, password)
  } catch(e) {
    ctx.throw(400, e.message)
  }
})

export default router
