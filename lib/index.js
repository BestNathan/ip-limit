const ioredis = require('ioredis')

/**
 * 
 * @param {String} ip 
 */
const parseIp = ip => {
    return ip.replace(/f/g, '').replace(/:/g, '')
}

const middleware = ({
    port,
    host,
    options
}) => {
    const redis = new ioredis(port, host, options)
    redis.on('error', e => {
        throw e
    })
    redis.on('connect', () => {
        console.log('redis connected')
    })
    return async (ctx, next) => {
        let ip = parseIp(ctx.ip)
        if (ip == '127.0.0.1') {
            return await next()
        }
        let num = await redis.incr(ip)
        console.log(`${ip} - ${num}`)
        if (num <= 10) {
            redis.pexpire(ip, 600)
            return await next()
        } else if (num <= 30) {
            redis.pexpire(ip, 3000)
            return await next()
        } else {
            redis.pexpire(ip, 300000)
            ctx.status = 403
            ctx.body = 'ip has been recorded, please retry after 5 minutes!'
        }
    }
}

module.exports = middleware