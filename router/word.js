const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()

const { listWords, listWordById, addWord, editWord, deleteWord, checkWordExist, checkWordOwner } = require('../controllers/word.js')

const config = require('../../secret.js')

const auth = jwt({ secret: config.JWT_SECRET })

router.prefix('/words')

// 获取所有的成语
router.get('/', listWords)

// 根据成语的id获取成语
router.get('/:id', checkWordExist, listWordById)

// 添加成语
router.post('/', auth, addWord)

// 编辑成语
router.patch('/:id', auth, checkWordExist, checkWordOwner, editWord)

// 删除成语
router.delete('/:id', auth, checkWordExist, checkWordOwner, deleteWord)

module.exports = router