const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()

app.use(cors())

app.get('/ativo/:ticker', async (req, res) => {

  try {

    const ticker = req.params.ticker

    const resposta = await axios.get(
      `https://query1.finance.yahoo.com/v8/finance/chart/${ticker}`
    )

    const dados = resposta.data

    const preco =
      dados.chart.result[0].meta.regularMarketPrice

    res.json({
      nome: ticker,
      preco,
    })

  } catch (erro) {

    console.log(erro.message)

    res.status(500).json({
      erro: 'Erro ao buscar ativo',
    })
  }
})

app.listen(3001, () => {
  console.log('Servidor rodando na porta 3001')
})