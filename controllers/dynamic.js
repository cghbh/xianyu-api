const dynamicModel = require('../models/dynamic.js')
const userModel = require('../models/users.js')
const path = require('path')

class DynamicController {
  // 根据字段确定是按照时间排序还是按照点赞量排序
  // 0表示按照点赞量排序，1表示按照时间排序
  async dynamicList (ctx) {
    const { sort = 0 } = ctx.query
    let dynamics = []
    if (sort === '0') {
      dynamics = await dynamicModel.find().sort({ zan_number: 'desc' }).populate('publisher')
    } else {
       dynamics = await dynamicModel.find().sort({ createdAt: 'desc' }).populate('publisher')
    }
    ctx.body = {
      errno: 0,
      data: dynamics
    }
  }
  
  // 获取动态的详情
  async dynamicById (ctx) {
    const dynamic = await dynamicModel.findById(ctx.params.id).populate('publisher')
    if (!dynamic) { ctx.throw(404, "动态不存在") }
    ctx.body = {
      errno: 0,
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
        errno: 0,
        message: '发表成功'
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '发表失败'
      }
    }
  }
  
  // 上传动态的图片
  async dynamicImageUpload (ctx) {
    ctx.body = {
      errno: 0,
      message: '上传成功',
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
      errno: 0,
      message: '删除成功'
    }
  }
  
  // 获取动态的所有点赞者
  async listLikePerson (ctx) {
    try {
      const users = await userModel.find({ likeDynamics: ctx.params.id })
      ctx.body = {
        errno: 0,
        message: '查询成功',
        data: users
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '查询成功',
        data: err
      }
    }
    
  }
}

module.exports = new DynamicController()
