const refreshIntervalMs = 10000;
const removeTimeMs = 500;
const patternID = 'triangles-pattern';
const content = document.getElementById('triangles');

function makePattern() {
    const config = {
        height: window.innerHeight,
        width: window.innerWidth
    };
    const newPattern = trianglify(config).toCanvas();
    newPattern.id = patternID;
    newPattern.style.zIndex = 0;
    const oldPattern = document.getElementById(patternID);
    if (oldPattern) {
        oldPattern.className = 'remove';
        content.appendChild(newPattern);
        setTimeout(() => {
            content.removeChild(oldPattern);
            newPattern.style.zIndex = 1;
        }, removeTimeMs);
    } else {
        newPattern.style.zIndex = 1;
        newPattern.className = 'add';
        content.appendChild(newPattern);
    }
}

makePattern();
window.addEventListener("resize", makePattern);
window.setInterval(makePattern, refreshIntervalMs);
