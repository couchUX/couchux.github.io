//   UTILITIES


// Global chart options
Chart.defaults.global.legend = false;
Chart.plugins.unregister(ChartDataLabels);
Chart.defaults.global.defaultFontFamily = 'Roboto';


Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
    color: function(context) {
        var index = context.dataIndex;
        var value = context.dataset.data[index];
        return value > 0 ? 'white' :  
            'rgba(255,255,255,0)';
    },
    backgroundColor: function(context) {
        var index = context.dataIndex;
        var value = context.dataset.data[index];
        return value > 0 ? 'rgba(0,0,0,0.28)' :  
            'rgba(255,255,255,0)';
    },
    // backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
    padding: {
        top: 3,
        bottom: 1,
        left: 5,
        right: 5,
    }
});


// Chart.defaults.global.elements.line.borderWidth = 4;

var srAverage = 0.42;
var srAverageColor = "#A0A0A0";
var quarterLinesColor = "#C5C5C5";

// Extract unique Quarters: I copied and adjusted from an ES6 solution run through Babel. I don't really get it.
function unique(thisData,thisColumn) { 
    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }
    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }
    function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }
    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }
    var newArray = _toConsumableArray(new Set(thisData.map(function (data) { return data[thisColumn]; })));
    return newArray;
};

// colors for points on line and scatter charts
function fillColors(thisData,thisTeam) {
    var fillColors = thisData.map(function(d) {
    return  d.play_result === "explosive" ? thisTeam.colorDark
    :      d.play_result === "successful" ? thisTeam.color
    :      "rgba(255,255,255,0.9)";
    });       
    return fillColors;
};
function pointShape(thisData) {
    var pointShape = thisData.map(function(d) {
        return  d.play_type === "run" ? 'circle'
        :      'triangle';
    });
    return pointShape;
};
function pointSize(thisData) {    
    var pointSize = thisData.map(function(d) {
        return  d.play_type === "run" ? 4
        :      5.5;
    });
    return pointSize;
};
function addId(thisId) {
    return "#" + thisId
};
function chartId(thisId) {
    return thisId + "Chart";
};
function outerId(thisId) {
    return thisId + "Outer";
};
// to extract the first play from each quarter and make marker lines from them
function quarterFinder(thisQuarter)  {
    return gameData.find(function (play) { return play.quarter == thisQuarter; }); 
};
function runForQuarters(thisData,thisMax) {
    quartersArray = [];
    thisData.forEach(function(value) {
        var quarterX = quarterFinder(value);

        quartersArray.push(
            { x: quarterX.play_count, y: -0.1 },
            { x: quarterX.play_count, y: 1.1 },
            { x: thisMax, y: 1.1 },
            { x: thisMax, y: -0.1 }
        );
    });

    return quartersArray;
};

function barSrLegend(teamName) {
    return "<div class='legend'>"
            + "<div class='key' style='background-color:" + teamName.colorDark + ";'><\/div> XR"
            + "<div class='key' style='background-color:" + teamName.color + ";'><\/div> SR, "
            + teamName.name
        + "<\/div>"
};

function lineLegend(teamName) {
    return "<div class='legend'>"
            + teamName.name + " plays:"
            + "<div class='key circle' style='background-color:" + teamName.colorDark + "; border: 1px solid " + teamName.colorDark + "'><\/div> Explosive"
            + "<div class='key circle' style='background-color:" + teamName.color + "; border: 1px solid " + teamName.colorDark + "'><\/div> Successful"
            + "<div class='key circle' style='background-color: white; border: 1px solid " + teamName.colorDark + ";'><\/div> Unsuccessful"
            + "<div class='key triangle'></div> Pass"
        + "<\/div>"
};
  
function playersLegend(teamName,playerType) {
    return "<div class='legend'>"
            + teamName.name + " plays:"
            + "<div class='key' style='background-color:" + teamName.colorDark + "; border: 1px solid " + teamName.colorDark + "'><\/div> Explosive"
            + "<div class='key' style='background-color:" + teamName.color + "; border: 1px solid " + teamName.colorDark + "'><\/div> Successful"
            + "<div class='key' style='background-color: white; border: 1px solid " + teamName.colorDark + ";'><\/div> Unsuccessful"
        + "<\/div>"
};

