/* 题目数据模型 */
const mongoose = require('../db/index.js')
const { model, Schema } =  mongoose

const subjectSchema = new Schema({
  __v: {
    type: String,
    select: false
  },
  publisher: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    select: false
  },
  question_answer: {
    type: String,
    required: true
  },
  question_title: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    select: false
  },
  // 问题的选项
  question_options: {
    type: [{ option: { type: String }, option_title: { type: String } }],
    required: true
  }
}, { timestamps: true })

const subjectModel = model('subject', subjectSchema)

module.exports = subjectModel