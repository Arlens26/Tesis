import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, CategoryScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
//import Chart from "chart.js/auto";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const LineChart = ({ labels, datasets }) => {
    console.log('Labels: ', labels)
    console.log('datasets: ', datasets)
    const chartData = {
        labels: labels,
        datasets: datasets,
    }

    const options = {
        scales: {
            y: {
                beginAtZero: true,
                min: 0,
                max: 100,
            },
        },
    }

    return (
        <div>
            <h2 style={{ textAlign: "center" }}>Gráfico de Líneas de RAs</h2>
            <Line data={chartData} options={options} />
        </div>
    )
}

export default LineChart