function teamLinesLegend(teamName,opponentName) {
    return "<div class='legend'>"
            + "<div class='key circle' style='background-color:" + teamName.color + "; border: 1px solid " + teamName.color + "'><\/div>&nbsp;"
            + teamName.name + "'s SR"
            + "<div class='key circle' style='height: 4px; width: 4px; background-color:" + "white" + "; border: 3px dotted " + opponentName.color + "'><\/div>&nbsp;"
            + opponentName.name + "'s SR"
        + "<\/div>"
};


//   CUMULATIVE SUCCESS RATE, BOTH TEAMS
function teamSrChart(thisTeam,thatTeam,thisId) {
    var container = document.getElementById(outerId(thisId)); 
    container.insertAdjacentHTML('beforebegin',teamLinesLegend(thisTeam,thatTeam));

    var runPassPlays = gameData.filter(function(play) { return play.play_type == "run" || play.play_type == "pass"; });
    var teamPlays = runPassPlays.filter(function(play) { return play.team == thisTeam.name; });
    var opponentPlays = runPassPlays.filter(function(play) { return play.team == thatTeam.name; });
    var playCount = gameData.map(function(play) { return play.play_count });
    var teamSr = teamPlays.map(function(play) { return { x: play.play_count, y: play.total_sr }; });
    var opponentSr = opponentPlays.map(function(play) { return { x: play.play_count, y: play.total_sr }; });

    var playsMax = Math.max.apply(Math, gameData.map(function(play) { return play.play_count; }));
    var srAverageLine = [ { x: 0, y: srAverage },{ x: playsMax, y: srAverage } ];
    
    var uniqueQuarters = unique(gameData,"quarter");
    runForQuarters(uniqueQuarters,playsMax);
    var quarterXs = quartersArray;
    
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {    
        type: 'line',
        data: {
            labels: playCount,
            datasets: [{
                data: teamSr,
                pointBackgroundColor: fillColors(teamPlays,thisTeam),
                borderColor: thisTeam.color,
                borderWidth: 2.5,
                lineTension: 0.2,
                fill: false,
                pointRadius: 0,
            },
            {
                data: opponentSr,
                pointBackgroundColor: fillColors(opponentPlays,thisTeam),
                borderColor: thatTeam.color,
                borderWidth: 2.5,
                lineTension: 0.2,
                borderDash: [4,3],
                fill: false,
                pointRadius: 0,
            },
            {
                label: "NCAA success rate average",
                data: srAverageLine,
                borderColor: srAverageColor,
                borderWidth: 1,
                fill: false,
                pointRadius: 0,
            },
            {
                label: "Quarter lines",
                data: quarterXs,
                borderColor: quarterLinesColor,
                borderWidth: 1,
                lineTension: 0,
                fill: false,
                pointRadius: 0,
            }],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 1,
                        callback: function(value) {return value * 100 + "%" }
                    }
                }],
                xAxes: [{
                    display: false,
                }],
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
    
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) + "%";
                        return label;
                    }
                }
            },
        }
    });
    
};

//   PLAY MAP TEMPLATE
function playMap(thisTeam,thisId,legendId) {
    var container = document.getElementById(legendId); 
    container.insertAdjacentHTML('afterbegin',lineLegend(thisTeam));

    var teamPlays = gameData.filter(function(play) { return play.team == thisTeam.name; });
    var playCount = gameData.map(function(play) { return play.play_count });
    var playsMax = Math.max.apply(Math, gameData.map(function(play) { return play.play_count; }));
    var yardsMax = Math.max.apply(Math, gameData.map(function(play) { return play.yards_total; }));
    var yardsMin = Math.min.apply(Math, gameData.map(function(play) { return play.yards_total; }));
    var teamPlayCountAndYards = teamPlays.map(function(play) { return { x: play.play_count, y: play.yards_total }; });

    var uniqueQuarters = unique(gameData,"quarter");
    runForQuarters(uniqueQuarters,playsMax);
    var quarterXs = quartersArray;

    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        type: 'scatter',
        data: {
            labels: playCount,
            datasets: [{
                data: teamPlayCountAndYards,
                pointBackgroundColor: fillColors(teamPlays,thisTeam),
                borderColor: thisTeam.colorDark,
                borderWidth: 1,
                pointRadius: pointSize(teamPlays),
                pointStyle: pointShape(teamPlays),
            },
            {
                label: "Quarter lines",
                data: quarterXs,
                borderColor: srAverageColor,
                borderWidth: 1,
                lineTension: 0,
                fill: false,
                pointRadius: 0,
                type: 'line'
            }], 
        },
        options: {
            maintainAspectRatio: false,
            showAnimation: false,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, chart) {
                        return tooltipItem.yLabel + " yards";
                    },
                }
            },
            scales: {
            yAxes: [{
                ticks: {
                suggestedMin: yardsMin,
                max: yardsMax,
                }
            }],
            xAxes: [{
                ticks: {
                display: false,
                suggestedMin: 1,
                suggestedMax: playsMax,
                }
            }],
            },
        }
    });

};


