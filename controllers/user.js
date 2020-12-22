const jsonwebtoken = require('jsonwebtoken')
const config = require('../../secret.js')
const userModel = require('../models/users.js')
const dynamicModel = require('../models/dynamic.js')
const jokeModel = require('../models/joke.js')
const poemModel = require('../models/poem.js')
const wordModel = require('../models/word.js')
const articleModel = require('../models/article.js')
const bcrypt = require('bcrypt')
const avatars = require('../utils/avatar.js')
// Redis校验验证码
const { getValue } = require('../config/redis.js')

// 下面作为接口的标准化参数实现
/**
 * @description [fnUploadRequest 覆盖默认的上传行为，实现自定义上传]
 * @author shanshuizinong
 * @param {object} option [上传选项]
 * @return {null} [没有返回]
 */

// 必须考虑xss

class UserController {
  // 查找所有的用户
  async find(ctx) {
    // 默认每页展示10条数据
    const { perpage = 20 } = ctx.query
    const perPage = Math.max(perpage * 1, 1)
    // 默认从第一页开始
    const page = Math.max(ctx.query.current_page * 1, 1)
    const allUsers = await userModel.find({ nickname: new RegExp(ctx.query.q) })
    const users = await userModel.find({ nickname: new RegExp(ctx.query.q) }).limit(perPage).skip((page - 1) * perPage)
    ctx.body = {
      errno: 0,
      data: users,
      total: allUsers.length
    }
  }

  // 根据id查找用户
  async findById(ctx) {
    // 根据指定的字段查询用户的信息
    const { fileds = '' } = ctx.query
    const userFileds = fileds.replace(new RegExp('password', 'gi'), '').split(';').filter(f => f).map(f => ' +' + f).join('')
    const user = await userModel.findById(ctx.params.id).select(userFileds)
    // 抛出用户不存在的错误
    if (!user) {
      ctx.throw(404, '用户不存在！')
    }
    ctx.body = {
      errno: 0,
      data: user
    }
  }

  // 根据用户登录的token返回用户的信息
  async backUserInfoByToken (ctx) {
    // 字段筛选
    const { fileds = '' } = ctx.query
    const userFileds = fileds.replace(new RegExp('password', 'gi'), '').split(';').filter(f => f).map(f => ' +' + f).join('')
    const user = await userModel.findById(ctx.state.user._id).select(userFileds)
    ctx.body = {
      errno: 0,
      data: user
    }
  }
  
  // 用户更新操作
  async update(ctx) {
    // { new: true } 表示返回更新之后的数据
    const user = await userModel.findByIdAndUpdate(ctx.params.id, ctx.request.body, {
      new: true
    })
    if (!user) {
      ctx.throw(404, '用户不存在！')
    }
    ctx.body = {
      errno: 0,
      message: '修改成功',
      data: user
    }
  }

  // 删除用户
  async deleteById(ctx) {
    const user = await userModel.findOneAndRemove(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在！')
    }
    ctx.body = {
      code: 0,
      message: '删除成功！',
    }
  }

  // 密码登录
  async login(ctx) {
    const { body } = ctx.request
    ctx.verifyParams({
      telephone: { type: 'string', required: true },
      password: { type: 'string', required: true }
    })
    // 根据telephone查找用户
    const user = await userModel.findOne({ telephone: body.telephone }).select('+password +nickname +avatar_url +personal_sign')
    if (!user) {
      return ctx.body = {
        errno: 1,
        message: '该用户未注册，快去注册使用吧！'
      }
    }
    // 对密码进行解密处理
    if (!await bcrypt.compare(body.password, user.password)) {
      return ctx.body = {
        errno: 1,
        message: '密码输入错误'
      }
    }
    // 密码账号无误,生成token登录
    const token = jsonwebtoken.sign({
      _id: user._id,
      nickname: body.nickname,
      telephone: body.telephone
    }, config.JWT_SECRET, {
      expiresIn: '3d'
    })
    ctx.body = {
      errno: 0,
      message: '登录成功',
      token,
      id: user._id
    }
  }

