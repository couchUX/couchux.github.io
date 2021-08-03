// chart config overall
Chart.defaults.plugins.legend.align = 'start';
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.padding = 18;


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

        let team = chartData.filter(({offense}) => offense == "Alabama");
        let opponent = chartData.filter(({offense}) => offense == "Florida");

        let labels = team.map(a => a.quarter);
        let sr = team.map(a => a["Success Rate"]);
        let xr = team.map(a => a["Explosiveness Rate"]);
        let srOpp = opponent.map(a => a["Success Rate"]);
        let xrOpp = opponent.map(a => a["Explosiveness Rate"]);
        let sColors = team.map(a => a.colorMain);
        let xColors = team.map(a => a.colorDark);
        let sColorsOpp = opponent.map(a => a.colorMain);
        let xColorsOpp = opponent.map(a => a.colorDark);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: xr,
                        stack: "Team",
                        label: team[0].offense + ' XR',
                        backgroundColor: xColors,
                    },{
                        data: sr,
                        stack: "Team",
                        label: team[0].offense + ' SR',
                        backgroundColor: sColors,
                    },{
                        data: xrOpp,
                        stack: "Opponent",
                        label: opponent[0].offense + ' XR',
                        backgroundColor: xColorsOpp,
                    },{
                        data: srOpp,
                        stack: "Opponent",
                        label: opponent[0].offense + ' SR',
                        backgroundColor: sColorsOpp,
                    }]
            },
        });
    })
}