
function getTextSize(targetElement) {
  return {
    height: targetElement.offsetHeight,
    width: targetElement.offsetWidth
  };
}

function getViewSize() {
  return {
    height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) - 20,
    width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
  };
}

function resize(targetElement, compressor) {
  var newSize = getTextSize(targetElement).width / (compressor * 10);
  targetElement.style.fontSize = newSize + "px";
  targetElement.style.lineHeight = newSize + "px";
}

function run(targetElement) {
  var compressor = 1;
  resize(targetElement, compressor);
  var view = getViewSize();
  var text = getTextSize(targetElement);

  // Increase size of text if shorter than viewport
  while (text.height < view.height) {

    compressor -= 0.001;

    resize(targetElement, compressor);
    text = getTextSize(targetElement);
  }

  // Downsize text if taller than viewport
  while (text.height > view.height) {

    compressor += 0.001;

    resize(targetElement, compressor);
    text = getTextSize(targetElement);
  }

  // Downsize text if wider than viewport
  while (document.body.scrollWidth > document.body.clientWidth) {
    compressor += 0.1;

    resize(targetElement, compressor);
    text = getTextSize(targetElement);
  }
}

var target = document.getElementsByTagName('center')[0];

run(target);

var content = target.textContent;
var unchangedTime = 0;

target.onfocus = function () {
  if (content == "GREAT BIG HUGE") {
    target.textContent = "";
  }
};

// Resize text if it is changed
// Check every second
setInterval(function () {
  if (target.textContent != content) {
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
}, 1000);
