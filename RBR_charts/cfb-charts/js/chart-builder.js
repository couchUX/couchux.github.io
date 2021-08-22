// CHART STYLING
Chart.defaults.plugins.legend.align = 'start';
Chart.defaults.plugins.legend.labels.borderRadius = "15px";
Chart.defaults.plugins.legend.labels.boxWidth = 12;
Chart.defaults.plugins.legend.labels.padding = 18;
Chart.defaults.elements.line.tension = 0.25;
Chart.defaults.elements.line.borderWidth = 1;
Chart.defaults.elements.point.pointRadius = 4;
Chart.defaults.elements.point.pointHoverRadius = 8;
Chart.defaults.elements.point.pointBorderWidth = 1;

// CHART HELPERS
const percentCallback = (value) => `${Math.round(value * 100)}%`
const quarterLinesColor = "#C5C5C5";
const unsColor = "rgba(255,255,255,0.9)";

const srAvg = 0.42;
const srAvgColor = "#A0A0A0";
const srAvgBarLine = () => ({
    type: 'line',
    data: [ srAvg, srAvg, srAvg, srAvg ],
    barThickness: 6,
    label: "Leave average",
    borderColor: '#757575',
    borderWidth: 2,
    borderDash: [3,3],
    pointRadius: 0,
    datalabels: { labels: { title: null } }
});

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

let quarterLines = (data) => ({
        label: "Quarters",
        data: data,
        borderColor: "#CECECE",
        borderWidth: 1,
        lineTension: 0,
        fill: false,
        pointRadius: 0,
})

let zeroShade = (labl,x1,x2,x3,x4,y1,y2,y3,y4) => ({
    label: labl, 
    data: [ { x: x1, y: y1 },
            { x: x2, y: y2 },
            { x: x3, y: y3 },
            { x: x4, y: y4 }],
    tension: 0,
    fill: true,
    pointRadius: 0,
    backgroundColor: 'rgba(0,0,0,0.05)',
});

// POINT STYLES SETUP
function fillColors(data,xColor,sColor) {
    let fillColor = data.map(({explosive, successful}) => 
    explosive == 1 ? xColor :
    successful == 1 ? sColor :
    unsColor);       
    return fillColor;
};

function pointStyle(data) {
    let pointStyle = data.map(({play_type}) => 
    play_type == "rush" ? 'circle' : 'triangle');
    return pointStyle;
};

function pointSize(data) {
    let pointSize = data.map(({play_type}) => 
    play_type == "rush" ? 4 : 5.5);
    return pointSize;
};

