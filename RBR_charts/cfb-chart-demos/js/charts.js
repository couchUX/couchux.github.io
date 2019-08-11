// Code and config to run each chartjs chart

//Play Map scatter chart
function playMap(thisTeam) {
var teamPlays = gameData.filter(function(play) { return play.team == thisTeam.name; });
var playCount = gameData.map(function(play) { return play.play_count });
var playsMax = Math.max.apply(Math, gameData.map(function(play) { return play.play_count; }));
var yardsMax = Math.max.apply(Math, gameData.map(function(play) { return play.yards_total; }));
// var playDetails = teamPlays.map(function(play) { return play.play_description });
// var playYards = teamPlays.map(function(play) { return play.yards_total });
var teamPlayCountAndYards = teamPlays.map(function(play) { return { x: play.play_count, y: play.yards_total }; });

var fillColors = teamPlays.map(function(d) {
    return  d.play_result === "explosive" ? thisTeam.colorDark
    :      d.play_result === "successful" ? thisTeam.color
    :      thisTeam.colorLight;
});

var ctx = $("#playMap");
var chart = new Chart(ctx, {
type: 'scatter',
data: {
    labels: playCount,
    datasets: [{
    label: thisTeam.name + ' - yds by play',
    data: teamPlayCountAndYards,
    backgroundColor: fillColors,
    borderColor: thisTeam.colorDark,
    borderWidth: 1,
    pointRadius: 4,
    // showLine: true,
    // fill: false,
    // lineTension: 0.2,
    // borderDash: [2,4]
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
        suggestedMin: 1,
        suggestedMax: playsMax + 2,                
        }
    }],
    }
}
});

};

// Team switcher button (accompanies Play Map)
function teamSwitcher() {
$("#playMapOuter").append("<button class=\"switchBtn switchOne hide\">Show "+ teamOneData.name +"</button>");
$("#playMapOuter").append("<button class=\"switchBtn switchTwo\">Show "+ teamTwoData.name +"</button>");
$(".switchBtn").click(function () { $(".switchBtn").toggleClass("hide")});
$(".switchOne").click(function () { playMap(teamOneData)});
$(".switchTwo").click(function () { playMap(teamTwoData)});
};
