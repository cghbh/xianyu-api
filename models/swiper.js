const { Schema, model } = require('../db')

// 创建Schema
const swiperSchema = new Schema({
  __v: {
    type: String,
    select: false
  },
  // 轮播图的添加者
  publisher: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    select: false
  },
  // 轮播图的地址
  swiper_url: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    select: false
  }
}, { timestamps: true })

const swiperModel = model('swiper', swiperSchema)

module.exports = swiperModel