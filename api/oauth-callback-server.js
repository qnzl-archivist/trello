const { promisify } = require(`util`)
const redis = require(`redis`)

const {
  TRELLO_KEY,
  REDIS_URL,
} = process.env

module.exports = async (req, res) => {
  const { id } = req.query
  const { token } = req.body

  const redisClient = redis.createClient()

  const message = JSON.stringify({
    id,
    accessToken: token,
  })

  const pubAsync = promisify(redisClient.publish).bind(redisClient)

  const pubMessage = await pubAsync(`oauthCallback`, message)

  if (pubMessage === 0) {
    console.log(`failed to publish OAuth token`)
  }

  return res.end()
}
