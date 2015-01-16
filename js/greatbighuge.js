var debug = false;
var fontColorIndex = Math.floor(Math.random() * 9);
var backgroundColorIndex = Math.floor(Math.random() * 9);
var guidePopup = document.getElementsByTagName('div')[0];
var target = document.getElementsByTagName('center')[0];
var content = target.textContent;
var unchangedTime = 0;

if (debug) console.log("Initial run.");
run(target);

// Get height and width of element
function getTextSize(targetElement) {
  return {
    height: targetElement.offsetHeight,
    width: targetElement.offsetWidth
  };
}

// Get height and width of viewport in browser
function getViewSize() {
  return {
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20,
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  };
}

// Compute and change font size and line height
function resize(targetElement, compressor) {
  var newSize = getTextSize(targetElement).width / (compressor * 10);
  targetElement.style.fontSize = newSize + "px";
  targetElement.style.lineHeight = newSize + "px";
}

// Fit target element to viewport
function run(targetElement) {
  var compressor = 1;
  resize(targetElement, compressor);
  var view = getViewSize();
  var text = getTextSize(targetElement);

  // Increase size of text if shorter than viewport
  while (text.height < view.height) {

    compressor -= 0.1

    resize(targetElement, compressor);
    text = getTextSize(targetElement);
  }
  if (debug) console.log("Got past increasing text size.");

  // Downsize text if taller than viewport
  while (text.height > view.height) {

    compressor += 0.1;

    resize(targetElement, compressor);
    text = getTextSize(targetElement);
  }
  if (debug) console.log("Got past decreasing text height.");

  // Downsize text if wider than viewport
  while (document.body.scrollWidth > document.body.clientWidth) {
    compressor += 0.1;

    resize(targetElement, compressor);
    text = getTextSize(targetElement);
  }
  if (debug) console.log("Got past decreasing text width.");

}

// Resize target element on change
function resizeIfChanged() {
  if (target.textContent != content) {
    if (debug) console.log("Content changed, running script.");
    content = target.textContent;
    run(target);
    unchangedTime = 0;
  } else {
    unchangedTime += 1;
  }

  // Stop blinking cursor
  if (unchangedTime > 5) {
    target.blur();
  }

  // Reset
  if (unchangedTime > 5 && target.textContent == "") {
    if (debug) console.log("Resetting text to default.");
    target.textContent = "GREAT BIG HUGE";
  }
}

// Get color
// colorIndex (int) number 0-9
// shade (string) either "light" or "dark"
// return: rgba(#, #, #, #)
function getColor(colorIndex, shade) {
  var colors = [
    {light: 'rgba(26, 188, 156, 1.0)', dark: 'rgba(22, 160, 133, 1.0)'},
    {light: 'rgba(46, 204, 113, 1.0)', dark: 'rgba(39, 174, 96, 1.0)'},
    {light: 'rgba(52, 152, 219, 1.0)', dark: 'rgba(41, 128, 185, 1.0)'},
    {light: 'rgba(155, 89, 182, 1.0)', dark: 'rgba(142, 68, 173, 1.0)'},
    {light: 'rgba(52, 73, 94, 1.0)', dark: 'rgba(44, 62, 80, 1.0)'},
    {light: 'rgba(241, 196, 15, 1.0)', dark: 'rgba(243, 156, 18, 1.0)'},
    {light: 'rgba(230, 126, 34, 1.0)', dark: 'rgba(211, 84, 0, 1.0)'},
    {light: 'rgba(231, 76, 60, 1.0)', dark: 'rgba(192, 57, 43, 1.0)'},
    {light: 'rgba(236, 240, 241, 1.0)', dark: 'rgba(189, 195, 199, 1.0)'},
    {light: 'rgba(149, 165, 166, 1.0)', dark: 'rgba(127, 140, 141, 1.0)'}
  ];
  return colors[colorIndex][shade];
}

// Increment index, wrap around if above 10 or below 1
// index (int) 1-10
// direction (string) either 'up' or 'down'
// return: int
function incrementIndex(index, direction) {
  if (direction == 'up') {
    return index < 9 ? index + 1 : index - 9;
  } else if (direction == 'down') {
    return index > 0 ? index - 1 : index + 9;
  }
}

// Handle key input
function keyHandler(event) {
  // Up arrow
  if (event.keyCode == 38) {

    target.blur();
    if (debug) console.log("User changed font color.");
    fontColorIndex = incrementIndex(fontColorIndex, 'up');
    target.style.color = getColor(fontColorIndex, 'light');

  // Down arrow
  } else if (event.keyCode == 40) {

    target.blur();
    if (debug) console.log("User changed font color back.");
    fontColorIndex = incrementIndex(fontColorIndex, 'down');
    target.style.color = getColor(fontColorIndex, 'light');

  // Right arrow
  } else if (event.keyCode == 39) {

    target.blur();
    if (debug) console.log("User changed background color.");
    backgroundColorIndex = incrementIndex(backgroundColorIndex, 'up');
    document.body.style.backgroundColor = getColor(backgroundColorIndex, 'dark');

  // Left arrow
  } else if (event.keyCode == 37) {

    target.blur();
    if (debug) console.log("User changed background color back.");
    backgroundColorIndex = incrementIndex(backgroundColorIndex, 'down');
    document.body.style.backgroundColor = getColor(backgroundColorIndex, 'dark');

  // Remove guide text and clear default text
  } else {

    target.focus();
    if (content == "GREAT BIG HUGE") {
      target.textContent = "";
      content = "";
      guidePopup.style.display = "none";
      target.className = "vertical-center";
    }
  }
}

// Resize text if it is changed
// Check every second
setInterval(resizeIfChanged, 2000);
window.onkeydown = keyHandler;
window.onresize = function(event) {
  if (debug) console.log("Window resized.");
  run(target);
};
