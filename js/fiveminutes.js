// Timer
var element = {
  body: document.body,
  timerControls: document.getElementById("timer-controls"),
  startButton: document.getElementById("start-button"),
  restartButton: document.getElementById("restart-button"),
  pauseButton: document.getElementById("pause-button"),
  stopButton: document.getElementById("stop-button"),
  timerInput: document.getElementById("timer-input"),
  timerDisplay: document.getElementById("timer-display"),
};

var themeName = "default"; // "default" or "dark"

// Toggle display of element
var toggleElement = function (element) {
  element.style.display = element.style.display == "none" ? "" : "none";
};

// Toggle class on element
var toggleClass = function (element, className) {
  if (element.className.indexOf(className) == -1) {
    element.className = element.className + " " + className;
  } else {
    element.className = element.className.replace(className, '').trim();
  }
};

/**
 * Change theme of timer
 * @param {string} themeName Name of class to apply to body element
 */
var changeTheme = function (themeName) {
  element.body.className = themeName;
};

/**
 * Convert milliseconds to seconds
 * @param {number} ms Milliseconds
 */
var msToSec = function (ms) {
  return ms / 1000;
};

/**
 * Create RGBA color from red, green, and blue values
 * @param {object} colors Contains red, green, and blue values 0-255
 */
var makeRgbaColor = function (colors) {
  return "rgba(" +
    colors.red   + ", " +
    colors.green + ", " +
    colors.blue  + ", " +
    (colors.opacity || "1.0") + ")";
};

/**
 * Update color of an element to represent decreasing time
 * @param {HTMLElement} element     Element to style
 * @param {number}      startTime   Starting time in milliseconds
 * @param {number}      currentTime Current time in milliseconds
 * @param {number}      endTime     (optional) Ending time in milliseconds
 */
var updateBackgroundColor = function (element, startTime, currentTime, endTime) {

  var MAX_COLOR_VALUE = 255;
  endTime = endTime || 0;
  var totalSec = msToSec(startTime - endTime);
  var elapsedSec = totalSec - msToSec(currentTime);

  var colors = {
    red: 0,
    green: MAX_COLOR_VALUE,
    blue: 25,
    opacity: 0.85
  };

  var increment = MAX_COLOR_VALUE / totalSec;

  colors.red += Math.round(elapsedSec * increment);
  colors.green -= Math.round(elapsedSec * increment);

  element.style.backgroundColor = makeRgbaColor(colors);
};

var formatTime = function (ms) {
  var seconds = Math.floor((ms / 1000) % 60),
      minutes = Math.floor((ms / (60 * 1000)) % 60);

  if (seconds < 10) {
    seconds = "0" + seconds.toString();
  }

  return minutes + ":" + seconds;
};

var updateTimer = function () {
  var currentTime = formatTime(timer.lap());
  element.timerDisplay.innerHTML = currentTime;
  if (themeName == "default") {
    updateBackgroundColor(element.body, countdownTimeMs, timer.lap());
  }
};

var finishTimer = function () {
  element.timerDisplay.innerHTML = "0:00";
  toggleClass(element.body, "fade-in-out");
};

var timer = new Tock({
  countdown: true,
  interval: 1000,
  callback: updateTimer,
  complete: finishTimer
});

var countdownTime = "05:00";
var countdownTimeMs = timer.timeToMS(countdownTime);
element.timerDisplay.innerHTML = formatTime(countdownTimeMs);
changeTheme(themeName);

var startTimer = function () {

  toggleElement(element.startButton);
  toggleElement(element.timerControls);

  timer.start(countdownTime);
};

var resetTimer = function () {
  timer.reset();
  timer.start(countdownTime);
};

var pauseTimer = function () {
  timer.pause();
  toggleClass(element.timerDisplay, "fade-in-out");
};

var stopTimer = function () {
  timer.stop();
  timer.reset();
  toggleElement(element.startButton);
  toggleElement(element.timerControls);
  element.timerDisplay.innerHTML = formatTime(countdownTimeMs);
};

// Click Events
element.startButton.addEventListener("click", startTimer);
element.restartButton.addEventListener("click", resetTimer);
element.pauseButton.addEventListener("click", pauseTimer);
element.stopButton.addEventListener("click", stopTimer);


// Database


// Session Sync