  // 短信验证码登录
  async loginByTelephoneCode (ctx) {
    const { body } = ctx.request
    // 查找用户是否注册
    const user = await userModel.findOne({ telephone: body.telephone })
    if (!user) { 
      return ctx.body = {
        errno: 1,
        message: '用户未注册'
      }
    }
    // 已经注册的情况，校验用户传递过来的验证码是否正确
    const is_right_code = `${await getValue('login_' + body.telephone)}` === `${body.code}`
    if (is_right_code) {
      // 密码账号无误,生成token登录
      const token = jsonwebtoken.sign({
        _id: user._id,
        nickname: body.nickname,
        telephone: body.telephone
      }, config.JWT_SECRET, {
        expiresIn: '3d'
      })
      ctx.body = {
        errno: 0,
        message: '登录成功',
        token,
        id: user._id
      }
    } else {
      ctx.body = {
        errno: 1,
        message: '验证码错误'
      }
    }
  }
  
  // 找回密码
  async findBackPassword (ctx) {
    const { body } = ctx.request
    // 判断短信验证码是否有效
    const value = await getValue('find_' + body.telephone) 
    const is_right_code = `${await getValue('find_' + body.telephone)}` === `${body.code}`
    if (is_right_code) {
      // 对密码加密处理
      const password = await bcrypt.hash(body.password, 5)
      const user = await userModel.findOneAndUpdate({ telephone: body.telephone }, { password: password })
      ctx.body = {
        errno: 0,
        message: '密码重置成功'
      }
    } else {
      ctx.body = {
        errno: 1,
        message: '验证码错误'
      }
    }
  }
  
  // 注册
  async register(ctx) {
    const { body } = ctx.request
    // 注册用户数据校验
    ctx.verifyParams({
      telephone: { type: 'string', required: true },
      password: { type: 'string', required: true },
      nickname: { type: 'string', required: true },
      personal_sign: { type: 'string', required: false },
      avatar_url: { type: 'string', required: false }
    })
    try {
      // 先根据用户telephone判断是否存在
      const userByTelephone = await userModel.findOne({
        telephone: body.telephone
      })
      const userByNickname = await userModel.findOne({
        nickname: body.nickname
      })
      if (userByTelephone) {
        return ctx.body = {
          errno: 1,
          message: '此手机号已被注册，可以通过密码登录'
        }
      }
      if (userByNickname) {
        return ctx.body = {
          errno: 1,
          message: '此昵称已被注册，换一个试试吧！'
        }
      }
      // 正常逻辑执行
      body.password = await bcrypt.hash(body.password, 5)
      const user = new userModel({
        ...ctx.request.body,
        avatar_url: avatars[Math.floor(Math.random() * avatars.length)]
      })
      await user.save()
      ctx.body = {
        errno: 0,
        message: '用户注册成功！'
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '用户注册失败！'
      }
    }
  }

  // 上传用户的头像
  async uploadUserAvatar(ctx) {
    const { img_url } = ctx.state
    try {
      const user = await userModel.findByIdAndUpdate(ctx.state.user._id, { avatar_url: img_url }, { new: true })
      ctx.body = {
        errno: 0,
        avatar_url: user.avatar_url,
        message: '头像上传成功'
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '头像上传失败'
      }
    }
  }
  
  // 检查是否是自己，也就是不是自己不能编辑修改操作
  async checkOwner(ctx, next) {
    if (ctx.state.user._id !== ctx.params.id) {
      ctx.throw(403, '没有权限！')
    }
    await next()
  }

  // 检测关注的用户是否存在
  async checkUserExist(ctx, next) {
    const user = await userModel.findById(ctx.params.id)
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    await next()
  }

  // 返回我的关注
  async listFollowing(ctx) {
    const { perpage = 20 } = ctx.query
    const { show_total } = ctx.query
    const perPage = Math.max(perpage * 1, 1)
    // 默认从第一页开始
    const page = Math.max(ctx.query.current_page * 1, 1)
    const user = await userModel.findById(ctx.params.id).select('+following').populate('following')
    
    if (!user) {
      ctx.throw(404, '用户不存在')
    }
    
    // 前端方法的分页实现 slice的效率比splice的高
    let newUser = []
    // 是否展示所有的数据，1表示分页，2表示展示所有的数据
    if (show_total === '1') {
      newUser = user.following.slice((page - 1) * perPage, page * perPage)
    } else {
      newUser = user.following
    }
    const allUsers = await userModel.findById(ctx.params.id).select('+following').populate('following')
    ctx.body = {
      errno: 0,
      data: newUser,
      total: allUsers.following.length
    }
  }

