// chart config overall
Chart.defaults.plugins.legend.align = 'start';
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.padding = 24;


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

        let teamData = chartData.filter(({offense}) => offense == "Alabama");
        let opponentData = chartData.filter(({offense}) => offense == "Florida");

        let labels = teamData.map(a => a.quarter);
        let sr = teamData.map(a => a["Success Rate"]);
        let xr = teamData.map(a => a["Explosiveness Rate"]);
        let srOpp = opponentData.map(a => a["Success Rate"]);
        let xrOpp = opponentData.map(a => a["Explosiveness Rate"]);
        let sColors = teamData.map(a => a.colorMain);
        let xColors = teamData.map(a => a.colorDark);
        let sColorsOpp = opponentData.map(a => a.colorMain);
        let xColorsOpp = opponentData.map(a => a.colorDark);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        stack: "Team",
                        label: teamData[0].offense + ' SR',
                        data: sr,
                        backgroundColor: sColors,
                        order: 1
                    },{
                        stack: "Team",
                        label: teamData[0].offense + ' XR',
                        data: xr,
                        backgroundColor: xColors,
                        order: 0
                    },{
                        stack: "Opponent",
                        label: opponentData[0].offense + ' SR',
                        data: srOpp,
                        backgroundColor: sColorsOpp,
                        order: 3
                    },{
                        stack: "Opponent",
                        label: opponentData[0].offense + ' XR',
                        data: xrOpp,
                        backgroundColor: xColorsOpp,
                        order: 2
                    }]
            },
        });
    })
}