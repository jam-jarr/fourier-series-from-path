// decoding path from parameters
// var search = location.search.substring(1);
// let paramters = JSON.parse(
//   '{"' +
//     decodeURI(search)
//       .replace(/"/g, '\\"')
//       .replace(/&/g, '","')
//       .replace(/=/g, '":"') +
//     '"}'
// );
const path = sessionStorage.getItem('svg-data')

var pathElement = document.createElementNS(
  "http://www.w3.org/2000/svg",
  'svg'
);
pathElement.innerHTML = path
pathElement = pathElement.firstElementChild

console.log(pathElement)
console.log(pathElement.constructor.name)

console.log(pathElement.firstElementChild.constructor.name);
console.log(pathElement.firstElementChild.firstElementChild.constructor.name);

console.log('------')
for (let i = 0; i < pathElement.children.length; i++) {
  console.log(pathElement.children[i])
}

// globals
let constantComponent = [];
let doClearTrailingLine = false;

// defaults
let precision = 0.005;
let N = 20;
let scale = 5;
let maxTrailLength = 500;

// get html elements for sliders and button
const resetButton = document.getElementById("resetButton");

const nSlider = document.getElementById("nSlider");
const nValue = document.getElementById("nValue");

const precisionSlider = document.getElementById("precisionSlider");
const precisionValue = document.getElementById("precisionValue");

const scaleSlider = document.getElementById("scaleSlider");
const scaleValue = document.getElementById("scaleValue");

const maxTrailLengthSlider = document.getElementById("maxLengthSlider");
const maxTrailLengthValue = document.getElementById("maxLengthValue");

// bind listeners
resetButton.onclick = () => {
  N = parseInt(nSlider.value);
  precision = parseFloat(precisionSlider.value);
  doClearTrailingLine = true;
  generateConstants();
};

nSlider.oninput = () => setOutput(nValue, nSlider.value);
precisionSlider.oninput = () =>
  setOutput(precisionValue, precisionSlider.value);
scaleSlider.oninput = () => {
  setOutput(scaleValue, scaleSlider.value);
  scale = parseInt(scaleSlider.value);
};
maxTrailLengthSlider.oninput = () => {
  setOutput(maxTrailLengthValue, maxTrailLengthSlider.value);
  maxTrailLength = parseInt(maxTrailLengthSlider.value);
};

function setOutput(output, value) {
  output.innerHTML = output
    .getAttribute("defaultString")
    .replace("{value}", value);
}

// sync sliders and default values
syncSlidersAndValues(nSlider, nValue, N);
syncSlidersAndValues(precisionSlider, precisionValue, precision);
syncSlidersAndValues(scaleSlider, scaleValue, scale);
syncSlidersAndValues(maxTrailLengthSlider, maxTrailLengthValue, maxTrailLength);

function syncSlidersAndValues(slider, output, defaultValue) {
  slider.value = defaultValue;
  setOutput(output, slider.value);
}

// calculating the numbers for the visualization
// NOTE: this can be a very demanding process, consider moving to server-side processing
function generateConstants() {
  // calculate constants in range: [-N, N]
  constantComponent = [];
  for (let n = -N; n <= N; n++) {
    constantComponent.push(integrate(n));
  }
}

function integrate(n) {
  // numerically integrate the function f(t) * e^(-n * 2 * pi * i * t) dt from 0 to 1
  // for a further dissection of the math involved in this visualization, go watch 3Blue1Brown's video on the Fourier Series: https://www.youtube.com/watch?v=r6sGWTCMz2k

  // this is a bit of a hack, I'm gonna be honest, but I'm trying; Maybe I should move this processing to server-side? Maybe I should research other ways to do this?
  const actualPathElements = pathElement.getElementsByTagName('path');
  let sum = math.complex(0, 0);
  for (let i = 0; i < actualPathElements.length; i++) {
    const actualPathElement = actualPathElements[i];

    // end hack
    const totalLength = actualPathElement.getTotalLength();
    let getPointAtNormalizedLength = (len) =>
      actualPathElement.getPointAtLength(len * totalLength);
    let normalizedLength = 0;
    while (normalizedLength <= 1) {
      const val = math.evaluate(
        `(${pointToComplexNumber(
          getPointAtNormalizedLength(normalizedLength)
        )}) * e^(-${n} * 2 * pi * i * ${normalizedLength}) * ${precision}`
      );
      sum = math.add(sum, val);
      normalizedLength += precision;
    }
  }
  return sum;
}

function pointToComplexNumber(point) {
  return math.complex(point.x, point.y);
}

function complexNumberToVector(complex) {
  return {
    x: complex.re,
    y: complex.im,
  };
}

function getSortedArray(array) {
  // reorder array so that elements are in opposite pairs [0, 1, -1, 2, -2, 3, -3, ...]
  // looks a little funky to reorder an array from the middle
  let reorderedArr = [];
  let i = Math.floor(array.length / 2);
  let move = 1;
  while (i < array.length) {
    reorderedArr.push(array[i]);
    i = move % 2 === 0 ? i - move : i + move;
    move++;
  }
  return reorderedArr;
}

function evalAtTime(value, i, t) {
  return math.evaluate(`(${value}) * e^(${i - N} * 2 * pi * i * ${t})`);
}

// generate constants for fourier series
generateConstants();

// render visualization
Pts.quickStart("#board", "#123");

(function () {
  let trailingLine = new Group();
  space.add((time, ftime) => {
    console.log('frame')
    if (doClearTrailingLine) {
      trailingLine = new Group();
      doClearTrailingLine = false;
    }
    let lines = [];
    const t = (time % 10000) / 10000; // t goes from 0 to 1 every 10000 milliseconds
    let vectors = constantComponent
      .map((value, i) => evalAtTime(value, i, t)) // rotate vectors according to time
      .map((vector) => math.multiply(vector, scale)); // scale everything by some amount
    let sortedArray = getSortedArray(vectors);
    // remove first vector — its just a static vector that points to the middle anyways, so it makes more sense to just center the whole thing
    sortedArray = sortedArray.slice(1);

    let currentPoint = new Pt(space.center);
    sortedArray.forEach((value, i) => {
      let nextPoint = currentPoint.$add(complexNumberToVector(value));
      let ln = new Group(currentPoint, nextPoint);
      currentPoint = nextPoint;
      lines.push(ln);
    });

    // add to trailing line; 'normalize' each point with respect to the scale and the center of the screen
    trailingLine.push(currentPoint.$subtract(space.center).$divide(scale));

    // rotating vectors
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      const dist = Math.sqrt(
        Math.pow(ln[0][0] - ln[1][0], 2) + Math.pow(ln[0][1] - ln[1][1], 2)
      );
      // form.stroke("#fff").circle(ln[0], dist);
      const circle = Pts.Circle.fromCenter(ln[0], dist);
      form.strokeOnly("rgba(255, 255, 255, 0.2").circle(circle);
      form.stroke("#fff").line(ln);
      form.fillOnly("rgba(255,255,255,0.8").points(ln, 0.5);
    }

    // trailing line
    if (trailingLine.length > maxTrailLength) {
      trailingLine = trailingLine.slice(trailingLine.length - maxTrailLength);
    }

    form
      .strokeOnly("#fff", 2.5)
      .line(trailingLine.map((pt) => pt.$multiply(scale).$add(space.center))); // reverse the 'normalization' from earlier
  });

  space.play();
})();