  // 关注用户
  async follow(ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+following')
    if (!user) {
      ctx.throw(404, "用户不存在")
    }
    // 未关注的才能关注
    if (!user.following.map(item => item.toString()).includes(ctx.params.id) && ctx.params.id !== ctx.state.user._id) {
      // 始终让新关注的用户在最前面
      user.following.unshift(ctx.params.id)
      user.save()
    }
    ctx.body = {
      errno: 0,
      message: '关注成功'
    }
  }

  // 取消关注
  async unfollow(ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+following')
    const index = user.following.map(item => item.toString()).indexOf(ctx.params.id)
    if (index > -1) {
      user.following.splice(index, 1)
      user.save()
    }
    ctx.body = {
      errno: 0,
      message: '取消关注成功'
    }
  }

  // 关注我的人,也就是我的粉丝
  async listFollowers(ctx) {
    // 分页
    const { perpage = 20 } = ctx.query
    const perPage = Math.max(perpage * 1, 1)
    const page = Math.max(ctx.query.current_page * 1, 1)
    
    const allUsers = await userModel.find({following: ctx.params.id}) 
    const users = await userModel.find({following: ctx.params.id}).limit(perPage).skip((page - 1) * perPage)
    ctx.body = {
      errno: 0,
      data: users,
      total: allUsers.length
    }
  }

  // 根据用户id获取用户发布的动态
  async getUserDynamicById(ctx) {
    const dynamics = await dynamicModel.find({ publisher: ctx.params.id })
    ctx.body = {
      errno: 0,
      data: dynamics
    }
  }

  // 获取关注的用户的动态
  async getUserDynamicByFollow(ctx) {
    // 获取已登陆用户关注的用户id
    const user = await userModel.findById(ctx.params.id).select('+following').populate('following')
    const followId = []
    user.forEach(item => {
      followId.push(item._id)
    })
    const dynamics = await dynamicModel.find({ publisher: { $in: followId } })
    ctx.body = {
      errno: 0,
      data: dynamics,
      message: '获取成功'
    }
  }
  
  // 用户点过的赞的动态列表
  async listLikeDynamics (ctx) {
    try {
      const user = await userModel.findById(ctx.params.id).select('+likeDynamics').populate('likeDynamics')
      ctx.body = {
        errno: 0,
        data: user.likeDynamics,
        message: '获取点赞列表成功'
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        data: null,
        message: '获取点赞列表失败'
      }
    }
  }
  
