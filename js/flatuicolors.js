var colors = {
  "turquoise": {
    hex: "1abc9c",
    rgb: "rgb(26, 188, 156)",
    rgba: "rgba(26, 188, 156, 1.0)"
  },
  "emerald": {
    hex: "2ecc71",
    rgb: "rgb(46, 204, 113)",
    rgba: "rgba(46, 204, 113, 1.0)"
  },
  "peter-river": {
    hex: "3498db",
    rgb: "rgb(52, 152, 219)",
    rgba: "rgba(52, 152, 219, 1.0)"
  },
  "amethyst": {
    hex: "9b59b6",
    rgb: "rgb(155, 89, 182)",
    rgba: "rgba(155, 89, 182, 1.0)"
  },
  "wet-asphalt": {
    hex: "34495e",
    rgb: "rgb(52, 73, 94)",
    rgba: "rgba(52, 73, 94, 1.0)"
  },
  "green-sea": {
    hex: "16a085",
    rgb: "rgb(22, 160, 133)",
    rgba: "rgba(22, 160, 133, 1.0)"
  },
  "nephritis": {
    hex: "27ae60",
    rgb: "rgb(39, 174, 96)",
    rgba: "rgba(39, 174, 96, 1.0)"
  },
  "belize-hole": {
    hex: "2980b9",
    rgb: "rgb(41, 128, 185)",
    rgba: "rgba(41, 128, 185, 1.0)"
  },
  "wisteria": {
    hex: "8e44ad",
    rgb: "rgb(142, 68, 173)",
    rgba: "rgba(142, 68, 173, 1.0)"
  },
  "midnight-blue": {
    hex: "2c3e50",
    rgb: "rgb(44, 62, 80)",
    rgba: "rgba(44, 62, 80, 1.0)"
  },
  "sun-flower": {
    hex: "f1c40f",
    rgb: "rgb(241, 196, 15)",
    rgba: "rgba(241, 196, 15, 1.0)"
  },
  "carrot": {
    hex: "e67e22",
    rgb: "rgb(230, 126, 34)",
    rgba: "rgba(230, 126, 34, 1.0)"
  },
  "alizarin": {
    hex: "e74c3c",
    rgb: "rgb(231, 76, 60)",
    rgba: "rgba(231, 76, 60, 1.0)"
  },
  "clouds": {
    hex: "ecf0f1",
    rgb: "rgb(236, 240, 241)",
    rgba: "rgba(236, 240, 241, 1.0)"
  },
  "concrete": {
    hex: "95a5a6",
    rgb: "rgb(149, 165, 166)",
    rgba: "rgba(149, 165, 166, 1.0)"
  },
  "orange": {
    hex: "f39c12",
    rgb: "rgb(243, 156, 18)",
    rgba: "rgba(243, 156, 18, 1.0)"
  },
  "pumpkin": {
    hex: "d35400",
    rgb: "rgb(211, 84, 0)",
    rgba: "rgba(211, 84, 0, 1.0)"
  },
  "pomegranate": {
    hex: "c0392b",
    rgb: "rgb(192, 57, 43)",
    rgba: "rgba(192, 57, 43, 1.0)"
  },
  "silver": {
    hex: "bdc3c7",
    rgb: "rgb(189, 195, 199)",
    rgba: "rgba(189, 195, 199, 1.0)"
  },
  "asbestos": {
    hex: "7f8c8d",
    rgb: "rgb(127, 140, 141)",
    rgba: "rgba(127, 140, 141, 1.0)"
  }
};

// Select text in an element
function selectText(htmlElement) {
  if (document.body.createTextRange) { // ms
      var range = document.body.createTextRange();
      range.moveToElementText(htmlElement);
      range.select();
  } else if (window.getSelection) { // moz, opera, webkit
      var selection = window.getSelection();
      var range = document.createRange();
      range.selectNodeContents(htmlElement);
      selection.removeAllRanges();
      selection.addRange(range);
  }
}

// Get first element with a class name
function getElement(className) {
  return document.getElementsByClassName(className)[0];
}

// Get overlay and color elements
var overlayElement = getElement("overlay");
var colorElement = getElement("color");

// Toggle overlay visibility
function toggleOverlay() {
  if (overlayElement.style.display == "block") {
    overlayElement.style.display = "none";
  } else {
    overlayElement.style.display = "block";
  }
}

// Determine platform
var isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
var isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

// Toggle copy info display based on platform
if (isMobile) getElement("mobile-info").style.display = "block";
else if (isMac) getElement("mac-info").style.display = "block";
else getElement("default-info").style.display = "block";

// Get current mode from dropdown on page
var mode = "hex";
var selectElement = document.getElementsByTagName('select')[0];
selectElement.addEventListener("change", function () {
  mode = selectElement.value;
});

// Get color from colors object
function getColor(colorName) {
  if (mode == "symbol-hex") {
    return "#" + colors[colorName].hex;
  } else {
    return colors[colorName][mode];
  }
}

// Show color overlay
function showColor(event) {
  var colorName = event.srcElement.classList[0];
  var color = getColor(colorName);
  overlayElement.style.background = colors[colorName].rgba;
  colorElement.innerHTML = color;
  toggleOverlay();
  selectText(colorElement);
}

// Add showColor() to onclick event of each button
var buttons = {};
for (var colorName in colors) {
  buttons[colorName] = getElement(colorName);
  buttons[colorName].addEventListener("click", showColor);
};

// Hide overlay on click
overlayElement.addEventListener("click", toggleOverlay);

// Hide overlay after user copies color
if (!isMobile) {
  window.onkeydown = function (event) {
    // Overlay is visible
    if (overlayElement.style.display == "block") {
      // Ctrl + C or Cmd + C pressed
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 67) {
        setTimeout(toggleOverlay, 100);
      }
    }
  };
}
