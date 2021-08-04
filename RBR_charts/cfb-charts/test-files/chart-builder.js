// chart config overall
Chart.defaults.plugins.legend.align = 'start';
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.padding = 18;


// TEAM CHART -- consider consolidating with a Stacking variable
const srXrByTeam = (json,id) => {
    fetch(json).then(response => response.json()).then(data => { chartData = data;

        let labels = chartData.map(a => a.offense);
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
                        stacked: false,
                        max: 1,
                    },
                }
            }
        });
    })
}

const srXrByQuarter = (thisCol,json,id) => {
    fetch(json).then(response => response.json()).then(data => { chartData = data;

        let team = chartData.filter(({team_num}) => team_num == 1);
        let opponent = chartData.filter(({team_num}) => team_num == 2);

        let labels = team.map(a => a[thisCol]);
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
                    },
                },
                tooltips: {
                    callbacks: {
                        label: ({datasetIndex, yLabel}, {datasets}) => {
                            let label = datasets[datasetIndex].label || '';
                            if (label) { label += ': '; }
                            label += `${Math.round(yLabel * 100)}%`;
                            return label;
                          }
                    }
                }
            }
        });
    })
}