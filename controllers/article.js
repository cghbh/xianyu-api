const articleModel = require('../models/article.js')

class ArticleController {
  // 返回所有的文章
  async listArticles (ctx) {
    // 默认每页展示20页
    const { perpage = 20 } = ctx.query
    const perPage = Math.max(perpage * 1, 1)
    // 默认从第一页开始
    const page = Math.max(ctx.query.current_page * 1, 1)
    const articles = await articleModel.find().sort({ createdAt: 'desc' }).limit(perPage).skip((page - 1) * perPage)
    const allArticles = await articleModel.find()
    ctx.body = {
      errno: 0,
      data: articles,
      total: allArticles.length
    }
  }
  
  // 根据文章的id返回指定的文章
  async listArticleById (ctx) {
    const article = await articleModel.findById(ctx.params.id).select('+article_content +collect_number +zan_number -article_introduce')
    ctx.body = {
      errno: 0,
      data: article
    }
  }
  
  // 检查文章是否存在
  async checkArticleExist (ctx, next) {
    const article = await articleModel.findById(ctx.params.id)
    if (!article) { ctx.throw(404, '此文章不存在') }
    await next()
  }
  
  // 检查是否拥有文章的操作权限
  async checkArticleOwner (ctx, next) {
    const article = await articleModel.findById(ctx.params.id).select('+publisher')
    if (article.publisher.toString() !== ctx.state.user._id) {
      ctx.throw(403, '没有权限')
    }
    await next()
  }
  
  // 添加文章
  async addArticle (ctx) {
    ctx.verifyParams({
      article_title: { type: 'string', required: true },
      article_author: { type: 'string', required: true },
      article_content: { type: 'string', required: true },
      article_image: { type: 'string', required: false }
    })
    // 根据标题检查是否是重复添加了
    const oleArticle = await articleModel.findOne({ article_title: ctx.request.body.article_title })
    console.log(oleArticle)
    if (oleArticle) { ctx.throw(404, '此文章已存在，请勿重复添加') }
    const article = new articleModel({ publisher: ctx.state.user._id, ...ctx.request.body })
    await article.save()
    ctx.body = {
      errno: 0,
      message: '创建成功'
    }
  }
  
  // 上传文章的图片,返回上传到ali-oss的地址
  async uploadAricleImage (ctx) {
    ctx.body = {
      errno: 0,
      data: {
        img_url: ctx.state.img_url
      }
    }
  }
  
  // 编辑文章
  async editArticle (ctx) {
    const article = await articleModel.findByIdAndUpdate(ctx.params.id, { ...ctx.request.body }, { new: true })
    ctx.body = {
      errno: 0,
      data: article,
      message: '编辑成功'
    }
  }
  
  // 删除文章
  async deleteArticle (ctx) {
    const article = await articleModel.findByIdAndRemove(ctx.params.id)
    ctx.body = {
      errno: 0,
      message: '删除成功'
    }
  }
  
  async getHotArticle (ctx) {
    const articles = await articleModel.find().sort({ zan_number: 'desc' })
    ctx.body = {
      errno: 0,
      data: articles.splice(0, 10)
    }
  }
}

module.exports = new ArticleController()