const dynamicModel = require('../models/dynamic.js')
const userModel = require('../models/users.js')
const path = require('path')

class DynamicController {
  // 获取所有的动态列表，后面按照热度排名
  async dynamicList (ctx) {
    const dynamics = await dynamicModel.find().sort({ createdAt: 'desc' }).populate('publisher')
    ctx.body = {
      code: 200,
      data: dynamics
    }
  }
  
  // 获取动态的详情
  async dynamicById (ctx) {
    const dynamic = await dynamicModel.findById(ctx.params.id).populate('publisher')
    if (!dynamic) { ctx.throw(404, "动态不存在") }
    ctx.body = {
      code: 200,
      data: dynamic
    }
  }
  
  // 发表动态,需要登录
  async publicDynamic (ctx) {
    ctx.verifyParams({
      content: { type: 'string', required: true },
      avatar_url: { type: 'array', required: false }
    })
    const { body } = ctx.request
    try {
      await new dynamicModel({...body, publisher: ctx.state.user._id }).save()
      ctx.body = {
        code: 200,
        msg: '发表成功'
      }
    } catch (err) {
      ctx.body = {
        code: 400,
        err,
        msg: '发表失败'
      }
    }
  }
  
  // 上传动态的图片
  async dynamicImageUpload (ctx) {
    ctx.body = {
      code: 200,
      msg: '上传成功',
      data: ctx.state.img_url
    }
  }
  
  // 检查当前的这个动态是否存在，用在删除点赞的时候
  async checkDynamicExist (ctx, next) {
    const dynamic = await dynamicModel.findById(ctx.params.id)
    if (!dynamic) { ctx.throw(404, '动态不存在！') }
    ctx.state.dynamic = dynamic
    await next()
  }
  
  // 当用户删除的时候，检查当前的操作者是否是本人
  async checkPublisher (ctx, next) {
    if (ctx.state.dynamic.publisher.toString() !== ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }
  
  // 删除动态，根据用户传递的动态id
  async deleteDynamic (ctx) {
    const data = await dynamicModel.findByIdAndRemove(ctx.params.id)
    ctx.body = {
      code: 200,
      msg: '删除成功'
    }
  }
  
  // 获取动态的所有点赞者
  async listLikePerson (ctx) {
    try {
      const users = await userModel.find({ likeDynamics: ctx.params.id })
      ctx.body = {
        code: 200,
        msg: '查询成功',
        data: users
      }
    } catch (err) {
      ctx.body = {
        code: 400,
        msg: '查询成功',
        data: err
      }
    }
    
  }
}

module.exports = new DynamicController()
