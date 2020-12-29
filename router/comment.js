const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()
const { commentList, addComment, deleteComment } = require('../controllers/comment.js')
const { checkDynamicExist } = require('../controllers/dynamic.js')
const config = require('../../secret.js')

// 鉴权中间件，必须登录
const auth = jwt({ secret: config.JWT_SECRET })

// 路由前缀
router.prefix('/dynamics/:id/comments')

// 获取dynamicId动态下面的所有评论
router.get('/', checkDynamicExist, commentList)

// 添加评论
router.post('/', auth, checkDynamicExist, addComment)

router.delete('/:cId', deleteComment)

module.exports = router