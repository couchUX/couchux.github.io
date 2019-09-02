//   UTILITIES


// Global chart options
Chart.defaults.global.legend = false;
Chart.defaults.global.borderWidth = 4;

// Extract unique Quarters: I copied and adjusted from an ES6 solution run through Babel. I don't really get it.
function unique(thisData,thisColumn) { 
    function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }
    function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }
    function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }
    function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }
    var newArray = _toConsumableArray(new Set(thisData.map(function (data) { return data[thisColumn]; })));
    return newArray;
}

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


//   PLAY MAP TEMPLATE
function playMap(thisTeam,thisId,legendId) {
    var container = document.getElementById(legendId); 
    container.insertAdjacentHTML('afterbegin',lineLegend(thisTeam));

    var teamPlays = gameData.filter(function(play) { return play.team == thisTeam.name; });
    var playCount = gameData.map(function(play) { return play.play_count });
    var playsMax = Math.max.apply(Math, gameData.map(function(play) { return play.play_count; }));
    var yardsMax = Math.max.apply(Math, gameData.map(function(play) { return play.yards_total; }));
    var teamPlayCountAndYards = teamPlays.map(function(play) { return { x: play.play_count, y: play.yards_total }; });

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
            }] 
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
                suggestedMin: -10,
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
            }
        }
    });

};


// TEAM SWITCHER BUTTON (accompanies Play Map)
function teamSwitcher() {
    $(".switchBtn").click(function () { $(".teamMap").toggleClass("hide")});
};


//  BAR SR CHART TEMPLATE
function barSrChart(thisTeam,thatTeam,thisId,thisColumn,labelChar) {
    var container = document.getElementById(outerId(thisId)); 
    container.insertAdjacentHTML('beforebegin',barSrLegend(thisTeam));
    container.insertAdjacentHTML('beforebegin',barSrLegend(thatTeam));
        
    var srArray = [];
    var xrArray = [];
    var srArrayOpp = [];
    var xrArrayOpp = [];

    function columnArrays(thisTeam,thisColumnValue,thisXrArray,thisSrArray) {
        teamPlays = gameData.filter(function(play) { return play.team == thisTeam.name; });
        columnPlays = teamPlays.filter(function(play) { return play[thisColumn] == thisColumnValue});
        
        columnPlaysExplosive = columnPlays.filter(function(play) { return play.play_result == "explosive"});
        thisXrArray.push(columnPlaysExplosive.length / columnPlays.length);
        
        columnPlaysSuccessful = columnPlays.filter(function(play) { return play.play_result == "successful"});
        thisSrArray.push( columnPlaysSuccessful.length / columnPlays.length );

    };

    var uniqueColumnValues = unique(gameData,thisColumn);

    uniqueColumnValues.forEach(function(value) {
        columnArrays(teamOneData,value,xrArray,srArray);
        columnArrays(teamTwoData,value,xrArrayOpp,srArrayOpp);
    });
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: uniqueColumnValues,
            datasets: [{
                label: "",
                stack: "team",
                data: xrArray,
                backgroundColor: thisTeam.colorDark,
            },
            {
                label: thisTeam.name + ': XR/SR by quarter',
                stack: "team",
                data: srArray,
                backgroundColor: thisTeam.color,
            }, 
            {
                label: "",
                stack: "opponent",
                data: xrArrayOpp,
                backgroundColor: thatTeam.colorDark,
            }, 
            {
                label: thatTeam.name + ': XR/SR by quarter',
                stack: "opponent",
                data: srArrayOpp,
                backgroundColor: thatTeam.color,
            }]
        },
        options: {
            maintainAspectRatio: false,
            showAnimation: false,
            scales: {
                xAxes: [{
                    ticks: {
                        callback: function(value) {return value + labelChar },
                        stacked: true,
                        suggestedMax: 1,
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMax: 1,
                        callback: function(value) {return value * 100 + "%" }
                    }
                }]
            }
        }
    });
    
    }
 //   QUARTERS CHART