// TEAM SR LINES CHART
const teamLines = (json,thisGame,id) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let game = data.filter(({game}) => game == thisGame);
        let chart = game.filter(({chart}) => chart == 'plays');
        let team = chart.filter(({team_num}) => team_num == 1);
        let opponent = chart.filter(({team_num}) => team_num == 2);
        let labels = chart.map(a => a.play_num);
        
        let playsMax = Math.max.apply(Math, chart.map(({play_num}) => play_num));
        let newQuarters = [...new Set(chart.map(a => a.quarter))];
        quarterMarker(newQuarters,data,playsMax,"play_num");

        let sr = team.map(({play_num, team_sr}) => ({ x: play_num, y: team_sr }));
        let xr = team.map(({play_num, team_xr}) => ({ x: play_num, y: team_xr }));
        let srOpp = opponent.map(({play_num, team_sr}) => ({ x: play_num, y: team_sr }));
        let xrOpp = opponent.map(({play_num, team_xr}) => ({ x: play_num, y: team_xr }));
        
        let sColor = team.map(a => a.hex);
        let xColor = team.map(a => a.hex_dark);
        let sColorOpp = opponent.map(a => a.hex);
        let xColorOpp = opponent.map(a => a.hex_dark);

        let dataset = (d,l,bColor,dash) => ({
            data: d,
            label: l,
            borderColor: bColor,
            borderWidth: 2.2,
            pointRadius: 0,
            borderDash: dash,
        })

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    dataset(xr,team[0].offense + 'XR',xColor,[1,0]),
                    dataset(sr,team[0].offense + 'SR',sColor,[1,0]),
                    dataset(xrOpp,opponent[0].offense + 'XR',xColorOpp,[4,4]),
                    dataset(srOpp,opponent[0].offense + 'SR',sColorOpp,[4,4]),
                    quarterLines(quartersArray),
                    zeroShade("League SR Avg",1,1,playsMax,playsMax,0,srAvg,srAvg,0)
                ],
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
const playMap = (json,thisGame,id,teamNum) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let game = data.filter(({game}) => game == thisGame);
        let chart = game.filter(({chart}) => chart == 'plays');
        let team = chart.filter(({team_num}) => team_num == teamNum);
        let labels = chart.map(a => a.play_num);
        let yards = team.map(({play_num, yards}) => ({ x: play_num, y: yards }));
        
        let playsMax = Math.max.apply(Math, chart.map(({play_num}) => play_num));
        let newQuarters = [...new Set(chart.map(a => a.quarter))];
        quarterMarker(newQuarters,chart,playsMax,"play_num");

        let xColor = team.map(a => a.hex_dark);
        let sColor = team.map(a => a.hex);
        let yardsMax = Math.max.apply(Math, chart.map(({yards}) => yards));
        let yardsMin = Math.min.apply(Math, chart.map(({yards}) => yards));

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Yards',
                        data: yards,
                        backgroundColor: fillColors(team,xColor,sColor),
                        hoverBackgroundColor: fillColors(team,xColor,sColor),
                        borderWidth: 0,
                        borderColor: xColor,
                        pointStyle: pointStyle(team),
                        pointRadius: pointSize(team),
                    },
                    quarterLines(quartersArrayLg),
                    zeroShade(1,1,playsMax,playsMax,0,yardsMin,yardsMin,0) 
                ]
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
const playTypeLines = (json,thisGame,id,teamNum) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let game = data.filter(({game}) => game == thisGame);
        let chart = game.filter(({chart}) => chart == 'plays');
        let team = chart.filter(({team_num}) => team_num == teamNum);
        let labels = team.map(a => a.team_play);
        let rushes = team.filter(({play_type}) => play_type == "rush");
        let passes = team.filter(({play_type}) => play_type == "pass");
        
        let playsMax = Math.max.apply(Math, team.map(({team_play}) => team_play));
        let newQuarters = [...new Set(team.map(a => a.quarter))];
        quarterMarker(newQuarters,team,playsMax,"team_play");

        let rushSr = rushes.map(({team_play, sr}) => ({ x: team_play, y: sr }));
        let passSr = passes.map(({team_play, sr}) => ({ x: team_play, y: sr }));
        
        let lineColor = team.map(a => a.hex_dark);
        let xColor = team.map(a => a.hex_dark);
        let sColor = team.map(a => a.hex);

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
                        pointStyle: 'circle',
                        pointRadius: 4,
                    },
                    {
                        data: passSr,
                        label: team[0].offense + ' Pass SR',
                        borderColor: lineColor,
                        backgroundColor: fillColors(passes,xColor,sColor),
                        hoverBackgroundColor: fillColors(passes,xColor,sColor),
                        borderWidth: 2,
                        pointStyle: 'triangle',
                        radius: 6,
                        pointRadius: 6,
                        borderDash: [4,4],
                    },
                    quarterLines(quartersArray),
                    zeroShade("League SR Avg",0,0,playsMax,playsMax,0,srAvg,srAvg,0)
                ],
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

// RUSh RATE
const rushRate = (json,thisGame,id,teamNum) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let game = data.filter(({game}) => game == thisGame);
        let chart = game.filter(({chart}) => chart == 'plays');
        let team = chart.filter(({team_num}) => team_num == teamNum);
        let labels = team.map(a => a.team_play);
        let rushRate = team.map(({team_play, rr}) => ({ x: team_play, y: rr }));
        
        let playsMax = Math.max.apply(Math, team.map(({team_play}) => team_play));
        let newQuarters = [...new Set(team.map(a => a.quarter))];
        quarterMarker(newQuarters,team,playsMax,"team_play");
        
        let bgColor = team.map(a => a.hex_light);
        let xColor = team.map(a => a.hex_dark);
        let sColor = team.map(a => a.hex);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: rushRate,
                        label: team[0].offense + ' Rush Rate',
                        borderColor: xColor,
                        backgroundColor: bgColor,
                        pointBackgroundColor: fillColors(team,xColor,sColor),
                        hoverBackgroundColor: fillColors(team,xColor,sColor),
                        borderWidth: 2,
                        pointStyle: pointStyle(team),
                        pointRadius: pointSize(team),
                        fill: true
                    },
                    quarterLines(quartersArray),
                ],
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

