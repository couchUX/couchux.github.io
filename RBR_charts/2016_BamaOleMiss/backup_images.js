/* set a backup image option for each chart*/
var backupBtn_srxr = document.getElementById("backup-img-btn-srxr");
var backupImg_srxr = document.getElementById("backup-img-srxr");
var backupPrompt_srxr = document.getElementById("backup-prompt-srxr");

backupBtn_srxr.onclick = function() {
    backupImg_srxr.style.display = "inherit";
    backupBtn_srxr.style.display = "none";
    backupPrompt_srxr.style.display = "none";
}
var backupBtn_runPass = document.getElementById("backup-img-btn-runPass");
var backupImg_runPass = document.getElementById("backup-img-runPass");
var backupPrompt_runPass = document.getElementById("backup-prompt-runPass");

backupBtn_runPass.onclick = function() {
    backupImg_runPass.style.display = "inherit";
    backupBtn_runPass.style.display = "none";
    backupPrompt_runPass.style.display = "none";
}
var backupBtn_runPass_op = document.getElementById("backup-img-btn-runPass-op");
var backupImg_runPass_op = document.getElementById("backup-img-runPass-op");
var backupPrompt_runPass_op = document.getElementById("backup-prompt-runPass-op");

backupBtn_runPass_op.onclick = function() {
    backupImg_runPass_op.style.display = "inherit";
    backupBtn_runPass_op.style.display = "none";
    backupPrompt_runPass_op.style.display = "none";
}