// TEAM SWITCHER BUTTON (accompanies Play Map)
function teamSwitcher() {
    $(".switchBtn").click(function () { $(".teamMap").toggleClass("hide")});
};


//  BAR SR CHART TEMPLATE
function barSrChart(thisData,thisTeam,thatTeam,thisId,thisColumn,labelChar) {
    var container = document.getElementById(outerId(thisId)); 
    container.insertAdjacentHTML('beforebegin',barSrLegend(thisTeam));
    container.insertAdjacentHTML('beforebegin',barSrLegend(thatTeam));
        
    var srArray = [];
    var xrArray = [];
    var srArrayOpp = [];
    var xrArrayOpp = [];

    function columnArrays(thisTeam,thisColumnValue,thisXrArray,thisSrArray) {
        teamPlays = thisData.filter(function(play) { return play.team == thisTeam.name; });
        columnPlays = teamPlays.filter(function(play) { return play[thisColumn] == thisColumnValue});
        
        columnPlaysExplosive = columnPlays.filter(function(play) { return play.play_result == "explosive"});
        thisXrArray.push(columnPlaysExplosive.length / columnPlays.length);
        
        columnPlaysSuccessful = columnPlays.filter(function(play) { return play.play_result == "successful"});
        thisSrArray.push( columnPlaysSuccessful.length / columnPlays.length );

    };

    var uniqueColumnValues = unique(thisData,thisColumn);

    uniqueColumnValues.forEach(function(value) {
        columnArrays(teamOneData,value,xrArray,srArray);
        columnArrays(teamTwoData,value,xrArrayOpp,srArrayOpp);
    });

    var srAverageLine = gameData.map(function(play) { return { x: play.i, y: srAverage }; });
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        // plugins: [ChartDataLabels],
        type: 'bar',
        data: {
            labels: uniqueColumnValues,
            datasets: [{
                stack: "team",
                data: xrArray,
                backgroundColor: thisTeam.colorDark,
            },
            {
                stack: "team",
                data: srArray,
                backgroundColor: thisTeam.color,
            }, 
            {
                stack: "opponent",
                data: xrArrayOpp,
                backgroundColor: thatTeam.colorDark,
            }, 
            {
                stack: "opponent",
                data: srArrayOpp,
                backgroundColor: thatTeam.color,
            },
            {
                label: "NCAA success rate average",
                data: srAverageLine,
                borderColor: srAverageColor,
                borderWidth: 1,
                fill: false,
                pointRadius: 0,
                type: 'line',
                datalabels: {
                    labels: {
                        title: null
                    }
                }
            }],
        },
        options: {
            maintainAspectRatio: false,
            showAnimation: false,
            scales: {
                xAxes: [{
                    ticks: {
                        callback: function(value) { return value + labelChar },
                        stacked: true,
                        suggestedMax: 1,
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMax: 1,
                        callback: function(value) { return value * 100 + "%" }
                    }
                }]
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
    
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) + "%";
                        return label;
                    }
                }
            },
            // plugins: {
            //     datalabels: {
            //         formatter: function(value, context) {
            //             return Math.round(value*100) + '%';
            //         },
            //     }
            // }
        }
    });
    
    }
 //   QUARTERS CHART
