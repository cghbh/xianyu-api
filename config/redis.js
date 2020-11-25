const redis = require('redis')
const { promisifyAll } = require('bluebird')

const options = {
  host: '127.0.0.1',
  port: 6379,
  detect_buffers: true,
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
}

const client = promisifyAll(redis.createClient(options))

// 连接Redis
client.on('error', (err) => {
  console.log('Redis Client Error:' + err)
})

// 设置值
const setValue = (key, value, time) => {
  if (typeof value === 'undefined' || value == null || value === '') {
    return
  }
  if (typeof value === 'string') {
    if (typeof time !== 'undefined') {
      // EX过期时间为秒级，PX为毫秒级
      client.set(key, value, 'EX', time)
    } else {
      client.set(key, value)
    }
  } else if (typeof value === 'object') {
    Object.keys(value).forEach((item) => {
      client.hset(key, item, value[item], redis.print)
    })
  }
}

// 获取值
const getValue = (key) => {
  return client.getAsync(key)
}

const getHValue = (key) => {
  return client.hgetallAsync(key)
}

const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete successfully');
    } else {
      console.log('delete redis key error:' + err)
    }
  })
}

module.exports = {
  client,
  setValue,
  getValue,
  getHValue,
  delValue
}