const swiperModel = require('../models/swiper.js')

class SwiperController {
  // 获取所有的轮播图
  async swiperList (ctx) {
    const swipers = await swiperModel.find().sort({ updatedAt: -1 })
    ctx.body = {
      errno: 0,
      data: swipers
    }
  }

  // 检查swiper是否存在
  async checkSwiperExist (ctx, next) {
    const swiper = await swiperModel.findById(ctx.params.id)
    if (!swiper) { ctx.throw(404, '此轮播图不存在') }
    await next()
  }

  // 检查是否拥有swiper的权限
  async checkSwiperOwner (ctx, next) {
    const swiper = await swiperModel.findById(ctx.params.id).select('+publisher')
    if (ctx.state.user._id !== swiper.publisher.toString()) { ctx.throw(404, '没有权限') }
    await next()
  }

  // 获取指定id的轮播图
  async getSwiperById (ctx) {
    const swiper = await swiperModel.findById(ctx.params.id)
    ctx.body = {
      errno: 0,
      data: swiper
    }
  }

  // 添加轮播图
  async addSwiper (ctx) {
    const swiper = new swiperModel({ publisher: ctx.state.user._id, swiper_url: ctx.state.img_url })
    await swiper.save()
    ctx.body = {
      errno: 0,
      message: '添加成功'
    }
  }

  // 删除轮播图
  async deleteSwiper (ctx) {
    const swiper = await swiperModel.findByIdAndRemove(ctx.params.id)
    ctx.body = {
      errno: 0,
      message: '删除成功'
    }
  }
}

module.exports = new SwiperController()