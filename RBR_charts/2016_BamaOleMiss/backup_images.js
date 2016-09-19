/* set a backup image option for each chart*/
var backupBtn_srxr = document.getElementById("backup-img-btn-srxr");
var backupImg_srxr = document.getElementById("backup-img-srxr");
var backupImgPrompt_srxr = document.getElementById("backup-prompt-srxr");

backupBtn_srxr.onclick = function() {
    backupImg_srxr.style.display = "inherit";
    backupBtn_srxr.style.display = "none";
    backupPrompt_srxr.style.display = "none";
}
var backupBtn_runRate = document.getElementById("backup-img-btn-runPass");
var backupImg_runRate = document.getElementById("backup-img-runPass");
var backupImgPrompt_runRate = document.getElementById("backup-prompt-runPass");

backupBtn_runRate.onclick = function() {
    backupImg_runRate.style.display = "inherit";
    backupBtn_runRate.style.display = "none";
    backupPrompt_runRate.style.display = "none";
}
var backupBtn_runRate_op = document.getElementById("backup-img-btn-runPass-op");
var backupImg_runRate_op = document.getElementById("backup-img-runPass-op");
var backupImgPrompt_runRate_op = document.getElementById("backup-prompt-runPass-op");

backupBtn_runRate_op.onclick = function() {
    backupImg_runRate_op.style.display = "inherit";
    backupBtn_runRate_op.style.display = "none";
    backupPrompt_runRate_op.style.display = "none";
}