function quartersChart(thisTeam,thatTeam,thisId) {
    thisData = gameData.filter(function(play) { return play.play_type == "run" || play.play_type == "pass"; });
    barSrChart(thisData,thisTeam,thatTeam,thisId,'quarter','');
};

 //   DOWNS CHART
function downsChart(thisTeam,thatTeam,thisId) {
    thisData = gameData.filter(function(play) { return play.play_type == "run" || play.play_type == "pass"; });
    barSrChart(thisData,thisTeam,thatTeam,thisId,'down','D');
};

 //   PLAY TYPE CHART
function playTypeChart(thisTeam,thatTeam,thisId) {
    thisData = gameData.filter(function(play) { return play.play_type == "run" || play.play_type == "pass"; });
    barSrChart(thisData,thisTeam,thatTeam,thisId,'play_type','');
};

//   RED ZONE CHART
function redZoneChart(thisTeam,thatTeam,thisId) {
    runPassPlays = gameData.filter(function(play) { return play.play_type == "run" || play.play_type == "pass"; });
    thisData = runPassPlays.filter(function(play) { return play.red_zone == "Normal" || play.red_zone == "Red Zone"; });
    barSrChart(thisData,thisTeam,thatTeam,thisId,'red_zone','');
};

//   RUN RATE CHART
function runRateChart(thisTeam, thisId) {
    var container = document.getElementById(outerId(thisId)); 
    container.insertAdjacentHTML('beforebegin',lineLegend(thisTeam));

    var teamPlays = gameData.filter(function(play) { return play.team == thisTeam.name && play.run_rate != ""; });
    var playCount = teamPlays.map(function(play) { return play.play_count });
    var playCountAndRunRate = teamPlays.map(function(play) { return { x: play.play_count, y: play.run_rate }; });

    var playsMax = Math.max.apply(Math, teamPlays.map(function(play) { return play.play_count; }));

    var rrAverage = 0.5;
    var rrAverageLine = [ { x: 0, y: rrAverage },{ x: playsMax, y: rrAverage } ];
    

    var uniqueQuarters = unique(teamPlays,"quarter");
    runForQuartersTeam(uniqueQuarters,playsMax);
    var quarterXs = quartersArray;

    // putting these here for now, need to consolidate
    function quarterFinderTeam(thisQuarter)  {
        return teamPlays.find(function (play) { return play.quarter == thisQuarter; }); 
    };
    function runForQuartersTeam(thisData,thisMax) {
        quartersArray = [];
        thisData.forEach(function(value) {
            var quarterX = quarterFinderTeam(value);
    
            quartersArray.push(
                { x: quarterX.play_count, y: -0.1 },
                { x: quarterX.play_count, y: 1.1 },
                { x: thisMax, y: 1.1 },
                { x: thisMax, y: -0.1 }
            );
        });
    
        return quartersArray;
    };
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: playCount,
            datasets: [{
                data: playCountAndRunRate,
                pointBackgroundColor: fillColors(teamPlays,thisTeam),
                backgroundColor: thisTeam.colorLight,
                borderColor: thisTeam.colorDark,
                borderWidth: 1.5,
                pointBorderWidth: 1,
                pointRadius: pointSize(teamPlays),
                pointStyle: pointShape(teamPlays),
            
            },
            {
                data: rrAverageLine,
                borderColor: srAverageColor,
                borderWidth: 1,
                pointBorderWidth: 1,
                fill: false,
                pointRadius: 0,
            },
            {
                label: "Quarter lines",
                data: quarterXs,
                borderColor: quarterLinesColor,
                borderWidth: 1,
                lineTension: 0,
                fill: false,
                pointRadius: 0,
            }], 
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 1,
                        callback: function(value) {return value * 100 + "%" }
                    }
                }],
                xAxes: [{
                    display: false,
                }],
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
    
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) + "%";
                        return label;
                    }
                }
            },
        }
    });
    
    };


