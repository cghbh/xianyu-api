const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()
const { jokeList, addJoke, deleteJokeById, editJokeById, randomGetJoke, checkJokeExist, checkJokeOwner, getJokeById } = require('../controllers/joke.js')
const config = require('../../secret.js')

const auth = jwt({ secret: config.JWT_SECRET })

router.prefix('/jokes')

// 获取所有的段子
router.get('/', jokeList)

// 随机返回一个段子
router.post('/random', randomGetJoke)

// 根据id返回段子
router.get('/:id', checkJokeExist, getJokeById)

// 添加段子,需要登录鉴权
router.post('/', auth, addJoke)

// 根据id删除段子
router.delete('/:id', auth, checkJokeExist, checkJokeOwner, deleteJokeById)

// 根据id修改段子
router.patch('/:id', auth, checkJokeExist, checkJokeOwner, editJokeById)

module.exports = router