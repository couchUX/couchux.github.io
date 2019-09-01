//   UTILITIES

    // Extract unique Quarters: I copied and adjusted from an ES6 solution run through Babel. I don't really get it.
    function unique(thisData,thisColumn) { 
        function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }
        function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }
        function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }
        function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }
        var newArray = _toConsumableArray(new Set(thisData.map(function (data) { return data[thisColumn]; })));
        return newArray;
    }


//   PLAY MAP SCATTER CHART
function playMap(thisTeam, thisId) {
var teamPlays = gameData.filter(function(play) { return play.team == thisTeam.name; });
var playCount = gameData.map(function(play) { return play.play_count });
var playsMax = Math.max.apply(Math, gameData.map(function(play) { return play.play_count; }));
var yardsMax = Math.max.apply(Math, gameData.map(function(play) { return play.yards_total; }));
var teamPlayCountAndYards = teamPlays.map(function(play) { return { x: play.play_count, y: play.yards_total }; });

var fillColors = teamPlays.map(function(d) {
    return  d.play_result === "explosive" ? thisTeam.colorDark
    :      d.play_result === "successful" ? thisTeam.color
    :      thisTeam.colorLight;
});

var pointShape = teamPlays.map(function(d) {
    return  d.play_type === "run" ? 'circle'
    :      'triangle';
});

var pointSize = teamPlays.map(function(d) {
    return  d.play_type === "run" ? 4
    :      5.5;
});

var ctx = $(thisId);
new Chart(ctx, {
type: 'scatter',
data: {
    labels: playCount,
    datasets: [{
    label: thisTeam.name + ' - yds by play',
    data: teamPlayCountAndYards,
    backgroundColor: fillColors,
    borderColor: thisTeam.colorDark,
    borderWidth: 1,
    pointRadius: pointSize,
    pointStyle: pointShape,
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
        // type: 'logarithmic',
        ticks: {
        suggestedMin: -10,
        max: yardsMax,
        }
    }],
    xAxes: [{
        ticks: {
        display: false,
        suggestedMin: 1,
        suggestedMax: playsMax + 2,
        }
    }],
    }
}
});

};

//   PLAY MAP SCATTER CHART -> FOR OPPONENT
function playMapOpponent (thatTeam, thatId) {
    playMap(thatTeam,thatId);
}


// TEAM SWITCHER BUTTON (accompanies Play Map)
function teamSwitcher() {
$(".switchBtn").click(function () { $(".teamMap").toggleClass("hidden")});
};


//  BAR CHART TEMPLATE
function barChart(thisTeam, thatTeam, thisId, thisColumn, barChartType) {
        
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
    
    var ctx = $(thisId);
    new Chart(ctx, {
    type: barChartType,
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
        legend: {
            position: 'bottom',
        },
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

// QUARTERS CHART
function quartersChart(thisTeam,thatTeam,thisId) {
    barChart(thisTeam,thatTeam,thisId,'quarter','bar');
}

// DOWNS CHART
function downsChart(thisTeam,thatTeam,thisId) {
    barChart(thisTeam,thatTeam,thisId,'down','horizontalBar');
}

// PLAY TYPE CHART
function playTypeChart(thisTeam,thatTeam,thisId) {
    barChart(thisTeam,thatTeam,thisId,'play_type','horizontalBar');
}



