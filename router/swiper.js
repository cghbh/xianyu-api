const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()

// 路由前缀设置
router.prefix('/swipers')

const { swiperList, addSwiper, deleteSwiper, checkSwiperExist, checkSwiperOwner, getSwiperById } = require('../controllers/swiper.js')

const config = require('../../secret.js')

// 鉴权中间件
const auth = jwt({ secret: config.JWT_SECRET })

// 图片上传ali-oss中间件
const uploadimg = require('../middleware/uploadImg')

// 获取当前所有的轮播图
router.get('/', swiperList)

// 获取指定id的轮播图
router.get('/:id', getSwiperById)

// 添加轮播图
router.post('/', auth, uploadimg, addSwiper)

// 删除轮播图
router.delete('/:id', auth, checkSwiperExist, checkSwiperOwner, deleteSwiper)

module.exports = router