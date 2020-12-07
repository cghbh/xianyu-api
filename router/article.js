const Router = require('koa-router')
const jwt = require('koa-jwt')
const router = new Router()
const { uploadAricleImage, addArticle, listArticles, checkArticleExist, listArticleById, checkArticleOwner, editArticle, deleteArticle, getHotArticle } = require('../controllers/article.js')
const config = require('../../secret.js')

const auth = jwt({ secret: config.JWT_SECRET })

// 图片上传ali-oss中间件
const uploadimg = require('../middleware/uploadImg')

router.prefix('/articles')

// 获取所有的文章
router.get('/', listArticles)

// 根据文章id返回文章的详情
router.get('/:id', checkArticleExist, listArticleById)

// 上传文章的图片
router.post('/upload', auth, uploadimg, uploadAricleImage)

// 添加文章
router.post('/', auth, addArticle)

// 获取热门文章
router.post('/hot', getHotArticle)

// 编辑文章
router.patch('/:id', auth,  checkArticleExist, checkArticleOwner, editArticle)

// 删除文章
router.delete('/:id', auth, checkArticleExist, checkArticleOwner, deleteArticle)

module.exports = router