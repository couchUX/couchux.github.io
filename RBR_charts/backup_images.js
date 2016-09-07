/* set a backup image option */
var backupButtons = document.getElementById("backup-img-button");
var backupImgs = document.getElementById("backup-img");
var backupImgPrompt = document.getElementById("backup-img-prompt");

backupButtons.onclick = function() {
    backupImgs.style.display = "inherit";
    backupButtons.style.display = "none";
    backupImgPrompt.style.display = "none";
}
