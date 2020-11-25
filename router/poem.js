const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()
const { listPoem, listPoemById, addPoem, editPoem, deletePoem, checkPoemExist, checkPoemOwner } = require('../controllers/poem.js')
const config = require('../../secret.js')

const auth = jwt({ secret: config.JWT_SECRET })

router.prefix('/poems')

// 获取所有的诗词列表
router.get('/', listPoem)

// 根据诗词的id返回诗词的详细内容
router.get('/:id', checkPoemExist, listPoemById)

// 添加诗词
router.post('/', auth, addPoem)

// 删除诗词
router.delete('/:id', auth, checkPoemExist, checkPoemOwner, deletePoem)

// 编辑诗词
router.patch('/:id', auth, checkPoemExist, checkPoemOwner, editPoem)

module.exports = router