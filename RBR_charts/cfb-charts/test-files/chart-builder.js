// CHART STYLING
Chart.defaults.plugins.legend.align = 'start';
Chart.defaults.plugins.legend.labels.borderRadius = "15px";
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.padding = 18;

const percentCallback = (value) => `${Math.round(value * 100)}%`

// QUARTER AND SR AVERAGES SETUP
const srAverage = 0.42;
const srAverageColor = "#A0A0A0";
const quarterLinesColor = "#C5C5C5";

const quarterMarker = (theseQuarters, thisData, thisMax, playCol) => {
    quartersArray = [];
    quartersArrayLg = [];
    theseQuarters.forEach(a => {
        let quarterX = thisData.find(({quarter}) => quarter == a);
        quartersArray.push(
            { x: quarterX[playCol], y: -0.1 },
            { x: quarterX[playCol], y: 1.1 },
            { x: thisMax, y: 1.1 },
            { x: thisMax, y: -0.1 }
        );
        quartersArrayLg.push(
            { x: quarterX[playCol], y: -50 },
            { x: quarterX[playCol], y: 100 },
            { x: thisMax, y: 100 },
            { x: thisMax, y: -50 }
        );
    });
};

// DOT COLORS SETUP
function fillColors(team,xColor,sColor) {
    let fillColor = team.map(({explosive, successful}) => 
    explosive == 1 ? xColor :
    successful == 1 ? sColor :
    "rgba(255,255,255,0.9)");       
    return fillColor;
};

