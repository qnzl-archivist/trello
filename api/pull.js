const Trello = require(`trello`)

const {
  TRELLO_KEY,
} = process.env

module.exports = async (req, res) => {
  const [ type, auth ] = req.headers[`authorization`].split(` `)

  if (!type && !auth) {
    return res.sendStatus(401)
  }

  const [ token ] = Buffer.from(auth, `base64`).toString(`utf8`).split(`:`)

  if (!token) {
    return res.sendStatus(401)
  }

  const trello = new Trello(TRELLO_KEY, token)

  const boards = await trello.getBoards(`me`)

  let cards = boards.map((board) => {
    return trello.getCardsOnBoard(board.id)
  })

  const resolvedCards = await Promise.all(cards)

  const boardsWithCards = boards.map((board, index) => {
    board.cards = resolvedCards[index]

    return board
  })

  return res.json({ [`yourBoards`]: boardsWithCards })
}
