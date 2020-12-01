const mongoose = require('../db/index.js')
const { model, Schema } =  mongoose

const poemSchema = new Schema({
  __v: { type: String, select: false },
  // 添加人
  publisher: { type: Schema.Types.ObjectId, ref: 'user', select: false },
  // 诗词的作者
  poem_author: { type: String, required: true },
  // 作者的时代
  author_dynasty: { type: String },
  // 诗词的标题
  poem_title: { type: String, required: true },
  // 诗词的内容
  poem_content: { type: String, required: true, select: false },
  // 诗词的赏析
  poem_appreciation: { type: String, select: false },
  // 点赞量
  zan_number: { type: Number, default: 0, select: false },
  // 收藏量
  collect_number: { type: Number, default: 0, select: false }
})

const poemModel = model('poem', poemSchema)

module.exports = poemModel