// TEAM SRXR BAR CHART
const srXrByTeam = (json,id) => {
    fetch(json).then(response => response.json()).then(data => { 

        let labels = [...new Set(data.map(a => a.offense))];
        let successColors = data.map(a => a.color);
        let explosiveColors = data.map(a => a.color_dark);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Success Rate',
                        data: data,
                        backgroundColor: successColors,
                        parsing: { 
                            yAxisKey: 'sr',
                            xAxisKey: 'offense' 
                        }
                    },
                    {
                        label: 'Explosiveness Rate',
                        data: data,
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

// TEAM SR LINES CHART
const srxrLinesTeam = (json,id) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let team = data.filter(({team_num}) => team_num == 1);
        let opponent = data.filter(({team_num}) => team_num == 2);
        let labels = data.map(a => a.play_num);
        
        let playsMax = Math.max.apply(Math, data.map(({play_num}) => play_num));
        let newQuarters = [...new Set(data.map(a => a.quarter))];
        quarterMarker(newQuarters,data,playsMax,"play_num");
        var srAverageLine = [ { x: 0, y: srAverage },{ x: playsMax, y: srAverage } ];

        let sr = team.map(({play_num, sr_so_far}) => ({ x: play_num, y: sr_so_far }));
        let xr = team.map(({play_num, xr_so_far}) => ({ x: play_num, y: xr_so_far }));
        let srOpp = opponent.map(({play_num, sr_so_far}) => ({ x: play_num, y: sr_so_far }));
        let xrOpp = opponent.map(({play_num, xr_so_far}) => ({ x: play_num, y: xr_so_far }));
        
        let sColors = team.map(a => a.color);
        let xColors = team.map(a => a.color_dark);
        let sColorsOpp = opponent.map(a => a.color);
        let xColorsOpp = opponent.map(a => a.color_dark);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: xr,
                        label: team[0].offense + ' XR',
                        borderColor: xColors,
                        borderWidth: 2.2,
                        pointRadius: 0,
                        tension: 0.3
                    },{
                        data: sr,
                        label: team[0].offense + ' SR',
                        borderColor: sColors,
                        borderWidth: 2.2,
                        pointRadius: 0,
                        tension: 0.3
                    },{
                        data: xrOpp,
                        label: opponent[0].offense + ' XR',
                        borderColor: xColorsOpp,
                        borderWidth: 2.2,
                        pointRadius: 0,
                        tension: 0.3,
                        borderDash: [4,4]
                    },{
                        data: srOpp,
                        label: opponent[0].offense + ' SR', 
                        borderColor: sColorsOpp,
                        borderWidth: 2.2,
                        pointRadius: 0,
                        tension: 0.3,
                        borderDash: [4,4]
                    },
                    {
                        label: "League SR average",
                        data: srAverageLine,
                        borderColor: srAverageColor,
                        borderWidth: 1,
                        fill: false,
                        pointRadius: 0,
                    },
                    {
                        label: "Quarters",
                        data: quartersArray,
                        borderColor: "#CECECE",
                        borderWidth: 1,
                        lineTension: 0,
                        fill: false,
                        pointRadius: 0,
                    }],
            },
            options: {
                scales: {
                    y: {
                        max: 1,
                        min: 0,
                        ticks: { callback: percentCallback }
                    },
                    x: {
                        display: false,
                        // beginAtZero: false,
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

// PLAY MAP
const playMap = (json,id,teamNum) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let team = data.filter(({team_num}) => team_num == teamNum);
        let labels = data.map(a => a.play_num);
        let rushes = team.filter(({play_type}) => play_type == "rush");
        let passes = team.filter(({play_type}) => play_type == "pass");
        
        let playsMax = Math.max.apply(Math, data.map(({play_num}) => play_num));
        let newQuarters = [...new Set(data.map(a => a.quarter))];
        quarterMarker(newQuarters,data,playsMax,"play_num");

        let rushYards = rushes.map(({play_num, yards_gained}) => ({ x: play_num, y: yards_gained }));
        let passYards = passes.map(({play_num, yards_gained}) => ({ x: play_num, y: yards_gained }));
        let yardsMax = Math.max.apply(Math, data.map(({yards_gained}) => yards_gained));
        let yardsMin = Math.min.apply(Math, data.map(({yards_gained}) => yards_gained));
        let zeroLine = [{ x: 0, y: 0 }, { x: playsMax, y: 0 }];
    
        let xColor = team.map(a => a.color_dark);
        let sColor = team.map(a => a.color);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Rush yards',
                        data: rushYards,
                        backgroundColor: fillColors(rushes,xColor,sColor),
                        hoverBackgroundColor: fillColors(rushes,xColor,sColor),
                        borderWidth: 0,
                        pointBorderWidth: 1,
                        borderColor: xColor,
                        pointStyle: 'circle',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.3
                    },
                    {
                        label: 'Pass yards',
                        data: passYards,
                        backgroundColor: fillColors(passes,xColor,sColor),
                        hoverBackgroundColor: fillColors(passes,xColor,sColor),
                        borderWidth: 0,
                        pointBorderWidth: 1,
                        borderColor: xColor,
                        pointStyle: 'triangle',
                        radius: 6,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0.3,
                        borderDash: [4,4],
                    },
                    {
                        label: "Zero",
                        data: zeroLine,
                        borderColor: "#CECECE",
                        borderWidth: 1,
                        lineTension: 0,
                        fill: false,
                        pointRadius: 0,
                    },
                    {
                        label: "Quarters",
                        data: quartersArrayLg,
                        borderColor: "#CECECE",
                        borderWidth: 1,
                        lineTension: 0,
                        fill: false,
                        pointRadius: 0,
                    }],
            },
            options: {
                scales: {
                    y: {
                        max: yardsMax,                        
                        suggestedMin: yardsMin,
                        min: -15,
                    },
                    x: {
                        display: false,
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

// TEAM SR PLAY TYPE LINES
const srLinesPlayType = (json,id,teamNum) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let team = data.filter(({team_num}) => team_num == teamNum);
        let labels = team.map(a => a.play_per_team);
        let rushes = team.filter(({play_type}) => play_type == "rush");
        let passes = team.filter(({play_type}) => play_type == "pass");
        
        let playsMax = Math.max.apply(Math, team.map(({play_per_team}) => play_per_team));
        let newQuarters = [...new Set(team.map(a => a.quarter))];
        quarterMarker(newQuarters,team,playsMax,"play_per_team");
        var srAverageLine = [ { x: 0, y: srAverage },{ x: playsMax, y: srAverage } ];

        let rushSr = rushes.map(({play_per_team, sr_so_far}) => ({ x: play_per_team, y: sr_so_far }));
        let passSr = passes.map(({play_per_team, sr_so_far}) => ({ x: play_per_team, y: sr_so_far }));
        
        let lineColor = team.map(a => a.color_dark);
        let xColor = team.map(a => a.color_dark);
        let sColor = team.map(a => a.color);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: rushSr,
                        label: team[0].offense + ' Rush SR',
                        borderColor: lineColor,
                        backgroundColor: fillColors(rushes,xColor,sColor),
                        hoverBackgroundColor: fillColors(rushes,xColor,sColor),
                        borderWidth: 2,
                        pointBorderWidth: 1,
                        pointStyle: 'circle',
                        pointRadius: 4,
                        pointHoverRadius: 6,
                        tension: 0.3
                    },
                    {
                        data: passSr,
                        label: team[0].offense + ' Pass SR',
                        borderColor: lineColor,
                        backgroundColor: fillColors(passes,xColor,sColor),
                        hoverBackgroundColor: fillColors(passes,xColor,sColor),
                        borderWidth: 2,
                        pointBorderWidth: 1,
                        pointStyle: 'triangle',
                        radius: 6,
                        pointRadius: 6,
                        pointHoverRadius: 8,
                        tension: 0.3,
                        borderDash: [4,4],
                    },
                    {
                        label: "League SR average",
                        data: srAverageLine,
                        borderColor: srAverageColor,
                        borderWidth: 1,
                        fill: false,
                        pointRadius: 0,
                    },
                    {
                        label: "Quarters",
                        data: quartersArray,
                        borderColor: "#CECECE",
                        borderWidth: 1,
                        lineTension: 0,
                        fill: false,
                        pointRadius: 0,
                    }],
            },
            options: {
                scales: {
                    y: {
                        max: 1,
                        min: 0,
                        ticks: { callback: percentCallback }
                    },
                    x: {
                        display: false,
                        // beginAtZero: false,
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

// STACKED BAR CHART TEMPLATE
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