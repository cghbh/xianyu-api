const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()

const { checkOwner, find, findById, backUserInfoByToken, update, deleteById, login, loginByTelephoneCode, findBackPassword, register, listFollowing, follow, unfollow, listFollowers, checkUserExist, getUserDynamicById, uploadUserAvatar, likeDynamics, unlikeDynamics, listLikeDynamics, likeJoke, unlikeJoke, getJokeByUserId, collectJoke, cancelCollectJoke, getCollectJokeById, likePoem, unlikePoem, collectPoem, cancelCollectPoem, getLikePomesByUserId, getCollectPoemsByUserId, likeWord, unlikeWord, cancelCollectWord, collectWord, getLikeWordsByUserId, getCollectWordsByUserId, likeArticle, unlikeArticle, collectArticle, cancelCollectArticle, getLikeArticlesByUserId, getCollectArticlesByUserId, getUserCollectDynamics,cancelCollectDynamics, collectDynamics, getUserDynamicByFollow, userLikeDynamicComments } = require('../controllers/user.js')

const { checkDynamicExist, dynamicListUserLogin } = require('../controllers/dynamic.js')
const { checkJokeExist } = require('../controllers/joke.js')
const { checkPoemExist } = require('../controllers/poem.js')
const { checkWordExist } = require('../controllers/word.js')
const { checkArticleExist } = require('../controllers/article.js')

// 图片上传ali-oss中间件
const uploadimg = require('../middleware/uploadImg')

const config = require('../../secret.js')

const auth = jwt({ secret: config.JWT_SECRET })

router.prefix('/users')

// 获取所有的用户
router.get('/', find)

// 根据登录的token返回用户信息
router.post('/', auth, backUserInfoByToken)

// 根据id查询用户
router.get('/:id', checkUserExist, findById)

// 根据用户的id查询当前的关注
router.get('/:id/following', checkUserExist, listFollowing)

// 关注某人，必须要鉴权中间件，也就是必须要登录才知道是谁关注的
router.put('/following/:id', auth, checkUserExist, follow)

// 取消关注
router.delete('/following/:id', auth, checkUserExist, unfollow)

// 根据id查询粉丝
router.get('/:id/follower',checkUserExist, listFollowers)

// 修改用户
router.patch('/:id', auth, checkOwner, update)

// 删除用户
router.delete('/:id', auth, checkUserExist, deleteById)

// 登录
router.post('/login', login)

// 验证码登录
router.post('/login_by_code', loginByTelephoneCode)

// 重置密码
router.post('/reset_password', findBackPassword)

// 注册
router.post('/register', register)

// 根据id获取用户的详细信息
router.get('/:id/dynamics', checkUserExist, getUserDynamicById)

// 用户上传头像，需要登录
router.post('/upload', auth, uploadimg, uploadUserAvatar)

// 用户点赞过的动态列表
router.get('/:id/likeDynamcis', checkUserExist, listLikeDynamics)

// 点赞,需要登录
router.get('/likeDynamics/:id', auth, checkDynamicExist, likeDynamics)

// 动态取消点赞
router.delete('/unlikeDynamics/:id', auth, checkDynamicExist, unlikeDynamics)
 
// 用户收藏动态
router.get('/collectDynamics/:id', auth, checkDynamicExist, collectDynamics)

// 用户取消收藏动态
router.delete('/cancelCollectDynamics/:id', auth, checkDynamicExist, cancelCollectDynamics)

// 获取用户点赞过的所有的评论列表id
router.get('/:id/getZanCommentsId', checkUserExist, userLikeDynamicComments)

// 获取指定id用户的所有收藏的动态
router.get('/:id/collectDynamics', checkUserExist, getUserCollectDynamics)

// 返回已登陆用户的所有发布过的动态
router.post('/userOwnDynamics', auth, dynamicListUserLogin)

// 获取指定id用户的关注者的动态,需要登陆
router.get('/:id/followDynamics', auth, checkUserExist, getUserDynamicByFollow)

// 段子点赞
router.get('/likeJokes/:id', auth, checkJokeExist, likeJoke)

// 段子取消赞
router.delete('/unlikeJokes/:id', auth, checkJokeExist, unlikeJoke)

// 获取指定id用户点赞过的段子
router.get('/:id/getLikeJokes', checkUserExist, getJokeByUserId)

// 收藏段子
router.get('/collectJokes/:id', auth, checkJokeExist, collectJoke)

// 取消收藏段子
router.delete('/cancelCollectJokes/:id', auth, checkJokeExist, cancelCollectJoke)
  
// 获取指定id用户收藏的段子
router.get('/:id/getCollectJokes', checkUserExist, getCollectJokeById)

// 诗词点赞
router.get('/likePoems/:id', auth, checkPoemExist, likePoem)

// 诗词取消赞
router.delete('/unlikePoems/:id', auth, checkPoemExist, unlikePoem)

// 收藏诗词
router.get('/collectPoems/:id', auth,checkPoemExist, collectPoem)

// 取消收藏诗词
router.delete('/cancelCollectPoems/:id', auth,checkPoemExist, cancelCollectPoem)

// 根据用户id查询所有点赞过的诗词
router.get('/:id/likePoems', checkUserExist, getLikePomesByUserId)

// 根据用户id查询所有收藏过的诗词
router.get('/:id/collectPoems', checkUserExist, getCollectPoemsByUserId)

// 成语点赞
router.get('/likeWord/:id', auth, checkWordExist, likeWord)

// 成语取消赞
router.delete('/unlikeWord/:id', auth, checkWordExist, unlikeWord)

// 收藏成语
router.get('/collectWord/:id', auth, checkWordExist, collectWord)

// 取消收藏成语
router.delete('/cancelCollectWord/:id', auth, checkWordExist, cancelCollectWord)

// 根据用户id返回用户点赞过的所有成语
router.get('/:id/likeWords', checkUserExist, getLikeWordsByUserId)

// 根据用户id返回用户收藏过的所有成语
router.get('/:id/collectWords', checkUserExist, getCollectWordsByUserId)

// 文章点赞
router.get('/likeArticle/:id', auth, checkArticleExist, likeArticle)

// 文章取消赞
router.delete('/unlikeArticle/:id', auth, checkArticleExist, unlikeArticle)

// 文章收藏
router.get('/collectArticle/:id', auth, checkArticleExist, collectArticle)

// 文章取消收藏
router.delete('/cancelCollectArticle/:id', auth, checkArticleExist, cancelCollectArticle)

 // 根据用户id返回用户点赞过的所有文章
 router.get('/:id/likeArticles', checkUserExist, getLikeArticlesByUserId)
 
 // 根据用户id返回用户收藏过的所有文章
 router.get('/:id/collectArticles', checkUserExist, getCollectArticlesByUserId)

module.exports = router
