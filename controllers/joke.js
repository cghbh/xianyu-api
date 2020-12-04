const jokeModel = require('../models/joke.js')
const userModel = require('../models/users.js')

class JokeController {
  // 所有的段子
  async jokeList (ctx) {
    const jokes = await jokeModel.find().select('+publisher')
    ctx.body = {
      errno: 0,
      data: jokes
    }
  }
  
  // 判断删除编辑段子的人是否是段子的所有者或者是超级管理员权限
  async checkJokeOwner (ctx, next) {
    // 如果用户登录的id和发布者的id不一致不能删除，后面会增加顶级权限来删除
    if (ctx.state.joke.publisher.toString() !== ctx.state.user._id) { ctx.throw(403, '没有操作权限') }
    await next()
  }
  
  // 判断当前的段子是否存在
  async checkJokeExist (ctx, next) {
    const joke = await jokeModel.findById(ctx.params.id).select('+publisher')
    if (!joke) { ctx.throw(404, '段子不存在') }
    ctx.state.joke = joke
    await next()
  }
  
  // 根据段子的id返回段子的详细内容
  async getJokeById (ctx) {
    const joke = await jokeModel.findById(ctx.params.id)
    ctx.body = {
      errno: 0,
      data: joke
    }
  } 
  
  // 增加段子
  async addJoke (ctx) {
    const user = await userModel.findById(ctx.state.user._id)
    if (!user) { ctx.throw(404, '用户不存在') }
    ctx.verifyParams({
      content: { type: 'string', required: true }
    })
    const joke = new jokeModel({
      publisher: ctx.state.user._id,
      ...ctx.request.body
    })
    await joke.save()
    ctx.body = {
      errno: 0,
      message: '创建成功'
    }
  }
  
  // 根据id删除段子
  async deleteJokeById (ctx) {
    await jokeModel.findByIdAndRemove(ctx.params.id)
    ctx.body = {
      errno: 0,
      message: '删除成功'
    }
  }
  
  // 根据id编辑段子
  async editJokeById (ctx) {
    const joke = await jokeModel.findByIdAndUpdate(ctx.params.id, { ...ctx.request.body })
    ctx.body = {
      errno: 0,
      message: '修改成功'
    }
  }
  
  // 随机获取段子
  async randomGetJoke (ctx) {
    const jokes = await jokeModel.find()
    const length = jokes.length
    const randomIndex = Math.floor(Math.random() * length)
    
    ctx.body = {
      errno: 0,
      data: jokes[randomIndex]
    }
  }
}

module.exports = new JokeController()