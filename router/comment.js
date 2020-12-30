const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()
const { commentList, addComment, likeDynamicComments, checkCommentExit, unlikeDynamicComments } = require('../controllers/comment.js')
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

// 删除评论
// router.delete('/:cId', deleteComment)

// 动态的评论点赞
router.patch('/', auth, checkDynamicExist, checkCommentExit, likeDynamicComments)

// 动态的评论取消点赞
router.delete('/', auth, checkDynamicExist, checkCommentExit, unlikeDynamicComments)

module.exports = router