function quartersChart(thisTeam,thatTeam,thisId) {
    barSrChart(thisTeam,thatTeam,thisId,'quarter','');
}

 //   DOWNS CHART
function downsChart(thisTeam,thatTeam,thisId) {
    barSrChart(thisTeam,thatTeam,thisId,'down','D');
}

 //   PLAY TYPE CHART
function playTypeChart(thisTeam,thatTeam,thisId) {
    barSrChart(thisTeam,thatTeam,thisId,'play_type','');
}

//   RUN RATE CHART
function runRateChart(thisTeam, thisId) {
    var container = document.getElementById(outerId(thisId)); 
    container.insertAdjacentHTML('beforebegin',lineLegend(thisTeam));

    var teamPlays = gameData.filter(function(play) { return play.team == thisTeam.name; });
    var playCount = teamPlays.map(function(play) { return play.play_count });
    var playCountAndRunRate = teamPlays.map(function(play) { return { x: play.play_count, y: play.run_rate }; });

    var rrAverage = 0.5;
    var rrAverageLine = gameData.map(function(play) { return { x: play.i, y: rrAverage }; });
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: playCount,
            datasets: [{
                label: thisTeam.name + ' - run rate (cumulative)',
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
                label: false,
                data: rrAverageLine,
                borderColor: "#333",
                borderDash: [2,2],
                borderWidth: 1.5,
                pointBorderWidth: 1,
                fill: false,
                pointRadius: 0,
            }] 
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
            }
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

    var srAverage = 0.4;
    var srAverageLine = gameData.map(function(play) { return { x: play.i, y: srAverage }; });
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: playCount,
            datasets: [{
                label: thisTeam.name + ' - run SR (cumulative)',
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
                label: thisTeam.name + ' - pass SR (cumulative)',
                data: playCountAndPassSr,
                pointBackgroundColor: fillColors(passPlays,thisTeam),
                backgroundColor: thisTeam.colorLight,
                borderColor: thisTeam.colorDark,
                pointBorderWidth: 1.5,
                borderWidth: 1.5,
                pointBorderWidth: 1,
                borderDash: [3,4],
                fill: false,
                pointRadius: pointSize(passPlays),
                pointStyle: pointShape(passPlays),
            
            },
            {
                label: "NCAA success rate average",
                data: srAverageLine,
                borderColor: "#6b6b6b",
                borderDash: [2,1],
                borderWidth: 1,
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
            }
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
    realRunPlays = teamPlays.filter(function(play) { return play[thisColumn] != ""; });

    function columnArrays(thisColumnValue,thisXpArray,thisSpArray,thisNspArray) {
        columnPlays = teamPlays.filter(function(play) { return play[thisColumn] == thisColumnValue});
        
        columnPlaysExplosive = columnPlays.filter(function(play) { return play.play_result == "explosive"});
        thisXpArray.push(columnPlaysExplosive.length);
        
        columnPlaysSuccessful = columnPlays.filter(function(play) { return play.play_result == "successful"});
        thisSpArray.push(columnPlaysSuccessful.length);

        columnPlaysNotSuccessful = columnPlays.filter(function(play) { return play.play_result == "not successful"});
        thisNspArray.push(columnPlaysNotSuccessful.length);

    };

    var uniqueColumnValues = unique(realRunPlays,thisColumn);

    uniqueColumnValues.forEach(function(value) {
        columnArrays(value,xpArray,spArray,nspArray);
    });
    
    var ctx = $(addId(chartId(thisId)));
    new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: uniqueColumnValues,

            datasets: [{
                label: "",
                data: xpArray,
                stack: "one",
                backgroundColor: thisTeam.colorDark,
            },
            {
                label: "",
                data: spArray,
                stack: "one",
                backgroundColor: thisTeam.color,
            }, 
            {
                label: thisTeam.name + ': XR/SR by quarter',
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