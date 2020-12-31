const commentModel = require('../models/comment')
const dynamicModel = require('../models/dynamic')
const userModel = require('../models/users.js')
const { use } = require('../router/comment')

class CommentController {
  // 获取指定动态下面的所有评论
  async commentList (ctx) {
    // sort表示排序，默认是按照评论的点赞量排序，否则是最新的排序
    const dynamicId = ctx.params.id
    const { sort } = ctx.query
    let comments = []
    if (sort === '1') {
      comments = await commentModel.find({ dynamic_id: dynamicId }).sort({ zan_number: 'desc' }).populate({
        path: 'commentator second_comment',
        populate: {
          path: 'commentator reply_to'
        }
      })
    } else if (sort === '0') {
      comments = await commentModel.find({ dynamic_id: dynamicId }).sort({ createdAt: 'desc' }).populate({
        path: 'commentator second_comment',
        populate: {
          path: 'commentator reply_to'
        }
      })
    }
    
    ctx.body = {
      errno: 0,
      data: comments,
    }
  }
  
  // 添加动态的评论
  async addComment (ctx) {
    // 获取动态的id和作者的id
    const commentator = ctx.state.user._id
    const dynamic_id = ctx.params.id
    const { body } = ctx.request
    const { root_comment_id, reply_to, content } = ctx.request.body
    // 是根评论的二级评论
    if (root_comment_id && reply_to) {
      const comment = await commentModel.findById(root_comment_id)
      comment.second_comment.unshift({ ...body, dynamic_id, createdAt: new Date(), commentator })
      comment.save()
      // 动态的评论数量递增
      await dynamicModel.findByIdAndUpdate(dynamic_id, { $inc: { comment_number: 1 } })

      ctx.body = {
        errno: 0,
        message: '评论成功'
      }
    } else {
      const comment = new commentModel({ commentator, dynamic_id, ...body })
      await comment.save()
      await dynamicModel.findByIdAndUpdate(dynamic_id, { $inc: { comment_number: 1 } })
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

  // 负责校验一级评论和二级评论是否存在，否则不能点赞操作
  async checkCommentExit (ctx, next) {
    const root_comment_id = ctx.query.root_comment_id
    const second_id = ctx.query.second_id
    const rootComment = await commentModel.findById(root_comment_id)

    if (!rootComment) {
      return ctx.body = {
        errno: 1,
        message: '该一级评论不存在'
      }
    }
    // 给二级评论点赞的情况
    if (second_id) {
      const secondComment = rootComment.second_comment
      const tag = secondComment.find(item => item._id.toString() === second_id)
      if (!tag) {
        return ctx.body = {
          errno: 1,
          message: '该二级评论不存在'
        }
      } else {
        ctx.state.secondComment = tag
        ctx.state.rootComment = rootComment
      }
    } else {
      // 给一级评论点赞的情况
      ctx.state.rootComment = rootComment
    }
    await next()
  }

  // 动态的评论点赞，分为一级评论和二级评论点赞
  async likeDynamicComments (ctx) {
    // 二级评论的id
    const second_id = ctx.query.second_id
    console.log(second_id, 'o-id')
    // 一级评论的id
    const rootCommendId = ctx.query.root_comment_id
    const user = await userModel.findById(ctx.state.user._id).select('+zanDynamicComments')
    // 如果有二级评论，说明评论id应该存储二级评论，否则存储一级评论的id
    if (second_id) {
      // 没有二级评论才能正常操作
      if (!user.zanDynamicComments.map(item => item.toString()).includes(second_id)) {
        user.zanDynamicComments.push(second_id)
        await user.save()
        const targetSecondComment = ctx.state.rootComment.second_comment.find(item => item._id.toString() === second_id)
        let zan_number = targetSecondComment.zan_number
        // 找到二级子评论的内容，使点赞数自增1
        await commentModel.updateOne({ 'second_comment._id': second_id }, { '$set' : {'second_comment.$.zan_number': ++zan_number}})
        const newResult = await commentModel.findById(rootCommendId)
        const newSecondComment = newResult.second_comment.find(item => item._id.toString() === second_id)
        ctx.body = {
          errno: 0,
          message: '点赞成功',
          comment: newSecondComment
        }
      } else {
        ctx.body = {
          errno: 1,
          message: '已经点过赞了'
        }
      }
    } else {
      // 一级评论的点赞操作
      if (!user.zanDynamicComments.map(item => item.toString()).includes(rootCommendId)) {
        user.zanDynamicComments.push(rootCommendId)
        await user.save()
        // 一级评论的点赞量自增1
        await commentModel.findByIdAndUpdate(rootCommendId, { $inc: { zan_number: 1 } }, { new: true })
        const newComment = await commentModel.findById(rootCommendId)
        ctx.body = {
          errno: 0,
          message: '点赞成功',
          comment: newComment
        }
      } else {
        ctx.body = {
          errno: 1,
          message: '已经点过赞了'
        }
      }
    }
  }

  // 动态的评论取消点赞
  async unlikeDynamicComments (ctx) {
    // 二级评论的id
    const second_id = ctx.query.second_id
    console.log(second_id, 'sid')
    // 一级评论的id
    const rootCommendId = ctx.query.root_comment_id
    const user = await userModel.findById(ctx.state.user._id).select('+zanDynamicComments')
    // 如果有二级评论，说明评论id应该存储二级评论，否则存储一级评论的id
    if (second_id) {
      // 没有二级评论才能正常操作
      const index = user.zanDynamicComments.indexOf(second_id)
      if (index > -1) {
        user.zanDynamicComments.splice(index, 1)
        user.save()
        // dynamics的动态点赞值减少1
        const targetSecondComment = ctx.state.rootComment.second_comment.find(item => item._id.toString() === second_id)
        let zan_number = targetSecondComment.zan_number
        // 找到二级子评论的内容，使点赞数自增1
        await commentModel.updateOne({ 'second_comment._id': second_id }, { '$set' : {'second_comment.$.zan_number': --zan_number}})
        const newResult = await commentModel.findById(rootCommendId)
        const newSecondComment = newResult.second_comment.find(item => item._id.toString() === second_id)
        ctx.body = {
          errno: 0,
          message: '取消点赞成功',
          comment: newSecondComment
        }
      } else {
        ctx.body = {
          errno: 1,
          message: '还没有点赞过哟'
        }
      }
    } else {
      // 一级评论的取消点赞操作
      const user = await userModel.findById(ctx.state.user._id).select('+zanDynamicComments')
      const index = user.zanDynamicComments.indexOf(rootCommendId)
      if (index > -1) {
        user.zanDynamicComments.splice(index, 1)
        user.save()
        // dynamics的动态点赞值减少1
        await commentModel.findByIdAndUpdate(rootCommendId, { $inc: { zan_number: -1 } })
        const newComment = await commentModel.findById(rootCommendId)
        ctx.body = {
          errno: 0,
          message: '取消点赞成功',
          comment: newComment
        }
      } else {
        ctx.body = {
          errno: 1,
          message: '还没有点赞过哟'
        }
      }
    }
  }
}

module.exports = new CommentController()