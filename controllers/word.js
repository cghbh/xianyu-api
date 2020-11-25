const wordModel = require('../models/word.js')

class WordController {
  // 检查成语是否存在
  async checkWordExist (ctx, next) {
    const word = await wordModel.findById(ctx.params.id)
    if (!word) { ctx.throw(404, '该成语不存在') }
    await next()
  }
  
  // 检查是否是成语的发布者或者是超级管理员
  async checkWordOwner (ctx, next) {
    const word = await wordModel.findById(ctx.params.id).select('+publisher')
    if (word.publisher.toString() !== ctx.state.user._id) { ctx.throw(403, '没有权限') }
    await next()
  }
  
  // 返回所有的成语
  async listWords (ctx) {
    const words = await wordModel.find()
    ctx.body = {
      errno: 0,
      data: words
    }
  }
  
  // 根据成语的id返回成语的详细内容
  async listWordById (ctx) {
    const word = await wordModel.findById(ctx.params.id)
    ctx.body = {
      errno: 0,
      data: word,
      message: '获取成功'
    }
  }
  
  // 添加成语
  async addWord (ctx) {
    ctx.verifyParams({
      word_title: { type: 'string', required: true },
      word_meaning: { type: 'string', required: true },
      word_birth: { type: 'string', required: false },
      word_pinyin: { type: 'string', required: true }
    })
    // 查找成语是否已经添加过了
    const oldWord = await wordModel.findOne({ word_title: ctx.request.body.word_title })
    if (oldWord) {
      ctx.throw(412, '该成语已经添加过了')
    }
    const word = new wordModel({ publisher: ctx.state.user._id, ...ctx.request.body })
    await word.save()
    ctx.body = {
      errno: 0,
      message: '创建成功'
    }
  }
  
  // 编辑成语
  async editWord (ctx) {
    const word = await wordModel.findByIdAndUpdate(ctx.params.id, { ...ctx.request.body }, { new: true })
    console.log(word)
    ctx.body = {
      errno: 0,
      message: '编辑成功'
    }
  }
  
  // 删除成语
  async deleteWord (ctx) {
    await wordModel.findByIdAndRemove(ctx.params.id)
    ctx.body = {
      errno: 0,
      message: '删除成功'
    }
  }
}

module.exports = new WordController()