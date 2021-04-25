const subjectModel = require('../models/subject.js')

// 返回指定个数的随机数组
function getRandomArray (array, rangeNumber) {
  // 防止超过数组的长度
  rangeNumber = rangeNumber > array.length ? array.length: rangeNumber
  // 拷贝原数组进行操作就不会破坏原数组
  const copyArray = [].concat(array)
  const newArray = []
  for (let i = 0; i < rangeNumber; i++) {
    const index = Math.floor(Math.random() * (copyArray.length))
    newArray.push(copyArray[index])
    // 在原数组删掉，然后在下轮循环中就可以避免重复获取
    copyArray.splice(index, 1)
  }
  return newArray
}

class SubjectController {
  // 返回所有的题目
  async listSubjects (ctx) {
    const subjects = await subjectModel.find()
    ctx.body = {
      errno: 0,
      data: subjects,
      total: subjects.length
    }
  }
  
  // 根据题目的id返回题目的详细内容
  async listSubjectById (ctx) {
    const subject = await subjectModel.findById(ctx.params.s_id)
    ctx.body = {
      errno: 0,
      data: subject
    }
  }
  
  // 检查题目是否存在
  async checkSubjectExist (ctx, next) {
    const subject = await subjectModel.findById(ctx.params.s_id).select('+publisher')
    if (!subject) { 
      ctx.body = { 
        errno: 1, 
        message: '题目不存在' 
      }
    } else {
      ctx.state.subject = subject
      await next()
    }
  }
  
  // 操作权限检查
  async checkSubjectOwner (ctx, next) {
    if (ctx.state.user._id !== ctx.state.subject.publisher.toString()) { 
      ctx.body = {
        errno: 1,
        message: '没有操作的权限'
      }
    }  else {
      await next()
    }
  }
  
  // 添加题目的不由question_options决定，而是由用户传递过来的选项合并组成
  async addSubject (ctx) {
    ctx.verifyParams({
      question_title: { type: 'string', required: true },
      question_answer: { type: 'string', required: true }
    })
    const { body } = ctx.request
    // 先判断题目是否存在
    const oldSubject = await subjectModel.findOne({ question_title: body.question_title })
    if (oldSubject) {
      return ctx.body = {
        errno: 1,
        message: '该题目已存在，请勿重复添加！'
      }
    }
    const subject = new subjectModel({ publisher: ctx.state.user._id, question_title: body.question_title, question_answer: body.question_answer, question_options: [{option: 'A', option_title: body.option_a }, {option: 'B', option_title: body.option_b }, {option: 'C', option_title: body.option_c }, {option: 'D', option_title: body.option_d }] })
    await subject.save()
    ctx.body = {
      errno: 0,
      message: '创建成功'
    }
  }
  
  // 删除题目
  async deleteSubject (ctx) {
    await subjectModel.findByIdAndRemove(ctx.params.s_id)
    ctx.body = {
      errno: 0,
      message: '删除成功'
    }
  }
  
  // 修改题目
  async editSubject (ctx) {
    const { body } = ctx.request
    await subjectModel.findByIdAndUpdate(ctx.params.s_id, { question_title: body.question_title, question_answer: body.question_answer, question_options: [{option: 'A', option_title: body.option_a }, {option: 'B', option_title: body.option_b }, {option: 'C', option_title: body.option_c }, {option: 'D', option_title: body.option_d }] })
    ctx.body = {
      errno: 0,
      message: '修改成功'
    }
  }
  
  // 随机返回8个题目
  async backSubjectRandom (ctx) {
    const subjects = await subjectModel.find()
    const randomArray = getRandomArray(subjects, 8)
    ctx.body = {
      errno: 0, 
      data: randomArray
    }
  }
}

module.exports = new SubjectController()
