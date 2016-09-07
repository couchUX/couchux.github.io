/* set a backup image option */
var backupButtons = document.getElementById("backup-img-button");
var backupImgs = document.getElementById("backup-img");

backupButtons.onclick = function() {
    backupImgs.style.display = "inherit";
    backupButtons.style.display = "none";
}
