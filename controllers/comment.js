const commentModel = require('../models/comment')
const dynamicModel = require('../models/dynamic')

class CommentController {
  // 获取指定动态下面的所有评论
  async commentList (ctx) {
    const dynamic_id = ctx.params.dynamicId
    // 路由上面是否有根节点评论id，如果有的话查询二级评论
    const root_comment_id = ctx.query.root_comment_id
    console.log(root_comment_id, 'root')
    const comments = await commentModel.find({ dynamic_id }).sort({ createdAt: '-1' }).populate('commentator reply_to')
    ctx.body = {
      errno: 0,
      data: comments
    }
  }
  
  // 获取指定评论的一级评论和二级评论的数据
  // 获取所有的一级评论和二级评论数据
  async commentListAll (ctx) {}
  
  // 检查动态是否存在的中间件
  async checkCommentExist (ctx, next) {
    const dynamic = await dynamicModel.findById(ctx.params.dynamicId)
    if (!dynamic) { ctx.throw(404, '动态不存在')}
    await next()
  }
  
  // 添加动态的评论
  async addComment (ctx) {
    // 获取动态的id和作者的id
    const commentator = ctx.state.user._id
    
    console.log(commentator, '评论人')
    console.log(ctx.state, 'state')
    const dynamic_id = ctx.params.dynamicId
    const { body } = ctx.request
    try {
      const comment = new commentModel({ commentator, dynamic_id, ...body })
      await comment.save()
      ctx.body = {
        errno: 0,
        message: '评论成功'
      }
    } catch (err) {
      console.log(err, 'err')
      ctx.body = {
        errno: 1,
        message:'评论失败'
      }
    }
  }
  // 删除动态的评论，需要判断删除的人是否是发布评论的人
}

module.exports = new CommentController()