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
    setTimeout(startTime, 1000);
}

startTime();

function toggleVisibility(id) {
    var element = document.getElementById(id);
    if (element.className == "add") {
        element.className = "remove";
        setTimeout(function () {
            element.className = "hidden";
        }, removeTimeMs - 10);
    } else {
        element.className = "add";
    }
}

document.getElementById("show-clock")
    .addEventListener("click", function () { toggleVisibility("clock"); });
document.getElementById("show-temperature")
    .addEventListener("click", function () { toggleVisibility("temperature"); });

var temperatureRefreshMs = 30 * 60 * 60; // 30 minutes
var url = "https://api.forecast.io/forecast/36e1f2fb4fbe2b7174ba570ea81b89d2/42.5883687,-70.8223791";

function getTemperature() {
    var url = "https://api.adamvig.com/gocostudent/2.5/temperature?username=a&password=YQ==";
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            document.getElementById("temperature").innerHTML = JSON.parse(xmlHttp.responseText).data + "°F";
        }
    };
    xmlHttp.open("GET", url, true); // true for asynchronous
    xmlHttp.send(null);
}

getTemperature();
setInterval(getTemperature, temperatureRefreshMs);