//   RUN AND PASS SUCCESS RATE
function runPassSrChart(thisTeam, thisId) {
    var container = document.getElementById(outerId(thisId)); 
    container.insertAdjacentHTML('beforebegin',lineLegend(thisTeam));

    var teamPlays = gameData.filter(function(play) { return play.team == thisTeam.name; });
    var playCount = teamPlays.map(function(play) { return play.play_count });
    var runPlays = teamPlays.filter(function(play) { return play.play_type == "run"; });
    var passPlays = teamPlays.filter(function(play) { return play.play_type == "pass"; });
    var playCountAndRunSr = runPlays.map(function(play) { return { x: play.play_count, y: play.run_sr }; });
    var playCountAndPassSr = passPlays.map(function(play) { return { x: play.play_count, y: play.pass_sr }; });

    var playsMax = Math.max.apply(Math, teamPlays.map(function(play) { return play.play_count; }));
    var srAverageLine = [ { x: 0, y: srAverage },{ x: playsMax, y: srAverage } ];

    var uniqueQuarters = unique(teamPlays,"quarter");
    runForQuartersTeam(uniqueQuarters,playsMax);
    var quarterXs = quartersArray;

    // putting these here for now, need to consolidate
    function quarterFinderTeam(thisQuarter)  {
        return teamPlays.find(function (play) { return play.quarter == thisQuarter; }); 
    };
    function runForQuartersTeam(thisData,thisMax) {
        quartersArray = [];
        thisData.forEach(function(value) {
            var quarterX = quarterFinderTeam(value);
    
            quartersArray.push(
                { x: quarterX.play_count, y: -0.1 },
                { x: quarterX.play_count, y: 1.1 },
                { x: thisMax, y: 1.1 },
                { x: thisMax, y: -0.1 }
            );
        });
    
        return quartersArray;
    };
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: playCount,
            datasets: [{
                data: playCountAndRunSr,
                pointBackgroundColor: fillColors(runPlays,thisTeam),
                backgroundColor: thisTeam.colorLight,
                borderColor: thisTeam.colorDark,
                borderWidth: 1.5,
                pointBorderWidth: 1,
                fill: false,
                pointRadius: pointSize(runPlays),
                pointStyle: pointShape(runPlays),
            
            },
            {
                data: playCountAndPassSr,
                pointBackgroundColor: fillColors(passPlays,thisTeam),
                backgroundColor: thisTeam.colorLight,
                borderColor: thisTeam.colorDark,
                pointBorderWidth: 1.5,
                borderWidth: 1.5,
                pointBorderWidth: 1,
                borderDash: [3,3],
                fill: false,
                pointRadius: pointSize(passPlays),
                pointStyle: pointShape(passPlays),
            
            },
            {
                label: "NCAA success rate average",
                data: srAverageLine,
                borderColor: srAverageColor,
                borderWidth: 1,
                fill: false,
                pointRadius: 0,
            },
            {
                label: "Quarter lines",
                data: quarterXs,
                borderColor: quarterLinesColor,
                borderWidth: 1,
                lineTension: 0,
                fill: false,
                pointRadius: 0,
            }],
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    ticks: {
                        min: 0,
                        max: 1,
                        callback: function(value) {return value * 100 + "%" }
                    }
                }],
                xAxes: [{
                    display: false,
                }],
            },
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        var label = data.datasets[tooltipItem.datasetIndex].label || '';
    
                        if (label) {
                            label += ': ';
                        }
                        label += Math.round(tooltipItem.yLabel * 100) + "%";
                        return label;
                    }
                }
            },
        }
    });
    
    };



