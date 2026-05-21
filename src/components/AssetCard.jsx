import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

function AssetCard({
  nome,
  rentabilidade,
  positiva,
  onDelete,
  onEdit,
  valor,
  percentual,
  quantidade,
}) {

  const [precoAtual, setPrecoAtual] = useState(null)

  async function buscarPrecoAtivo() {

    try {

      console.log(nome)

      const resposta = await fetch(
        `http://localhost:3001/ativo/${nome}`
      )

      const dados = await resposta.json()

      console.log(dados)

      setPrecoAtual(dados.preco)

    } catch (erro) {

      console.log('Erro ao buscar preço')

    }
  }   

  useEffect(() => {
    buscarPrecoAtivo()
  }, [])    

  const valorAtual =
    precoAtual && quantidade
      ? precoAtual * quantidade
      : 0

  const lucro = valorAtual - valor

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-800 p-4 rounded-xl shadow-lg"
    >

      <div className="flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-semibold text-white">
            {nome}
          </h2>

          <p
            className={`text-xl mt-2 ${
              positiva
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            {rentabilidade}  
          </p>

          <p className="text-gray-400 mt-2">
            Valor investido: R$ {valor}
          </p>

          <p className="text-gray-400">
            Valor atual: R$ {valorAtual.toFixed(2)}
          </p>

          <p
            className={
              lucro >= 0
                ? 'text-green-400 font-bold'
                : 'text-red-400 font-bold'
            }
          >
            Resultado: R$ {lucro.toFixed(2)}
          </p>
          
          <p className="text-gray-400 mt-1">
            R$ {valor}
            <p className="text-blue-400 mt-1">
              Participação: {percentual}%
            </p>
          </p>

          <p className="text-yellow-400 mt-1">
            Preço atual:
            {
              precoAtual
                ? ` R$ ${precoAtual.toFixed(2)}`
                : ' Carregando...'
            }
          </p>    

          <p
            className={`mt-1 ${
            lucro >= 0
              ? 'text-green-400'
              : 'text-red-400'
            }`}
          >
            Resultado:
            {
              lucro >= 0
              ? ` +R$ ${lucro.toFixed(2)}`
              : ` -R$ ${Math.abs(lucro).toFixed(2)}`
            }
          </p>

        </div>
      
        <div className="flex gap-2">

          <button
            onClick={onEdit}
            className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-lg"
          >
            Editar
          </button>

          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
          >
            Excluir
          </button>

        </div>

      </div>
    </motion.div>
  )
}

export default AssetCard