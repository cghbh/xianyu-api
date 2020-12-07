const mongoose = require('../db/index.js')
const { model, Schema } =  mongoose

const jokeSchema = new Schema({
  __v: { type: String, select: false },
  // 段子的发布者
  publisher: { type: Schema.Types.ObjectId, ref: 'user', select: false },
  // 内容
  content: { type: String },
  updatedAt: { type: Date, select: false },
  // 点赞的数量
  zan_number: { type: Number, default: 0 },
  // 收藏的数量
  collect_number: { type: Number, default: 0 }
}, { timestamps: true })

const jokeModel = model('joke', jokeSchema)

module.exports = jokeModel