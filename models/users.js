const mongoose = require('../db/index.js')
const { model, Schema } =  mongoose

const userSchema = new Schema({
  __v: { type: String, select: false },
  telephone: { type: String, required: true },
  password: { type: String, select: false, required: true },
  gender: { type: String, enum: ['famale', 'male'], default: 'male', select: false },
  personal_sign: { type: String, default: '这个人很懒，什么都没留下......' },
  nickname: { type: String, required: true, default: '' },
  avatar_url: { type: String, default: '' },
  // 背景墙图片
  background: { type: String, default: 'https://xianyu-uploads.oss-cn-beijing.aliyuncs.com/upload_db2b2600a6320a64bb3ac21d3c58201a.jpg' },
  email: { type: String, select: false, default: '' },
  birth: { type: String, select: false, default: '1999-09-09'},
  // 用户的角色，0-普通，1-管理员，2-超级管理员
  user_roles: { type: Number, enum: [0, 1, 2], default: 0, select: false },
  created: { type: String },
  updated: { type: String, select: false },
  // 用户的状态，0-正常，1-禁言特定时间，2-永久禁言
  status: { type: Number, enum: [0, 1, 2], default: 0, select: false },
  // 所在地
  location: { type: String, select: false, default: '北京市东城区' },
  // 黑名单人员列表数据
  black_list: {
    type: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    select: false
  },
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
  // 不喜欢的动态，也就是屏蔽的动态
  unlikeDynamics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'dynamic' }],
    select: false
  },
  // 收藏的动态
  collectDynamics: {
    type: [{ type: Schema.Types.ObjectId, ref: 'dynamic' }],
    select: false
  },
  // 用户点赞过的评论id纪录
  zanDynamicComments: {
    type: [{ type: String }],
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
  updatedAt: {
    type: Date,
    select: false
  }
}, { timestamps: true })

const userModel = model('user', userSchema)

module.exports = userModel
