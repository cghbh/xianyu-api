function getClientIP (ctx) {
  let ip= ctx.headers['x-forwarded-for'] || // 判断是否有反向代理 IP
    req.ip  ||
    req.connection.remoteAddress || // 判断 connection 的远程 IP
    req.socket.remoteAddress || // 判断后端的 socket 的 IP
    req.connection.socket.remoteAddress || ''
  if(ip) {
    ip = ip.replace('::ffff:', '')
  }
  return ip
}

const getClientIPMidware = async (ctx, next) => {
  const ip = getClientIP(ctx) 
  fs.appendFile('./ip.txt', `${ip}` + '\n', (err, data) => {
    console.log(err, data, '错误')
  })
  await next()
}

module.exports = getClientIPMidware