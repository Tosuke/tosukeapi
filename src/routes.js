import Router from 'koa-router'
import slack from './services/slack/index'

const router = new Router()

router.use('/slack', slack.routes())

export default router
