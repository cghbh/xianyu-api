const mongoose = require('../db/index.js')
const { model, Schema } =  mongoose

const userSchema = new Schema({
  __v: { type: String, select: false },
  telephone: { type: String, required: true },
  password: { type: String, select: false, required: true },
  gender: { type: String, enum: ['famale', 'male'], default: 'male', select: false },
  personal_sign: { type: String, default: '这个人很懒，什么都没留下......' },
  nickname: { type: String, required: true, default: '' },
  avatar_url: { type: String },
  // 用户的角色，0-普通，1-管理员，2-超级管理员
  user_roles: { type: Number, enum: [0, 1, 2], default: 0, select: false },
  // 教育经历，表示一个数组结构的对象
  educations: {
    type: [{
      // 学校
      school: { type: String },
      // 专业
      major: { type: String },
      // 学历1-小学，2-初中，3-高中，4-大专，5-本科，6-研究生
      diploma: { type: Number, enum: [1, 2, 3, 4, 5, 6] },
      // 入学年份
      entrance_year: { type: Number },
      // 毕业年份
      graduation_year: { type: Number }
    }],
    select: false
  },
  // 工作经历
  employments: {
    type: [{
      company: { type: String },
      job: { type: String }
    }],
    select: false
  },
  created: { type: String },
  updated: { type: String, select: false },
  // 用户的状态，0-正常，1-禁言特定时间，2-永久禁言
  status: { type: Number, enum: [0, 1, 2], default: 0, select: false },
  location: { type: String, select: false },
  // 我的关注
  following: {
    type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    select: false
  },
  // 点赞的动态
  likeDynamics: { 
    type: [{ type: Schema.Types.ObjectId, ref: 'dynamic' }],
    select: false
  },
  // 点赞的段子
  likeJokes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'joke' }],
    select: false
  },
  // 收藏的段子
  collectJokes: {
    type: [{ type: Schema.Types.ObjectId, ref: 'joke' }],
    select: false
  },
  // 点赞的诗词
  likePoems: {
    type: [{ type: Schema.Types.ObjectId, ref: 'poem' }],
    select: false
  },
  // 收藏的诗词
  collectPoems: {
    type: [{ type: Schema.Types.ObjectId, ref: 'poem' }],
    select: false
  },
  // 点赞的成语
  likeWords: {
    type: [{ type: Schema.Types.ObjectId, ref: 'word' }],
    select: false
  },
  // 收藏的成语
  collectWords: {
    type: [{ type: Schema.Types.ObjectId, ref: 'word' }],
    select: false
  },
  // 点赞的文章
  likeArticles: {
    type: [{ type: Schema.Types.ObjectId, ref: 'article' }],
    select: false
  },
  // 收藏的文章
  collectArticles: {
    type: [{ type: Schema.Types.ObjectId, ref: 'article' }],
    select: false
  },
  createdAt: {
    type: Date,
    select: false
  },
  updatedAt: {
    type: Date,
    select: false
  }
}, { timestamps: true })

const userModel = model('user', userSchema)

module.exports = userModel