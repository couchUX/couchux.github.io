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
const unsuccessfulColor = "rgba(255,255,255,0.9)";
const srAverageBarLine = [ srAverage, srAverage, srAverage, srAverage ];

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
function fillColors(data,xColor,sColor) {
    let fillColor = data.map(({explosive, successful}) => 
    explosive == 1 ? xColor :
    successful == 1 ? sColor :
    unsuccessfulColor);       
    return fillColor;
};

function pointStyle(data) {
    let pointStyle = data.map(({play_type}) => 
    play_type == "rush" ? 'circle' : 'triangle');
    return pointStyle;
};

function pointSize(data) {
    let pointSize = data.map(({play_type}) => 
    play_type == "rush" ? 4 : 6);
    return pointSize;
};

function pointSizeHover(data) {
    let pointSizeHover = data.map(({play_type}) => 
    play_type == "rush" ? 6 : 8);
    return pointSizeHover;
};

// TEAM SR LINES CHART
const srxrLinesTeam = (json,id) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let team = data.filter(({team_num}) => team_num == 1);
        let opponent = data.filter(({team_num}) => team_num == 2);
        let labels = data.map(a => a.play_num);
        
        let playsMax = Math.max.apply(Math, data.map(({play_num}) => play_num));
        let newQuarters = [...new Set(data.map(a => a.quarter))];
        quarterMarker(newQuarters,data,playsMax,"play_num");
        let srAverageLine = [ { x: 0, y: srAverage },{ x: playsMax, y: srAverage } ];

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
                        data: srAverageBarLine,
                        borderColor: srAverageColor,
                        borderWidth: 1,
                        pointRadius: 0,
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
        
        let playsMax = Math.max.apply(Math, data.map(({play_num}) => play_num));
        let newQuarters = [...new Set(data.map(a => a.quarter))];
        quarterMarker(newQuarters,data,playsMax,"play_num");

        let yards = team.map(({play_num, yards_gained}) => ({ x: play_num, y: yards_gained }));
    
        let yardsMax = Math.max.apply(Math, data.map(({yards_gained}) => yards_gained));
        let yardsMin = Math.min.apply(Math, data.map(({yards_gained}) => yards_gained));
        let zeroLine = [
            { x: 1, y: 0 },
            { x: playsMax, y: 0 },
        ];
        let zeroShade = [
            { x: 1, y: 0 },
            { x: 1, y: yardsMin },
            { x: playsMax, y: yardsMin },
            { x: playsMax, y: 0 },
        ];
    
        let xColor = team.map(a => a.color_dark);
        let sColor = team.map(a => a.color);

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
                        pointBorderWidth: 1,
                        borderColor: xColor,
                        pointStyle: pointStyle(team),
                        pointRadius: pointSize(team),
                        pointHoverRadius: pointSizeHover(team),
                        tension: 0.3
                    },
                    {
                        label: "ZeroLine",
                        data: zeroLine,
                        borderColor: quarterLinesColor,
                        borderWidth: 1,
                        lineTension: 0,
                        fill: true,
                        pointRadius: 0,
                        backgroundColor: 'rgba(0,0,0,0.05)',
                    },
                    {
                        label: "ZeroShade",
                        data: zeroShade,
                        borderColor: quarterLinesColor,
                        borderWidth: 1,
                        lineTension: 0,
                        fill: true,
                        pointRadius: 0,
                        backgroundColor: 'rgba(0,0,0,0.05)',
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
        let srAverageLine = [ { x: 0, y: srAverage },{ x: playsMax, y: srAverage } ];

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
                        borderColor: quarterLinesColor,
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
const rushRate = (json,id,teamNum) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let team = data.filter(({team_num}) => team_num == teamNum);
        let labels = team.map(a => a.play_per_team);
        
        let playsMax = Math.max.apply(Math, team.map(({play_per_team}) => play_per_team));
        let newQuarters = [...new Set(team.map(a => a.quarter))];
        quarterMarker(newQuarters,team,playsMax,"play_per_team");
        
        let rushRate = team.map(({play_per_team, rush_rate}) => ({ x: play_per_team, y: rush_rate }));
        
        let bgColor = team.map(a => a.color_light);
        let xColor = team.map(a => a.color_dark);
        let sColor = team.map(a => a.color);

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
                        pointBorderWidth: 1,
                        pointStyle: pointStyle(team),
                        pointRadius: pointSize(team),
                        pointHoverRadius: pointSizeHover(team),
                        tension: 0.3,
                        fill: true
                    },
                    {
                        label: "Quarters",
                        data: quartersArray,
                        borderColor: quarterLinesColor,
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
                    },{
                        type: 'line',
                        data: srAverageBarLine,
                        label: "Leave average",
                        borderColor: '#757575',
                        borderWidth: 2,
                        borderDash: [3,4],
                        pointRadius: 0,
                        datalabels: {
                            labels: { title: null }
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
                    },{
                        type: 'line',
                        data: srAverageBarLine,
                        label: "Leave average",
                        borderColor: '#757575',
                        borderWidth: 2,
                        borderDash: [3,4],
                        pointRadius: 0,
                        datalabels: {
                            labels: { title: null }
                        }
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

// PLAYER CHARTS
const players = (thisCol,json,id,teamNum) => {
    fetch(json).then(response => response.json()).then(data => { 
        
        let team = data.filter(({team_num}) => team_num == teamNum);
        let labels = [...new Set(team.map(a => a[thisCol]))];

        let explosive = team.map(a => a.explosive_count);
        let successful = team.map(a => a.successful_not_x);
        let unsuccessfulCatches = team.map(a => a.unsuccessful_catches);
        let unsuccessful = team.map(a => a.unsuccessful);

        let sColor = team.map(a => a.color);
        let xColor = team.map(a => a.color_dark);
        let cColor = team.map(a => a.color_light);
        
        const ctx = document.getElementById(id).getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        data: explosive,
                        stack: 'One',
                        axis: 'y',
                        label: 'Explosive Plays',
                        borderWidth: 0.8,
                        borderColor: xColor,
                        backgroundColor: xColor,
                    },
                    {
                        data: successful,
                        stack: 'One',
                        axis: 'y',
                        label: 'Successful Plays',
                        borderWidth: 0.8,
                        borderColor: xColor,
                        backgroundColor: sColor,
                    },
                    {
                        data: unsuccessfulCatches,
                        stack: 'One',
                        axis: 'y',
                        label: 'Unsuccessful Catches',
                        borderWidth: 0.8,
                        borderColor: xColor,
                        backgroundColor: cColor,
                    },
                    {
                        data: unsuccessful,
                        stack: 'One',
                        axis: 'y',
                        label: 'Unsuccessful Plays',
                        borderWidth: 0.8,
                        borderColor: xColor,
                        backgroundColor: unsuccessfulColor,
                    }]
            },
            options: {
                scales: {
                    y: {
                        stacked: true,
                    }
                
                },
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