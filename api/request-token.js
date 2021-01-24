const {
  TRELLO_KEY,
  TRELLO_TOKEN_NAME,
  TRELLO_CALLBACK,
} = process.env

module.exports = (req, res) => {
  if (!TRELLO_TOKEN_NAME) {
    throw new Error(`TRELLO_TOKEN_NAME isn't set`)
  }

  const returnUrl = encodeURI(`${TRELLO_CALLBACK}/oauth-callback?id=123`)

  const url = `https://trello.com/1/authorize?expiration=${req.query.exp || `30days`}&name=${TRELLO_TOKEN_NAME}&scope=read&response_type=token&key=${TRELLO_KEY}&callback_method=fragment&return_url=${returnUrl}`

  return res.redirect(url)
}
