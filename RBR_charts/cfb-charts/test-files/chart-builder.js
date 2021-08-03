
const srXrByTeam = (json,id) => {
    fetch(json).then(response => response.json()).then(data => { chartData = data;

        let labels = chartData.map(a => a.x);
        let successColors = chartData.map(a => a.colorMain);
        let explosiveColors = chartData.map(a => a.colorDark);

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
        });
    })
}

const srXrByQuarter = (json,id) => {
    fetch(json).then(response => response.json()).then(data => { chartData = data;

        // let labels = chartData.map(a => a.quarter);
        // let successColors = chartData.map(a => a.colorMain);
        // let explosiveColors = chartData.map(a => a.colorDark);
        // let successColorsOpp = chartData.map(a => a.colorMainOpp);
        // let explosiveColorsOpp = chartData.map(a => a.colorDarkOpp);

        let teamOneData = chartData.filter(({offense}) => offense == "Alabama");
        let teamTwoData = chartData.filter(({offense}) => offense == "Florida");

        let labels = teamOneData.map(a => a.quarter);
        let sr = teamOneData.map(a => a["Success Rate"]);
        let xr = teamOneData.map(a => a["Explosiveness Rate"]);
        let srOpp = teamTwoData.map(a => a["Success Rate"]);
        let xrOpp = teamTwoData.map(a => a["Explosiveness Rate"]);
        let successColors = teamOneData.map(a => a.colorMain);
        let explosiveColors = teamOneData.map(a => a.colorDark);
        let successColorsOpp = teamTwoData.map(a => a.colorMain);
        let explosiveColorsOpp = teamTwoData.map(a => a.colorDark);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        stack: "Team One",
                        label: 'Explosiveness Rate One',
                        data: xr,
                        backgroundColor: explosiveColors,
                        // parsing: { yAxisKey: 'XR', xAxisKey: 'quarter' },            
                    },{
                        stack: "Team One",
                        label: 'Success Rate One',
                        data: sr,
                        backgroundColor: successColors,
                        // parsing: { yAxisKey: 'SR', xAxisKey: 'quarter' }
                    },{
                        stack: "Team Two",
                        label: 'Explosiveness Rate Opponent',
                        data: xrOpp,
                        backgroundColor: explosiveColorsOpp,
                        // parsing: { yAxisKey: 'XR Opponent', xAxisKey: 'quarter' },            
                    },{
                        stack: "Team Two",
                        label: 'Success Rate Opponent',
                        data: srOpp,
                        backgroundColor: successColorsOpp,
                        // parsing: { yAxisKey: 'SR Opponent', xAxisKey: 'quarter' }
                    }]
            },
            options: {
                scales: {
                    x: {
                        // stacked: true
                    },
                    y: {
                        // stacked: true
                    },
                // parsing: false
                }
            }
        });
    })
}