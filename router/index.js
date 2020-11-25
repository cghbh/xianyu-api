const combineRouters = require('koa-combine-routers')
const usersRouter = require('./user.js')
const dynamicRouter = require('./dynamic.js')
const homeRouter = require('./home.js')
const swiperRouter = require('./swiper.js')
const commentRouter = require('./comment.js')
const jokeRouter = require('./joke.js')
const poemRouter = require('./poem.js')
const wordRouter = require('./word.js')
const articleRouter = require('./article.js')
const subjectRouter = require('./subject.js')
const router = combineRouters(
  usersRouter,
  dynamicRouter,
  homeRouter,
  swiperRouter,
  commentRouter,
  jokeRouter,
  poemRouter,
  wordRouter,
  articleRouter,
  subjectRouter
)
module.exports = router