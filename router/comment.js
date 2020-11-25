const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()
const { commentList, checkCommentExist, addComment } = require('../controllers/comment.js')
const config = require('../../secret.js')

// 鉴权中间件，必须登录
const auth = jwt({ secret: config.JWT_SECRET })

// 路由前缀
router.prefix('/dynamics/:dynamicId/comments')

// 获取dynamicId动态下面的所有评论
router.get('/', checkCommentExist, commentList)

router.post('/', auth, addComment)

module.exports = router