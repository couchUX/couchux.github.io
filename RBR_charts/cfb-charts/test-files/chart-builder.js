// chart config overall
Chart.defaults.plugins.legend.align = 'center';
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.padding = 18;

percentCallback = (value) => `${Math.round(value * 100)}%`

// TEAM CHART -- consider consolidating with a Stacking variable
const srXrByTeam = (json,id) => {
    fetch(json).then(response => response.json()).then(data => { chartData = data;

        let labels = [...new Set(data.map(a => a.offense))];
        let successColors = chartData.map(a => a.color);
        let explosiveColors = chartData.map(a => a.color_dark);

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
                        parsing: { 
                            yAxisKey: 'sr',
                            xAxisKey: 'offense' 
                        }
                    },
                    {
                        label: 'Explosiveness Rate',
                        data: chartData,
                        backgroundColor: explosiveColors,
                        parsing: { 
                            yAxisKey: 'xr',
                            xAxisKey: 'offense' 
                        }
                    }]
            },
            options: {
                scales: {
                    y: {
                        max: 1,
                        ticks: { callback: percentCallback }
                    },
                }
            }
        });
    })
}

const srXrBars = (thisCol,json,id) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let team = data.filter(({team_num}) => team_num == 1);
        let opponent = data.filter(({team_num}) => team_num == 2);
        let labels = [...new Set(data.map(a => a[thisCol]))];

        let sr = team.map(a => a.sr);
        let xr = team.map(a => a.xr);
        let srOpp = opponent.map(a => a.sr);
        let xrOpp = opponent.map(a => a.xr);
        let sColors = team.map(a => a.color);
        let xColors = team.map(a => a.color_dark);
        let sColorsOpp = opponent.map(a => a.color);
        let xColorsOpp = opponent.map(a => a.color_dark);

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
            options: {
                scales: {
                    y: {
                        stacked: false,
                        max: 1,
                        ticks: { callback: percentCallback }
                    }
                },
                tooltips: {
                    callbacks: {
                        label: (value) => `${Math.round(value * 100)}%`   // why isn't this working?
                    }
                } 
            }
        });
    })
}