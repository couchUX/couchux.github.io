/* set a backup image option for each chart*/
var backupButton_srxr = document.getElementById("backup-img-button-srxr");
var backupImg_srxr = document.getElementById("backup-img-srxr");
var backupImgPrompt_srxr = document.getElementById("backup-img-prompt-srxr");

backupButton_srxr.onclick = function() {
    backupImg_srxr.style.display = "inherit";
    backupButton_srxr.style.display = "none";
    backupImgPrompt_srxr.style.display = "none";
}

var backupButton_plays = document.getElementById("backup-img-button-plays");
var backupImg_plays = document.getElementById("backup-img-plays");
var backupImgPrompt_plays = document.getElementById("backup-img-prompt-plays");

backupButton_plays.onclick = function() {
    backupImg_plays.style.display = "inherit";
    backupButton_plays.style.display = "none";
    backupImgPrompt_plays.style.display = "none";
}

var backupButton_runRate = document.getElementById("backup-img-button-runRate");
var backupImg_runRate = document.getElementById("backup-img-runRate");
var backupImgPrompt_runRate = document.getElementById("backup-img-prompt-runRate");

backupButton_runRate.onclick = function() {
    backupImg_runRate.style.display = "inherit";
    backupButton_runRate.style.display = "none";
    backupImgPrompt_runRate.style.display = "none";
}
