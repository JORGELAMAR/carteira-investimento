import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

function PatrimonyChart({ patrimonioTotal }) {

  const data = [
    {
      mes: 'Jan',
      valor: patrimonioTotal * 0.7,
    },
    {
      mes: 'Fev',
      valor: patrimonioTotal * 0.8,
    },
    {
      mes: 'Mar',
      valor: patrimonioTotal * 0.9,
    },
    {
      mes: 'Abr',
      valor: patrimonioTotal,
    },
  ]

  return (
    <div className="bg-gray-800 p-6 rounded-2xl mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Evolução Patrimonial
      </h2>

      <div className="w-full h-96">

        <ResponsiveContainer>

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="mes" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="valor"
              stroke="#22c55e"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>
    </div>
  )
}

export default PatrimonyChart