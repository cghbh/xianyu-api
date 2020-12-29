const commentModel = require('../models/comment')
const dynamicModel = require('../models/dynamic')

class CommentController {
  // 获取指定动态下面的所有评论
  async commentList (ctx) {
    // const dynamic_id = ctx.params.dynamicId
    // // 路由上面是否有根节点评论id，如果有的话查询二级评论
    // const root_comment_id = ctx.query.root_comment_id
    // const reply_to = ctx.query.reply_to
    // const comments = await commentModel.find({ dynamic_id }).sort({ createdAt: '-1' }).populate('commentator reply_to')
    // ctx.body = {
    //   errno: 0,
    //   data: comments
    // }
    const dynamicId = ctx.params.id
    const comments = await commentModel.find({ dynamic_id: dynamicId }).sort({ createdAt: '-1' }).populate({
      path: 'commentator second_comment',
      populate: {
        path: 'commentator reply_to'
      }
    })
    ctx.body = {
      errno: 0,
      data: comments
    }
  }
  
  // 获取指定评论的一级评论和二级评论的数据
  // 获取所有的一级评论和二级评论数据
  async commentListAll (ctx) {}
  
  // 添加动态的评论
  async addComment (ctx) {
    // 获取动态的id和作者的id
    const commentator = ctx.state.user._id
    const dynamic_id = ctx.params.id
    const { body } = ctx.request
    // console.log(body, 'body')
    const { root_comment_id, reply_to, content } = ctx.request.body
    if (root_comment_id && reply_to) {
      const comment = await commentModel.findById(root_comment_id)
      comment.second_comment.push({ ...body, dynamic_id, createdAt: new Date(), commentator })
      comment.save()
      ctx.body = {
        errno: 0,
        message: '评论成功'
      }
    } else {
      const comment = new commentModel({ commentator, dynamic_id, ...body })
      await comment.save()
      ctx.body = {
        errno: 0,
        message: '评论成功'
      }
    }
  }
  // 删除动态的评论，需要判断删除的人是否是发布评论的人
  async deleteComment (ctx) {
    const comment = await commentModel.findByIdAndRemove(ctx.params.cId)
    ctx.body = {
      errno: 0,
      message: '删除成功'
    }
  }
}

module.exports = new CommentController()