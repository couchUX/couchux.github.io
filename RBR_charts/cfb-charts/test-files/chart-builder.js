const srXrByTeam = (json,id) => {

    fetch(json).then(response => response.json()).then(data => { chartData = data;

        let labels = chartData.map(a => a.x);
        let successColors = chartData.map(a => a.successColor);
        let explosiveColors = chartData.map(a => a.explosiveColor);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Success Rate',
                        data: chartData,
                        backgroundColor: successColors,
                        parsing: { yAxisKey: 'Success Rate' }
                    },
                    {
                        label: 'Explosiveness Rate',
                        data: chartData,
                        backgroundColor: explosiveColors,
                        parsing: { yAxisKey: 'Explosiveness Rate' },            
                }]
            },
            options: {
                scales: {
                    y: {
                        // beginAtZero: true,
                    },
                }
            }
        });
        })
}