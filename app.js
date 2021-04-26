const Koa = require('koa')

const path = require('path')
const router = require('./router/index.js')
const helmet = require('koa-helmet')
const statics = require('koa-static')
const body = require('koa-body')
const cors = require('@koa/cors')
const error = require('koa-json-error')
// 数据格式校验中间件
const parameter = require('koa-parameter')
// 文件格式输出的中间件记录
const { accessLogger, systemLogger } = require('./utils/log4.js')
const app = new Koa()
// 控制生产环境下的错误堆栈输出显示
app.use(error({
  postFormat: (e, { stack, ...rest }) => process.env.NODE_ENV === 'production' ? { ...rest } : { ...rest }
}))

app.use(accessLogger())

app.use(helmet())

app.use(cors())

app.use(body({
  multipart: true,
  formidable: {
    // 上传到public的uploads目录下
    uploadDir: path.join(__dirname, '/public/uploads'),
    keepExtensions: true
  }
}))

// 传入app挂载全局上下文对象
app.use(parameter(app))

// 静态文件访问
app.use(statics(path.join(__dirname, '/public')))
app.use(router())

app.listen(3001)
