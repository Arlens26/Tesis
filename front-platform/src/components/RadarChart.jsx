import { Radar } from 'react-chartjs-2'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
//import { useEffect, useState } from 'react'
//import { useEnrolledStudent } from '../hooks/useEnrolledStudent'

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

// eslint-disable-next-line react/prop-types
export function RadarChart({ labels, datasets, title }) {
  //const { getStudents, students } = useEnrolledStudent()

  /*const courses = [
    'IA',
    'Redes y servidores',
    'PLN',
    'IPOO',
    'Simulación computacional',
    'FLP',
    'KDD'
  ]*/

  /*const exampleGrades = [
    [3.3, 4.0, 2.7, 3.8, 4.5, 3.2, 4.0],
    [2.8, 3.6, 4.2, 2.9, 3.7, 4.1, 3.3],
    [4.0, 3.9, 3.5, 4.2, 3.8, 3.7, 4.4]
  ]*/

  /*const [chartData, setChartData] = useState(null)

  useEffect(() => {
    getStudents()
  }, [])*/

  const chartData = {
    labels: labels,
    datasets: datasets,
  }

  const options = {
    elements: {
      line: {
        borderWidth: 3,
      },
    },
    scales: {
      r: {
        angleLines: {
          display: true,
        },
        suggestedMin: 0,
        suggestedMax: 5,
      },
    },
  }

  /*useEffect(() => {
    if (students.length > 0) {
      const data = {
        labels: courses,
        datasets: students.map((student, index) => ({
          label: `${student.first_name} ${student.last_name}`,
          data: exampleGrades[index % exampleGrades.length], 
          fill: true,
          backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
          borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
          pointBackgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`
        }))
      }
      setChartData(data)
    }
  }, [students])

  const options = {
    elements: {
      line: {
        borderWidth: 3
      }
    },
    scales: {
      r: {
        angleLines: {
          display: true
        },
        suggestedMin: 0,
        suggestedMax: 5
      }
    }
  }*/

  if (!chartData) return <div>Loading...</div>

  return (
    <div style={{ width: '500px', margin: '0 auto' }}>
      <h2 style={{ textAlign: "center" }}>{title}</h2>
      <Radar data={chartData} options={options} />
    </div>
  )
}

export default RadarChart
