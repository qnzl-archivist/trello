const Trello = require(`trello`)
const auth = require(`@qnzl/auth`)

const { CLAIMS } = auth

const trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN)

const handler = async (req, res) => {
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

module.exports = (req, res) => {
  return authCheck(CLAIMS.trello.dump)(req, res, handler)
}
