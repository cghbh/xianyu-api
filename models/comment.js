// 动态评论的数据表
const mongoose = require('../db/index.js')
const { model, Schema } =  mongoose

const commentSchema = new Schema({
  __v: {
    type: String,
    select: false
  },
  // 评论的内容
  content: {
    type: String,
    required: true
  },
  // 评论人是谁，要求登录鉴权处理
  commentator: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  // 评论的动态id
  dynamic_id: {
    type: String,
    required: true
  },
  zan_number: {
    type: Number,
    default: 0
  },
  // 评论的评论
  second_comment: {
    type: [{
      content: { type: String },
      commentator: { type: Schema.Types.ObjectId, ref: 'user' },
      root_comment_id: { type: String },
      reply_to: { type: Schema.Types.ObjectId, ref: 'user' },
      dynamic_id: { type: String, required: true },
      createdAt: { type: Date },
      zan_number: { type: Number, default: 0 }
    }]
  },
  updatedAt: {
    type: Date,
    select: false
  }
}, { timestamps: true })

const commentModel = model('comment', commentSchema)

module.exports = commentModel