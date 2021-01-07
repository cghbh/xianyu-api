const dynamicModel = require('../models/dynamic.js')
const userModel = require('../models/users.js')
const path = require('path')

class DynamicController {
  // 根据字段确定是按照时间排序还是按照点赞量排序
  // 0表示按照点赞量排序，1表示按照时间排序
  async dynamicList (ctx) {
    const { sort = 0 } = ctx.query
    const { perpage = 20 } = ctx.query
    const perPage = Math.max(perpage * 1, 1)
    // 默认从第一页开始
    const page = Math.max(ctx.query.current_page * 1, 1)
    let dynamics = []
    let allDynamics = []
    if (sort === '0') {
      allDynamics = await dynamicModel.find({is_private: false}).sort({ zan_number: 'desc' }).populate('publisher')
      dynamics = await dynamicModel.find({is_private: false}).sort({ zan_number: 'desc' }).populate('publisher').limit(perPage).skip((page - 1) * perPage)
    } else {
      allDynamics = await dynamicModel.find({is_private: false}).sort({ createdAt: 'desc' }).populate('publisher')
      dynamics = await dynamicModel.find({is_private: false}).sort({ createdAt: 'desc' }).populate('publisher').limit(perPage).skip((page - 1) * perPage)
    }
    ctx.body = {
      errno: 0,
      data: dynamics,
      total: allDynamics.length
    }
  }

  // 如果用户登陆，则返回私密动态和常规的动态
  async dynamicListUserLogin (ctx) {
    const { perpage = 20 } = ctx.query
    const perPage = Math.max(perpage * 1, 1)
    // 默认从第一页开始
    const page = Math.max(ctx.query.current_page * 1, 1)
    const allDynamics = await dynamicModel.find({publisher: ctx.state.user._id}).sort({ createdAt: 'desc' }).populate('publisher')
    const dynamics = await dynamicModel.find({publisher: ctx.state.user._id}).sort({ createdAt: 'desc' }).populate('publisher').limit(perPage).skip((page - 1) * perPage)
    ctx.body = {
      errno: 0,
      data: dynamics,
      total: allDynamics.length
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
      const dynamic = await new dynamicModel({...body, publisher: ctx.state.user._id }).populate('publisher')
      dynamic.save()
      const publisher = await userModel.findById(dynamic.publisher)
      dynamic.publisher = publisher
      ctx.body = {
        errno: 0,
        message: '发表成功',
        data: dynamic
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
    if (!dynamic) {
      return ctx.body = {
        errno: 1,
        message: '动态不存在'
      }
    } else {
      ctx.state.dynamic = dynamic
    }
    
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
