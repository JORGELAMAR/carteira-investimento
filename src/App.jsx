import PortfolioChart from './components/PortfolioChart'
import { useEffect, useState } from 'react'
import AssetCard from './components/AssetCard'
import PatrimonyChart from './components/PatrimonyChart'

function App() {
  const [ativos, setAtivos] = useState(() => {
  const ativosSalvos = localStorage.getItem('ativos')
  
  async function buscarPrecoAtivo(ticker) {
    try {
      const resposta = await fetch(
        `https://brapi.dev/api/quote/${ticker}`
      )

      const dados = await resposta.json()

      return dados.results[0].regularMarketPrice

    } catch (erro) {
      console.log('Erro ao buscar ativo', erro)
      return null
    }
  }

  return ativosSalvos
    ? JSON.parse(ativosSalvos)
    : [
        {
          nome: 'SMH',
          rentabilidade: '+320%',
          valor: 5000,
          positiva: true,
        },
        {
          nome: 'BOTZ',
          rentabilidade: '-40%',
          valor: 2000,
          positiva: false,
        },
      ]
  })

  useEffect(() => {
 
    localStorage.setItem(
    'ativos',
    JSON.stringify(ativos)
  )
  }, [ativos])  
  
  useEffect(() => {

    async function buscarBitcoin() {

      const resposta = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl'
      )

      const dados = await resposta.json()

      setBitcoin(dados.bitcoin.brl)
    }

    buscarBitcoin()

  }, [])

  useEffect(() => {

    async function buscarPrecos() {

      const simbolos = ativos
        .map((ativo) => ativo.nome)
        .join(',')

      const resposta = await fetch(
        `https://financialmodelingprep.com/api/v3/quote/${simbolos}?apikey=xvqphT66pgpGgl5YfoQWkd7pNBUmBlzy`
      )

      const dados = await resposta.json()

      const mapaPrecos = {}

      dados.forEach((ativo) => {
        mapaPrecos[ativo.symbol] = ativo.price
      })

      setPrecos(mapaPrecos)
    }

    if (ativos.length > 0) {
      buscarPrecos()
    }

  }, [ativos])  

  const [editando, setEditando] = useState(false)
  const [ativoOriginal, setAtivoOriginal] = useState(null)
  const [nome, setNome] = useState('')
  const [rentabilidade, setRentabilidade] = useState('')
  const [valor, setValor] = useState('')
  const [busca, setBusca] = useState('')
  const [ordenacao, setOrdenacao] = useState('valor')
  const [darkMode, setDarkMode] = useState(true)
  const [bitcoin, setBitcoin] = useState(null)
  const [precos, setPrecos] = useState({})
  const [quantidade, setQuantidade] = useState('')
  const [precoAtual, setPrecoAtual] = useState('')

  async function adicionarAtivo() {
    if (!nome || !rentabilidade) return

    const precoAtual = await buscarPrecoAtivo(nome)

    const novoAtivo = {
      nome,
      rentabilidade,
      quantidade: Number(quantidade),
      valor: Number(valor),
      precoAtual,
      positiva: !rentabilidade.includes('-'),
    }

    if (editando) {
      const novaLista = ativos.map((ativo) =>
        ativo.nome === ativoOriginal
          ? novoAtivo
          : ativo
      )

      setAtivos(novaLista)

      setEditando(false)
      setAtivoOriginal(null)

    } else {
      setAtivos([...ativos, novoAtivo])
    }

    setNome('')
    setRentabilidade('')
    setValor('')
    setQuantidade('')
  }

  function excluirAtivo(nomeAtivo) {
    const novaLista = ativos.filter(
      (ativo) => ativo.nome !== nomeAtivo
    )

    setAtivos(novaLista)
  }

  function editarAtivo(ativo) {
    setNome(ativo.nome)
    setRentabilidade(ativo.rentabilidade)

    setEditando(true)
    setAtivoOriginal(ativo.nome)
  }  

  const patrimonioTotal = ativos.reduce(
    (total, ativo) => total + ativo.valor,
    0
  )

  const ativosFiltrados = ativos.filter((ativo) =>
    ativo.nome
      .toLowerCase()
      .includes(busca.toLowerCase())
  )
  
  const ativosOrdenados = [...ativosFiltrados].sort(
    (a, b) => {
      if (ordenacao === 'valor') {
        return b.valor - a.valor
      }

      if (ordenacao === 'nome') {
        return a.nome.localeCompare(b.nome)
      }

      return 0
    }
  )

  return (
    <div
      className={`min-h-screen p-8 transition-all duration-500 ${
        darkMode
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-black'
      }`}
    >
      <h1 className="text-4xl font-bold text-green-400">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="mt-4 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-xl"
        >
          {darkMode
            ? '🌙 Modo Escuro'
            : '☀️ Modo Claro'}
        </button>
        Carteira de Investimentos
      </h1>

      <p className="mt-4 text-gray-300">
        Controle completo dos seus ativos
      </p>

      <div className="mt-6 bg-green-500/20 border border-green-500 p-4 rounded-2xl">
        <h2 className="text-xl text-green-300">
          Patrimônio Total
        </h2>

        <p className="text-4xl font-bold text-green-400 mt-2">
          R$ {patrimonioTotal.toLocaleString('pt-BR')}
        </p>
      </div>

      <div className="mt-4 bg-yellow-500/20 border border-yellow-500 p-4 rounded-2xl">
        <h2 className="text-xl text-yellow-300">
          Bitcoin Agora
        </h2>

        <p className="text-3xl font-bold text-yellow-400 mt-2">
          {
            bitcoin
            ? `R$ ${bitcoin.toLocaleString('pt-BR')}`
            : 'Carregando...'
          }
        </p>
      </div>        

      <div className="mt-8 bg-gray-800 p-4 rounded-xl">
        <h2 className="text-2xl mb-4">
          Adicionar Investimento
        </h2>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Nome do ativo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="bg-gray-700 p-2 rounded-lg w-full"
          />

          <input
            type="text"
            placeholder="+120%"
            value={rentabilidade}
            onChange={(e) =>
              setRentabilidade(e.target.value)
            }
            className="bg-gray-700 p-2 rounded-lg w-full"
          />

          <input
            type="number"
            placeholder="Valor investido"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="bg-gray-700 p-2 rounded-lg w-full"
          /> 

          <input
            type="number"
            placeholder="Quantidade de cotas"
            value={quantidade}
            onChange={(e) =>
              setQuantidade(e.target.value)
            }
            className="bg-gray-700 p-2 rounded-lg w-full"
          />    

          <button
            onClick={adicionarAtivo}
            className="bg-green-500 hover:bg-green-600 px-4 rounded-lg"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="mt-8">
        <input
          type="text"
          placeholder="Buscar ativo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="bg-gray-800 p-3 rounded-xl w-full text-white"
        />
      </div>        

      <div className="mt-4">
        <select
          value={ordenacao}
          onChange={(e) =>
            setOrdenacao(e.target.value)
          }
          className="bg-gray-800 p-3 rounded-xl text-white"
        >
          <option value="valor">
            Maior valor
          </option>

          <option value="nome">
            Nome
          </option>
        </select>
      </div>

      <div className="mt-8 grid gap-4">
        {ativosOrdenados.map((ativo) => (
          <AssetCard
            key={ativo.nome}
            nome={ativo.nome}
            rentabilidade={ativo.rentabilidade}
            positiva={ativo.positiva}
            onDelete={() => excluirAtivo(ativo.nome)}
            onEdit={() => editarAtivo(ativo)}
            valor={ativo.valor}
            precoAtual={precos[ativo.nome]}
            percentual={
              ((ativo.valor / patrimonioTotal) * 100).toFixed(1)
            }
          />
        ))}
      </div>
      <PortfolioChart ativos={ativos} />
      <PatrimonyChart
        patrimonioTotal={patrimonioTotal}
      />

    </div>
  )
}

export default App