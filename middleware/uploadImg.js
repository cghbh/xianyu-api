// 图片上传中间件，使用阿里云oss上传图片，返回图片的url，再由下一个中间件决定存储的表
const path = require('path')
const OSS = require('ali-oss')

const fs = require('fs')
const config = require('../../secret.js')

// 配置阿里云oss
const ossClient = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  bucket: 'xianyu-uploads',
  secure: true
})

const uploadimg = async (ctx, next) => {
  
  const file = ctx.request.files.file
  const basename = path.basename(file.path)
 
  const url = `${ctx.origin}/uploads/${basename}`
  // 上传本地文件到阿里云对象存储
  const result = await ossClient.put(basename, path.join(__dirname, '../public/uploads/', basename))
  // 上传成功之后删除本地的文件
  await fs.unlink(path.join(__dirname, '../public/uploads/', basename), (err, res) => {
    if (err) ctx.throw('405', '文件删除失败')
  })
  // 将数据传递给下一个中间件
  ctx.state.img_url = result.url
  await next()
}

module.exports = uploadimg