//  PLAYERS CHART TEMPLATE
function playersChart(thisTeam, thisId, thisColumn) {
    var container = document.getElementById(outerId(thisId)); 
    container.insertAdjacentHTML('beforebegin',playersLegend(thisTeam));
        
    var xpArray = [];
    var spArray = [];
    var nspArray = [];

    teamPlays = gameData.filter(function(play) { return play.team == thisTeam.name; });
    realPlays = teamPlays.filter(function(play) { return play[thisColumn] != ""; });

    function columnArrays(thisColumnValue,thisXpArray,thisSpArray,thisNspArray) {
        columnPlays = realPlays.filter(function(play) { return play[thisColumn] == thisColumnValue});
        
        columnPlaysExplosive = columnPlays.filter(function(play) { return play.play_result == "explosive"});
        thisXpArray.push(columnPlaysExplosive.length);
        
        columnPlaysSuccessful = columnPlays.filter(function(play) { return play.play_result == "successful"});
        thisSpArray.push(columnPlaysSuccessful.length);

        columnPlaysNotSuccessful = columnPlays.filter(function(play) { return play.play_result == "not successful"});
        thisNspArray.push(columnPlaysNotSuccessful.length);

    };

    var uniqueColumnValues = unique(realPlays,thisColumn);

    uniqueColumnValues.forEach(function(value) {
        columnArrays(value,xpArray,spArray,nspArray);
    });
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        type: 'horizontalBar',
        plugins: [ChartDataLabels],
        data: {
            labels: uniqueColumnValues,
            datasets: [{
                data: xpArray,
                stack: "one",
                backgroundColor: thisTeam.colorDark,
            },
            {
                data: spArray,
                stack: "one",
                backgroundColor: thisTeam.color,
            }, 
            {
                data: nspArray,
                stack: "one",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderColor: thisTeam.colorDark,
                borderWidth: 1,
            }], 
        },
        options: {
            maintainAspectRatio: false,
            showAnimation: false,
            scales: {
                xAxes: [{
                    ticks: {
                        stacked: true,
                        suggestedMax: 0.8,
                    }
                }]
            }
        }
    });
    
    }


//   RUNNERS CHART
function runnersChart(thisTeam,thisId) {
    playersChart(thisTeam,thisId,'runner');
}

//   PASSERS CHART
function passersChart(thisTeam,thisId) {
    playersChart(thisTeam,thisId,'passer');
}

//   RECEIVERS CHART
function receiversChart(thisTeam,thisId) {
    playersChart(thisTeam,thisId,'receiver');
}


//  TACKLERS CHART
function tacklersChart(thisTeam,thatTeam,thisId) {
    var container = document.getElementById(outerId(thisId)); 
    container.insertAdjacentHTML('beforebegin',playersLegend(thatTeam));
        
    var xpArray = [];
    var spArray = [];
    var nspArray = [];

    teamPlays = gameData.filter(function(play) { return play.team == thatTeam.name; });
    realPlays = teamPlays.filter(function(play) { return play.tackler_one != "" || play.tackler_two != ""; });

    function columnArrays(thisColumnValue,thisXpArray,thisSpArray,thisNspArray) {
        columnPlays = realPlays.filter(function(play) { return play.tackler_one == thisColumnValue && play.tackler_one_credit == 1 });
        columnPlaysHalf = realPlays.filter(function(play) { return play.tackler_one == thisColumnValue && play.tackler_one_credit == 0.5 });
        columnPlaysTwo = realPlays.filter(function(play) { return play.tackler_two == thisColumnValue });

        function returnByResult(thisArray,thisResult) {
            array = columnPlays.filter(function(play) { return play.play_result == thisResult});
            arrayHalf = columnPlaysHalf.filter(function(play) { return play.play_result == thisResult});
            arrayTwo = columnPlaysTwo.filter(function(play) { return play.play_result == thisResult});
            thisArray.push(array.length + arrayHalf.length / 2 + arrayTwo.length / 2);
            // thisArray.sort(function(a, b){return b-a});
        };

        returnByResult(thisXpArray,"explosive");
        returnByResult(thisSpArray,"successful");
        returnByResult(thisNspArray,"not successful");

    };

    var uniqueColumnValues = unique(realPlays,'tackler_one');

    uniqueColumnValues.forEach(function(value) {
        columnArrays(value,xpArray,spArray,nspArray);
    });
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        type: 'horizontalBar',
        plugins: [ChartDataLabels],
        data: {
            labels: uniqueColumnValues,

            datasets: [{
                data: xpArray,
                stack: "one",
                backgroundColor: thatTeam.colorDark,
            },
            {
                data: spArray,
                stack: "one",
                backgroundColor: thatTeam.color,
            }, 
            {
                data: nspArray,
                stack: "one",
                backgroundColor: "rgba(255,255,255,0.8)",
                borderColor: thatTeam.colorDark,
                borderWidth: 1,
            }], 
        },
        options: {
            maintainAspectRatio: false,
            showAnimation: false,
            scales: {
                xAxes: [{
                    ticks: {
                        stacked: true,
                        suggestedMax: 0.8,
                    }
                }]
            }
        }
    });
    
    }