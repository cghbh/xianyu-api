/* 文章数据模型 */
const mongoose = require('../db/index.js')
const { model, Schema } =  mongoose

const articleSchema = new Schema({
  __v: {
    type: String,
    select: false
  },
  // 文章的发布者
  publisher: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    select: false
  },
  // 文章的标题
  article_title: {
    type: String,
    required: true
  },
  // 文章的作者
  article_author: {
    type: String,
    required: true
  },
  // 文章的内容
  article_content: {
    type: String,
    required: true,
    select: false
  },
  // 文章的简短介绍
  article_introduce: {
    type: String
  },
  // 文章配图
  article_image: {
    type: String,
    required: true
  },
  // 文章的点赞量
  zan_number:{
    type: Number,
    default: 0,
    select: false
  },
  updatedAt: {
    type: Date,
    select: false
  },
  // 文章的收藏量
  collect_number: {
    type: Number,
    default: 0,
    select: false
  }
}, { timestamps: true })

const articleModel = model('article', articleSchema)

module.exports = articleModel