  // 动态点赞
  async likeDynamics (ctx) {
    try {
      // 根据id查询用户
      const user = await userModel.findById(ctx.state.user._id).select('+likeDynamics')
      if (!user.likeDynamics.map(item => item.toString()).includes(ctx.params.id)) {
        user.likeDynamics.push(ctx.params.id)
        user.save()
        // 点赞量增加1
        await dynamicModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: 1 } }, { new: true })
      }
      const newDynamic = await dynamicModel.findById(ctx.params.id)
      ctx.body = {
        errno: 0,
        message: '点赞成功',
        data: newDynamic
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '点赞失败',
        err
      }
    }
  }
  
  // 取消动态点赞
  async unlikeDynamics (ctx) {
    try {
      // 根据id查询用户
      const user = await userModel.findById(ctx.state.user._id).select('+likeDynamics')
      const index = user.likeDynamics.indexOf(ctx.params.id)
      if (index > -1) {
        user.likeDynamics.splice(index, 1)
        user.save()
        // dynamics的动态点赞值减少1
        await dynamicModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: -1 } })
      }
      const newDynamic = await dynamicModel.findById(ctx.params.id)
      ctx.body = {
        errno: 0,
        message: '取消点赞成功',
        data: newDynamic
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '取消点赞失败'
      }
    }
  }

  // 动态收藏
  async collectDynamics (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectDynamics')
    // 没有收藏过的段子才能被收藏
    if (!user.collectDynamics.map(item => item.toString()).includes(ctx.params.id)) {
      user.collectDynamics.push(ctx.params.id)
      await user.save()
      await dynamicModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: 1 } })
    }
    ctx.body = {
      errno: 0,
      message: '收藏成功'
    }
  }
  // 动态取消收藏
  async cancelCollectDynamics (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectDynamics')
    const index = user.collectDynamics.indexOf(ctx.params.id)
    if (index > -1) {
      user.collectDynamics.splice(index, 1)
      user.save()
      await dynamicModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: -1 } })
    }
    ctx.body = {
      errno: 0,
      message: '取消收藏成功'
    }
  }

  // 返回指定id的收藏的动态
  async getUserCollectDynamics (ctx) {
    const user = await userModel.findById(ctx.params.id).select('+collectDynamics').populate('collectDynamics')
    ctx.body = {
      errno: 0,
      data: user.collectDynamics,
      message: '数据获取成功'
    }
  }
  
  // 段子点赞
  async likeJoke (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+likeJokes')
    if (!user.likeJokes.map(item => item.toString()).includes(ctx.params.id)) {
      user.likeJokes.push(ctx.params.id)
      await user.save()
      // 根据id更新段子的赞数量
      await jokeModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: 1 } })
    }
    
    ctx.body = {
      errno: 0,
      message: '点赞成功'
    }
  }
  
  // 段子取消赞
  async unlikeJoke (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+likeJokes')
    const index = user.likeJokes.indexOf(ctx.params.id)
    if (index > -1) {
      user.likeJokes.splice(index, 1)
      await user.save()
      await jokeModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: -1 } })
    }
    ctx.body = {
      errno: 0,
      message: '取消赞成功'
    }
  }
  
  // 获取指定id用户的所有点赞的段子
  async getJokeByUserId (ctx) {
    const user = await userModel.findById(ctx.params.id).select('+likeJokes').populate('likeJokes')
    ctx.body = {
      errno: 0,
      data: user.likeJokes
    }
  }

  // 收藏段子
  async collectJoke (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectJokes')
    // 没有收藏过的段子才能被收藏
    if (!user.collectJokes.map(item => item.toString()).includes(ctx.params.id)) {
      user.collectJokes.push(ctx.params.id)
      await user.save()
      await jokeModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: 1 } })
    }
    ctx.body = {
      errno: 0,
      message: '收藏成功'
    }
  }
  
  // 取消收藏段子
  async cancelCollectJoke (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectJokes')
    const index = user.collectJokes.indexOf(ctx.params.id)
    if (index > -1) {
      user.collectJokes.splice(index, 1)
      user.save()
      await jokeModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: -1 } })
    }
    ctx.body = {
      errno: 0,
      message: '取消收藏成功'
    }
  }
  
  // 根据id获取用户收藏的段子
  async getCollectJokeById (ctx) {
    const user = await userModel.findById(ctx.params.id).select('+collectJokes').populate('collectJokes')
    ctx.body = {
      errno: 0,
      data: user.collectJokes,
      message: '数据获取成功'
    }
  }
  
  // 诗词点赞
  async likePoem (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+likePoems')
    if (!user.likePoems.map(item => item.toString()).includes(ctx.params.id)) {
      user.likePoems.push(ctx.params.id)
      await user.save()
      await poemModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: 1 } })
    }
    ctx.body = {
      errno: 0,
      message: '点赞成功'
    }
  }
  
  // 诗词取消赞
  async unlikePoem (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+likePoems')
    const index = user.likePoems.indexOf(ctx.params.id)
    if (index > -1) {
      user.likePoems.splice(index, 1)
      await user.save()
      await poemModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: -1 } })
    }
    ctx.body = {
      errno: 0,
      message: '取消点赞成功'
    }
  }
  
  // 收藏诗词
  async collectPoem (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectPoems')
    if (!user.collectPoems.map(item => item.toString()).includes(ctx.params.id)) {
      user.collectPoems.push(ctx.params.id)
      await user.save()
      await poemModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: 1 } })
    }
    ctx.body = {
      errno: 0,
      message: '收藏成功'
    }
  }
  
  // 取消收藏诗词
  async cancelCollectPoem (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectPoems')
    const index = user.collectPoems.indexOf(ctx.params.id)
    if (index > -1) {
      user.collectPoems.splice(index, 1)
      await user.save()
      await poemModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: -1 } })
    }
    ctx.body = {
      errno: 0,
      message: '取消收藏成功'
    }
  }
  
  // 根据用户id获取该用户下面所有点赞过的诗词
  async getLikePomesByUserId (ctx) {
    const user = await userModel.findById(ctx.params.id).select('+likePoems').populate('likePoems')
    ctx.body = {
      errno: 0,
      data: user.likePoems,
      message: '获取成功'
    }
  }
  
  // 根据用户id获取该用户下面所有收藏过的诗词
  async getCollectPoemsByUserId (ctx) {
    const user = await userModel.findById(ctx.params.id).select('+collectPoems').populate('collectPoems')
    ctx.body = {
      errno: 0,
      data: user.collectPoems,
      message: '获取成功'
    }
  }
  
  // 成语点赞
  async likeWord (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+likeWords')
    if (!user.likeWords.map(item => item.toString()).includes(ctx.params.id)) {
      user.likeWords.push(ctx.params.id)
      await user.save()
      await wordModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: 1 } })
    }
    ctx.body = {
      errno: 0,
      message: '点赞成功'
    }
  }
  
  // 成语取消赞
  async unlikeWord (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+likeWords')
    const index = user.likeWords.indexOf(ctx.params.id)
    if (index > -1) {
      user.likeWords.splice(index, 1)
      await user.save()
      await wordModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: -1 } })
    }
    ctx.body = {
      errno: 0,
      message: '取消点赞成功'
    }
  }
  
  // 收藏成语
  async collectWord (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectWords')
    if (!user.collectWords.map(item => item.toString()).includes(ctx.params.id)) {
      user.collectWords.push(ctx.params.id)
      await user.save()
      await wordModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: 1 } })
    }
    ctx.body = {
      errno: 0,
      message: '收藏成功'
    }
  }
  
  // 取消收藏成语
  async cancelCollectWord (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectWords')
    const index = user.collectWords.indexOf(ctx.params.id)
    if (index > -1) {
      user.collectWords.splice(index, 1)
      await user.save()
      await wordModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: -1 } })
    }
    ctx.body = {
      errno: 0,
      message: '取消收藏成功'
    }
  }
  
  // 根据用户id返回用户点赞过的所有成语
   async getLikeWordsByUserId (ctx) {
     const user = await userModel.findById(ctx.params.id).select('+likeWords').populate('likeWords')
     ctx.body = {
       errno: 0,
       data: user.likeWords,
       message: '获取成功'
     }
   }
   
  // 根据用户id返回用户收藏过的所有成语
  async getCollectWordsByUserId (ctx) {
    const user = await userModel.findById(ctx.params.id).select('+collectWords').populate('collectWords')
    ctx.body = {
      errno: 0,
      data: user.collectWords,
      message: '获取成功'
    }
  }

  // 文章点赞
  async likeArticle (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+likeArticles')
    if (!user.likeArticles.map(item => item.toString()).includes(ctx.params.id)) {
      user.likeArticles.push(ctx.params.id)
      await user.save()
      await articleModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: 1 } })
    }
    ctx.body = {
      errno: 0,
      message: '点赞成功'
    }
  }
  
  // 文章取消赞
  async unlikeArticle (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+likeArticles')
    const index = user.likeArticles.indexOf(ctx.params.id)
    if (index > -1) {
      user.likeArticles.splice(index, 1)
      await user.save()
      await articleModel.findByIdAndUpdate(ctx.params.id, { $inc: { zan_number: -1 } })
    }
    ctx.body = {
      errno: 0,
      message: '取消点赞成功'
    }
  }
  
  // 文章收藏
  async collectArticle (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectArticles')
    if (!user.collectArticles.map(item => item.toString()).includes(ctx.params.id)) {
      user.collectArticles.push(ctx.params.id)
      await user.save()
      await articleModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: 1 } })
    }
    ctx.body = {
      errno: 0,
      message: '收藏成功'
    }
  }
  
  // 文章取消收藏
  async cancelCollectArticle (ctx) {
    const user = await userModel.findById(ctx.state.user._id).select('+collectArticles')
    const index = user.collectArticles.indexOf(ctx.params.id)
    if (index > -1) {
      user.collectArticles.splice(index, 1)
      await user.save()
      await articleModel.findByIdAndUpdate(ctx.params.id, { $inc: { collect_number: -1 } })
    }
    ctx.body = {
      errno: 0,
      message: '取消收藏成功'
    }
  }
  
  // 根据用户id返回用户点赞过的所有文章
  async getLikeArticlesByUserId (ctx) {
    const user = await userModel.findById(ctx.params.id).select('+likeArticles').populate('likeArticles')
    ctx.body = {
      errno: 0,
      data: user.likeArticles
    }
  }
  
  // 根据用户id返回用户收藏过的所有文章
  async getCollectArticlesByUserId (ctx) {
    const user = await userModel.findById(ctx.params.id).select('+collectArticles').populate('collectArticles')
    ctx.body = {
      errno: 0,
      data: user.collectArticles,
    }
  }
}

module.exports = new UserController()
