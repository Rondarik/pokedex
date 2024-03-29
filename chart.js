
function renderChart() {
    const ctx = document.getElementById('PokeStatsChart');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['HP', 'ATK', 'DEF', 'SpAKT', 'SpDEF', 'Speed'],
            datasets: [{
                label: '# of Votes',
                data: pokeStats,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 159, 64, 0.2)",
                    "rgba(255, 205, 86, 0.2)",
                    "rgba(75, 192, 192, 0.2)",
                    "rgba(54, 162, 235, 0.2)",
                    "rgba(153, 102, 255, 0.2)",
                    "rgba(201, 203, 207, 0.2)",
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    max: 255
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                  display: false
                },
            }
        }
    });
}
