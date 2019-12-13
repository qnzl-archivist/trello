const Trello = require(`trello`)
const auth = require(`@qnzl/auth`)

const { CLAIMS } = auth

const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN)

module.exports = async (req, res) => {
  const {
    authorization
  } = req.headers

  const isTokenValid = auth.checkJWT(authorization, CLAIMS.trello.dump, `watchers`, process.env.ISSUER)

  if (!isTokenValid) {
    return res.status(401).send()
  }

  const boards = await trello.getBoards(req.query.org || `me`)

  let cards = boards.map((board) => {
    return trello.getCardsOnBoard(board.id)
  })

  const resolvedCards = await Promise.all(cards)

  const boardsWithCards = boards.map((board, index) => {
    board.cards = resolvedCards[index]

    return board
  })

  return res.json(boardsWithCards)
}
