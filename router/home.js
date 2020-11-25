const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()
const config = require('../../secret.js')
const { captcha, upload, getCodeByTelephoneReg, getCodeByTelephoneLogin, getCodeByTelephoneFind, checkTelephoneCode } = require('../controllers/home.js')

const auth = jwt({ secret: config.JWT_SECRET })

// 图形验证码
router.get('/captcha', captcha)

// 文件上传，上传之前需要鉴权登录
router.post('/upload', auth, upload)

// 获取注册短信验证码
router.post('/regcode', getCodeByTelephoneReg)

// 获取登录短信验证码
router.post('/logincode', getCodeByTelephoneLogin)

// 获取找回密码短信验证码
router.post('/findcode', getCodeByTelephoneFind)

// 短信验证码校验
router.post('/verifyCode', checkTelephoneCode)

module.exports = router
