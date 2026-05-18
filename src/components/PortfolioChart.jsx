import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function PortfolioChart({ ativos }) {

  const data = ativos.map((ativo) => ({
    name: ativo.nome,
    value: ativo.valor,
  }))

  const COLORS = [
    '#22c55e',
    '#3b82f6',
    '#f59e0b',
    '#ef4444',
    '#a855f7',
  ]

  return (
    <div className="bg-gray-800 p-6 rounded-2xl mt-8">

      <h2 className="text-2xl mb-6 font-bold">
        Distribuição da Carteira
      </h2>

      <div className="w-full h-96">

        <ResponsiveContainer>

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={140}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[index % COLORS.length]
                  }
                />
              ))}
            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>
    </div>
  )
}

export default PortfolioChart