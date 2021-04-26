const Router = require('koa-router')
const { dynamicList, publicDynamic, deleteDynamic, checkDynamicExist, checkPublisher, dynamicImageUpload, dynamicById, listLikePerson } = require('../controllers/dynamic.js')
const router = new Router()
const jwt = require('koa-jwt')

const config = require('../../secret.js')

const auth = jwt({ secret: config.JWT_SECRET })

// ip地址获取中间件
const getClientIPMidware = require('../middleware/get_ip.js')

// 图片上传ali-oss中间件
const uploadimg = require('../middleware/uploadImg')

router.prefix('/dynamics')

// 获取所有的动态
router.get('/', getClientIPMidware, dynamicList)

// 获取指定id的动态的详情
router.get('/:id', getClientIPMidware, dynamicById)

// 登录之后的用户才能发表
router.post('/', getClientIPMidware, auth, publicDynamic)

// 删除动态，登录-> 检查是否是动态的发布者
router.delete('/:id', getClientIPMidware, auth, checkDynamicExist, checkPublisher, deleteDynamic)

// 上传动态的图片
router.post('/upload', getClientIPMidware, auth, uploadimg, dynamicImageUpload)

// 获取指定动态的所有点赞者
router.get('/:id/likePersons', getClientIPMidware, checkDynamicExist, listLikePerson)

module.exports = router
