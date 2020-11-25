const errorHandle = (ctx, next) => {
  return next().catch((err) => {
    if (401 == err.status) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        msg: '用户没有权限'
      }
    } else {
      throw err
    }
  })
}
module.exports = errorHandle