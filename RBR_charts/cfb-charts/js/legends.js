let container = document.getElementById(outerId(id)); 
        container.insertAdjacentHTML('beforebegin',legend('bar',team[0].offense));
        // container.insertAdjacentHTML('beforebegin',legend('bar',team[1].offense));

legend = (type,teamName,oppName) => {
    
    type == "bar" ? 
        "<div class='legend'>"
            + "<div class='key' style='background-color:" + teamName + ";'><\/div> XR"
            + "<div class='key' style='background-color:" + teamName + ";'><\/div> SR, "
            + teamName
            + "<\/div>" :
    
    type == "line" ?
        "<div class='legend'>"
            + teamName + " plays:"
            + "<div class='key circle' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div> Explosive"
            + "<div class='key circle' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div> Successful"
            + "<div class='key circle' style='background-color: white; border: 1px solid " + teamName + ";'><\/div> Unsuccessful"
            + "<div class='key triangle'></div> Pass"
            + "<\/div>" :
    
    type == "teamLine" ?
        "<div class='legend'>"
            + "<div class='key circle' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div>&nbsp;"
            + teamName + "'s SR"
            + "<div class='key circle' style='height: 4px; width: 4px; background-color:" + "white" + "; border: 3px dotted " + oppName + "'><\/div>&nbsp;"
            + oppName + "'s SR"
            + "<\/div>" :
    
    type == "players" ?
        "<div class='legend'>"
            + teamName + " plays:"
            + "<div class='key' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div> Explosive"
            + "<div class='key' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div> Successful"
            + "<div class='key' style='background-color: white; border: 1px solid " + teamName + ";'><\/div> Unsuccessful"
            + "<\/div>" :
    "null";
};

// lineLegend = (teamName) => {
//     return "<div class='legend'>"
//             + teamName + " plays:"
//             + "<div class='key circle' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div> Explosive"
//             + "<div class='key circle' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div> Successful"
//             + "<div class='key circle' style='background-color: white; border: 1px solid " + teamName + ";'><\/div> Unsuccessful"
//             + "<div class='key triangle'></div> Pass"
//         + "<\/div>"
// };
  
// playersLegend = (teamName) => {
//     return "<div class='legend'>"
//             + teamName + " plays:"
//             + "<div class='key' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div> Explosive"
//             + "<div class='key' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div> Successful"
//             + "<div class='key' style='background-color: white; border: 1px solid " + teamName + ";'><\/div> Unsuccessful"
//         + "<\/div>"
// };

// teamLinesLegend = (teamName,oppName) => {
//     return "<div class='legend'>"
//             + "<div class='key circle' style='background-color:" + teamName + "; border: 1px solid " + teamName + "'><\/div>&nbsp;"
//             + teamName + "'s SR"
//             + "<div class='key circle' style='height: 4px; width: 4px; background-color:" + "white" + "; border: 3px dotted " + oppName + "'><\/div>&nbsp;"
//             + oppName + "'s SR"
//         + "<\/div>"
// };