const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()
const { listSubjects, addSubject, listSubjectById, checkSubjectExist, checkSubjectOwner, deleteSubject, editSubject, backSubjectRandom } = require('../controllers/subject.js')
const config = require('../../secret.js')

const auth = jwt({ secret: config.JWT_SECRET })

router.prefix('/subjects')

// 返回所有的题目
router.get('/', listSubjects)

// 添加题目
router.post('/', auth, addSubject)

// 根据题目的id号返回详细的内容
router.get('/:s_id', auth, checkSubjectExist, listSubjectById)

// 删除题目
router.delete('/:s_id', auth, checkSubjectExist, checkSubjectOwner, deleteSubject)

// 编辑题目
router.patch('/:s_id', auth, checkSubjectExist, checkSubjectOwner, editSubject)

router.post('/random', auth, backSubjectRandom)

module.exports = router