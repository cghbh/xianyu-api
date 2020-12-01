const poemModel = require('../models/poem.js')

class PoemController {
  // 检查诗词是否存在
  async checkPoemExist (ctx, next) {
    const poem = await poemModel.findById(ctx.params.id).select('+publisher')
    if (!poem) { ctx.throw(404, '诗词不存在') }
    ctx.state.poem = poem
    await next()
  }
  
  // 检查登录者是否是发布者，否则没有删除的权限
  async checkPoemOwner (ctx, next) {
    if (ctx.state.user._id !== ctx.state.poem.publisher.toString()) {
      ctx.throw(403, '没有权限')
    } 
    await next()
  }
  
  // 返回所有的诗词
  async listPoem (ctx) {
    // 默认每页展示10条数据
    const { perpage = 20 } = ctx.query
    const perPage = Math.max(perpage * 1, 1)
    // 默认从第一页开始
    const page = Math.max(ctx.query.current_page * 1, 1)
    const poems = await poemModel.find().limit(perPage).skip((page - 1) * perPage)
    ctx.body = {
      errno: 0,
      data: poems
    }
  }
  
  // 根据诗词的id返回诗词
  async listPoemById (ctx) {
    const poem = await poemModel.findById(ctx.params.id)
    if (!poem) { ctx.throw(404, '诗词不存在') }
    ctx.body = {
      errno: 0,
      data: poem
    }
  }
  
  // 添加诗词
  async addPoem (ctx) {
    const { body } = ctx.request
    const poem = await poemModel.findOne({ poem_title: body.poem_title })
    // 根据诗词的标题判断是否重复了
    if (poem && poem.poem_title === body.poem_title) {
      ctx.throw(409, '该诗词已存在')
    }
    // 参数校验
    ctx.verifyParams({
      poem_title: { type: 'string', required: true },
      poem_author: { type: 'string', required: true },
      author_dynasty: { type: 'string', required: false },
      poem_content: { type: 'string', required: true },
      poem_appreciation: { type: 'string', required: false }
    })
    const newPoem = new poemModel({publisher: ctx.state.user._id, ...body})
    await newPoem.save()
    ctx.body = {
      errno: 0,
      message: '添加成功',
      data: newPoem
    }
  }
  
  // 编辑诗词
  async editPoem (ctx) {
    try {
      const poem = await poemModel.findByIdAndUpdate(ctx.params.id, { ...ctx.request.body }, { new: true })
      ctx.body = {
        errno: 0,
        message: '更新成功',
        data: poem
      }
    } catch {
      ctx.body = {
        errno: 1,
        message: '更新失败'
      }
    }
  }
  
  // 删除诗词
  async deletePoem (ctx) {
    try {
      await poemModel.findByIdAndRemove(ctx.params.id)
      ctx.body = {
        errno: 0,
        message: '删除成功'
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '删除失败'
      }
    }
  }
}

module.exports = new PoemController()