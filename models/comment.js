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
  // 根评论的id，判断当前是一级评论还是二级评论
  root_comment_id: {
    type: String
  },
  // 向谁回复评论
  reply_to: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
}, { timestamps: true })

const commentModel = model('comment', commentSchema)

module.exports = commentModel