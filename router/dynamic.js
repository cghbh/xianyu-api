const Router = require('koa-router')
const { dynamicList, publicDynamic, deleteDynamic, checkDynamicExist, checkPublisher, dynamicImageUpload, dynamicById, listLikePerson } = require('../controllers/dynamic.js')
const router = new Router()
const jwt = require('koa-jwt')

const config = require('../../secret.js')

const auth = jwt({ secret: config.JWT_SECRET })

// 图片上传ali-oss中间件
const uploadimg = require('../middleware/uploadImg')

router.prefix('/dynamics')

// 获取所有的动态
router.get('/', dynamicList)

// 获取指定id的动态的详情
router.get('/:id', dynamicById)

// 登录之后的用户才能发表
router.post('/', auth, publicDynamic)

// 删除动态，登录-> 检查是否是动态的发布者
router.delete('/:id', auth, checkDynamicExist, checkPublisher, deleteDynamic)

// 上传动态的图片
router.post('/upload', auth, uploadimg, dynamicImageUpload)

// 获取指定动态的所有点赞者
router.get('/:id/likePersons', checkDynamicExist, listLikePerson)

module.exports = router
