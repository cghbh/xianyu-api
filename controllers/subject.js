const subjectModel = require('../models/subject.js')

class SubjectController {
  // 返回所有的题目
  async listSubjects (ctx) {
    const subjects = await subjectModel.find()
    ctx.body = {
      errno: 0,
      data: subjects
    }
  }
  
  // 根据题目的id返回题目的详细内容
  async listSubjectById (ctx) {}
  
  // 检查题目是否存在
  async checkSubjectExist (ctx) {}
  
  // 操作权限检查
  async checkSubjectOwner (ctx) {}
  
  // 添加题目
  // 添加题目的不由question_options决定，而是由用户传递过来的选项合并组成
  async addSubject (ctx) {
    ctx.verifyParams({
      question_title: { type: 'string', required: true },
      question_answer: { type: 'string', required: true }
    })
    
    const subject = new subjectModel({ publisher: ctx.state.user._id, question_title: ctx.request.body.question_title, question_answer: ctx.request.body.question_answer, question_options: [{option_id: 'A', option_title: '选项A' }, {option_id: 'B', option_title: '选项B' }, {option_id: 'C', option_title: '选项C' }, {option_id: 'D', option_title: '选项D' }] })
    await subject.save()
    ctx.body = {
      errno: 0,
      message: '创建成功'
    }
  }
  
  // 删除题目
  async deleteSubject (ctx) {}
  
  // 编辑题目
  async editSubject (ctx) {}
  
  // 添加用户已经回答的题目，在用户界面完成之后附带传送过来
  addSubjectUserDone (ctx) {
    
  }
}

module.exports = new SubjectController()