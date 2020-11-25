const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()
const { listSubjects, addSubject } = require('../controllers/subject.js')
const config = require('../../secret.js')

const auth = jwt({ secret: config.JWT_SECRET })

router.prefix('/subjects')

// 返回所有的题目
router.get('/', listSubjects)

router.post('/', auth, addSubject)

module.exports = router