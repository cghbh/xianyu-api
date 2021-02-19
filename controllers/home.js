const path = require('path')
const svgCaptcha = require('svg-captcha')
const fs = require('fs')
const { setValue, getValue } = require('../config/redis.js')
const userModel = require('../models/users.js')
const config = require('../../secret.js')

const Core = require('@alicloud/pop-core')

const client = new Core({
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  endpoint: 'https://dysmsapi.aliyuncs.com',
  apiVersion: '2017-05-25'
})


class HomeController {
  // 文件上传需要区分场景？
  async upload (ctx) {
    ctx.body = {
      errno: 0,
      msg: '文件上传成功'
    }
  }
  
  // 获取图形验证码
  async captcha (ctx) {
    const svg = svgCaptcha.create({
      size: 4,
      noise: 1,
      background: '#fff',
      width: '120'
    })
    ctx.body = {
      errno: 0,
      data: svg
    }
  }
  
  // 注册验证码，格式register_电话号码
  async getCodeByTelephoneReg (ctx) {
    const { telephone } = ctx.request.body
    const user = await userModel.findOne({ telephone })
    if (user) {
      return ctx.body = {
        errno: 1,
        message: '该用户已经注册过了，快去登录吧'
      }
    }
    
    const randomCode = Math.floor(Math.random() * 899999) + 100000
    const params = {
      "RegionId": "cn-hangzhou",
      "PhoneNumbers": telephone,
      "SignName": "闲语注册",
      "TemplateCode": "SMS_209196082",
      "TemplateParam": `{ \"code\": ${randomCode} }`
    }
    
    const requestOption = { method: 'POST' }
    
    try {
      const result = await client.request('SendSms', params, requestOption)
      const {Code }= result
      if (Code === 'OK') {
        // 验证码发送成功之后，将当前telephone存储到redis中
        setValue('register_' + telephone, `${randomCode}`, 10 * 60)
        ctx.body = {
          errno: 0,
          message: '验证码发送成功'
        }
      } else {
        ctx.body = {
          errno: 1,
          message: '验证码发送失败'
        }
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '验证码发送失败'
      }
    }
  }
  
  // 登录验证码，格式login_电话号码,判断用户是否注册
  async getCodeByTelephoneLogin (ctx) {
    const { telephone } = ctx.request.body
    const user = await  userModel.findOne({ telephone })
    if (!user) {
      return ctx.body = {
        errno: 1,
        message: '该用户还未注册，快去注册吧'
      }
    }
    
    const randomCode = Math.floor(Math.random() * 899999) + 100000
    
    const params = {
      "RegionId": "cn-hangzhou",
      "PhoneNumbers": telephone,
      "SignName": "闲语登陆",
      "TemplateCode": "SMS_209196083",
      "TemplateParam": `{ \"code\": ${randomCode} }`
    }
    
    const requestOption = { method: 'POST' }
    
    try {
      const result = await client.request('SendSms', params, requestOption)
      const {Code }= result
      if (Code === 'OK') {
        // 验证码发送成功之后，将当前telephone存储到redis中
        setValue('login_' + telephone, `${randomCode}`, 10 * 60)
        ctx.body = {
          errno: 0,
          message: '验证码发送成功'
        }
      } else {
        ctx.body = {
          errno: 1,
          message: '验证码发送失败'
        }
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '验证码发送失败'
      }
    }
  }
  
  // 找回密码的验证码，格式find_电话号码，先判断用户是否注册
  async getCodeByTelephoneFind (ctx) {
    const { telephone } = ctx.request.body
    const user = await userModel.findOne({ telephone: telephone })
    // 没有注册的用户
    if (!user) {
      return ctx.body = {
        errno: 1,
        message: '该用户还未注册，快去注册吧'
      }
    }
    const randomCode = Math.floor(Math.random() * 899999) + 100000

    const params = {
      "RegionId": "cn-hangzhou",
      "PhoneNumbers": telephone,
      "SignName": "闲语密码重置",
      "TemplateCode": "SMS_209161130",
      "TemplateParam": `{ \"code\": ${randomCode} }`
    }
    
    const requestOption = { method: 'POST' }
    
    try {
      const result = await client.request('SendSms', params, requestOption)
      const {Code }= result
      if (Code === 'OK') {
        // 验证码发送成功之后，将当前telephone存储到redis中
        setValue('find_' + telephone, `${randomCode}`, 10 * 60)
        ctx.body = {
          errno: 0,
          message: '验证码发送成功'
        }
      } else {
        ctx.body = {
          errno: 1,
          message: '验证码发送失败'
        }
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '验证码发送失败'
      }
    }
  }
  
  // 验证码校验
  async checkTelephoneCode (ctx) {
    const { telephone, code } = ctx.request.body
    try {
      const redisCode = await getValue(`${telephone}`)
      if (`${redisCode}` === `${code}`) {
        ctx.body = {
          errno: 0,
          message: '验证码正确'
        }
      } else {
        ctx.body = {
          errno: 1,
          message: '验证码错误'
        }
      }
    } catch (err) {
      ctx.body = {
        errno: 1,
        message: '验证码错误'
      }
    }
  }
}

module.exports= new HomeController()