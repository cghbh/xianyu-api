const mongoose = require('mongoose')
const config = require('../../secret.js')

mongoose.set('useFindAndModify', false)

// 根据环境判断使用数据库
if (process.env.NODE_ENV === 'development') {
  mongoose.connect(config.DB_URL_DEV, {  useNewUrlParser: true, useUnifiedTopology: true })
} else {
  mongoose.connect(config.DB_URL_PROD, {  useNewUrlParser: true, useUnifiedTopology: true })
}


// 连接成功
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection open to ' + config.DB_URL_PROD)
})

// 连接异常
mongoose.connection.on('error', (err) => {
  console.log('Mongoose connection error: ' + err)
})

// 断开连接
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected')
})

module.exports = mongoose