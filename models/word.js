const mongoose = require('../db/index.js')
const { model, Schema } =  mongoose

const wordSchema = new Schema({
  __v: {
    type: String,
    select: false
  },
  publisher: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    select: false
  },
  // 成语
  word_title: {
    type: String,
    required: true
  },
  // 成语的意思
  word_meaning: {
    type: String,
    required: true
  },
  // 成语的拼音
  word_pinyin: {
    type: String
  },
  // 成语的出处
  word_birth: {
    type: String,
    required: false
  },
  // 成语故事
  word_story: {
    type: String
  },
  // 点赞量
  zan_number: {
    type: Number,
    default: 0
  },
  // 收藏量
  collect_number: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

const wordModel = model('word', wordSchema)

module.exports = wordModel