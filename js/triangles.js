var refreshIntervalMs = 10000;
var removeTimeMs = 500;
var patternID = 'triangles';
var content = document.getElementById('content');
var makePattern = function () {
    var config = {
        height: window.innerHeight,
        width: window.innerWidth
    };
    var newPattern = Trianglify(config).canvas();
    newPattern.id = patternID;
    newPattern.style.zIndex = 0;
    var oldPattern = document.getElementById(patternID);
    if (oldPattern) {
        oldPattern.className = 'remove';
        content.appendChild(newPattern);
        setTimeout(function () {
            content.removeChild(oldPattern);
            newPattern.style.zIndex = 1;
        }, removeTimeMs);
    } else {
        newPattern.style.zIndex = 1;
        newPattern.className = 'add';
        content.appendChild(newPattern);
    }
};
makePattern();
window.addEventListener("resize", makePattern);
window.setInterval(makePattern, refreshIntervalMs);

var clock = document.getElementById("clock");

function checkTime(i) {
    if (i < 10) i = "0" + i;  // add zero in front of numbers < 10
    return i;
}

function startTime() {
    var today = new Date();
    var h = today.getHours();

    // Convert to twelve-hour time
    if (h > 12) {
        h -= 12;
    } else if (h === 0) {
        h = 12;
    }

    var m = today.getMinutes();

    // Pad with zero if less than ten
    if (m < 10) {
        m = "0" + m;
    }

    document.getElementById("clock").innerHTML = h + ":" + m;
    var t = setTimeout(startTime, 1000);
}

document.getElementById("show-clock")
    .addEventListener("click", function () {
    if (clock.className == "add") {
        clock.className = "remove";
        setTimeout(function () {
            clock.className = "hidden";
        }, removeTimeMs - 10);
    } else {
        clock.className = "add";
        startTime();
    }
});
