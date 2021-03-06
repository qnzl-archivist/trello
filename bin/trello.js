#!/usr/bin/node env

const { promisify } = require('util')
const { resolve } = require('path')
const { Command } = require('commander')
const Trello = require('trello')
const dayjs = require('dayjs')
const fs = require('fs')

const program = new Command()

process.on('unhandledRejection', onfatal)
process.on('uncaughtException', onfatal)

function onfatal(err) {
  console.log('fatal:', err.message)
  exit(1)
}

function exit(code) {
  process.nextTick(process.exit, code)
}

program
  .command('dump')
  .description('Dump to file')
  .option('-t, --token [token]', 'OAuth access token')
  .option('--client-id [id]', 'Client ID')
  .option('--export-format <format>', 'Export file format', '{date}-trello.json')
  .option('--export-path [path]', 'Export file path')
  .action(dump)

program.parseAsync(process.argv)

async function dump({
  org,
  token,
  clientId,
  exportPath,
  exportFormat,
}) {

  const filledExportFormat = exportFormat
    .replace('{date}', dayjs().format('YYYY-MM-DD'))

  const EXPORT_PATH = resolve(exportPath, filledExportFormat)

  const trello = new Trello(clientId, token)

  const boards = await trello.getBoards(org || 'me')

  console.log("BOARDS:", boards)
  let cards = boards.map((board) => {
    return trello.getCardsOnBoard(board.id)
  })

  const resolvedCards = await Promise.all(cards)

  const boardsWithCards = boards.map((board, index) => {
    board.cards = resolvedCards[index]

    return board
  })

  const dump = JSON.stringify(boardsWithCards)

  await promisify(fs.writeFile)(EXPORT_PATH, dump)
}