// TEAM SRXR BAR CHART
const srXrByTeam = (json,thisGame,id) => {
    fetch(json).then(response => response.json()).then(data => { 

        let game = data.filter(({game}) => game == thisGame);
        let chart = game.filter(({chart}) => chart == 'teams');
        let labels = [...new Set(chart.map(a => a.offense))];
        let successColors = chart.map(a => a.hex);
        let explosiveColors = chart.map(a => a.hex_dark);

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Success Rate',
                        data: chart,
                        backgroundColor: successColors,
                        parsing: { yAxisKey: 'sr', xAxisKey: 'offense' }
                    },
                    {
                        label: 'Explosiveness Rate',
                        data: chart,
                        backgroundColor: explosiveColors,
                        parsing: { yAxisKey: 'xr', xAxisKey: 'offense' }
                    },
                    srAvgBarLine(),
                ]
            },
            options: {
                scales: {
                    y: {
                        max: 1,
                        ticks: { callback: percentCallback }
                    },
                },
            }
        });
    })
}

// STACKED BAR CHART TEMPLATE
const srXrBars = (json,thisGame,thisCol,id) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let game = data.filter(({game}) => game == thisGame);
        let chart = game.filter(({chart}) => chart == thisCol);
        let team = chart.filter(({team_num}) => team_num == 1);
        let opponent = chart.filter(({team_num}) => team_num == 2);
        let labels = [...new Set(chart.map(a => a[thisCol]))];

        let sr = team.map(a => a.sr);
        let xr = team.map(a => a.xr);
        let srOpp = opponent.map(a => a.sr);
        let xrOpp = opponent.map(a => a.xr);
        let sColors = team.map(a => a.hex);
        let xColors = team.map(a => a.hex_dark);
        let sColorsOpp = opponent.map(a => a.hex);
        let xColorsOpp = opponent.map(a => a.hex_dark); 
        
        let dataset = (d,s,l,color) => ({
                data: d,
                stack: s,
                label: l,
                backgroundColor: color,
        })

        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    dataset(xr,'Team',team[0].offense + ' XR',xColors),
                    dataset(sr,'Team',team[0].offense + ' SR',sColors),
                    dataset(xrOpp,'Opponent',team[0].offense + ' XR',xColorsOpp),
                    dataset(srOpp,'Opponent',team[0].offense + ' SR',sColorsOpp),
                    srAvgBarLine(),
                ]
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

// PLAYER CHARTS
const players = (json,thisGame,thisCol,id,teamNum) => {
    fetch(json).then(response => response.json()).then(data => { 

        let game = data.filter(({game}) => game == thisGame);
        let chart = game.filter(({chart}) => chart == thisCol);
        let team = chart.filter(({team_num}) => team_num == teamNum);
        let labels = [...new Set(team.map(a => a[thisCol]))];

        let explosive = team.map(a => a.explosive);
        let successful = team.map(a => a.successful);
        let unsCatches = team.map(a => a.uns_catches);
        let unsuccessful = team.map(a => a.uns);

        let sColor = team.map(a => a.hex);
        let xColor = team.map(a => a.hex_dark);
        let cColor = team.map(a => a.hex);

        let dataset = (d,s,l,xColor,color) => ({
            data: d,
            stack: s,
            label: l,
            borderWidth: 0.8,
            borderColor: xColor,
            backgroundColor: color,
        })
        
        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    dataset(explosive,'1','Explosive Plays',xColor,xColor),
                    dataset(successful,'1','Successful Plays',xColor,sColor),
                    dataset(unsCatches,'1','Unsuccessful Catches',xColor,cColor),
                    dataset(unsuccessful,'1','Unsuccessful Plays',xColor,unsColor),
                ]
            },
            options: {
                scales: { y: { stacked: true } },
                indexAxis: 'y',
                tooltips: {
                    callbacks: {
                        label: (value) => `${Math.round(value * 100)}%`   // why isn't this working?
                    }
                } 
            }
        });
    })
}