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
console.log(pathElement)
console.log('------')
for (let i = 0; i < pathElement.children.length; i++) {
  console.log(pathElement.children[i])
}

// globals
let constantComponents = [];
let doClearTrailingLine = false;

// defaults
let precision = 0.005;
let N = 20;
let scale = 5;
let maxTrailLength = 500;

// get html elements for sliders and button
const resetButton = document.getElementById("resetButton");

const saveButton = document.getElementById("save");

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

saveButton.onclick = () => {
  const canvas = document.getElementById("board_canvas")
  console.log(canvas.toDataURL())
}

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
  // calculate constants in range: [-N, N] for each path
  // TODO: refactor to map
  //get 
  const svg = pathElement.getElementsByTagName('svg')[0];
  console.log('----------');
  console.log(svg);
  console.log('----------');
  const paths = [...svg.querySelectorAll('circle, ellipse, line, polyline, polygon, path, rect')]
  // const paths = [...pathElement.firstChild.children]
  console.log('bbbbbb')
  console.log(paths)
  constantComponents = [];
  paths.forEach((path) => {
    console.log(path);
    let constantComponent = []
    for (let n = -N; n <= N; n++) {
      constantComponent.push(integrate(path, n));
    }
    constantComponents.push(constantComponent)
  })
}

function integrate(path, n) {
  // numerically integrate the function f(t) * e^(-n * 2 * pi * i * t) dt from 0 to 1
  // for a further dissection of the math involved in this visualization, go watch 3Blue1Brown's video on the Fourier Series: https://www.youtube.com/watch?v=r6sGWTCMz2k

  // this is a bit of a hack, I'm gonna be honest, but I'm trying; Maybe I should move this processing to server-side? Maybe I should research other ways to do this?
  // const actualPathElements = pathElement.firstChild.children;
  // console.log('test');
  // console.log(actualPathElements)

  let sum = math.complex(0, 0);
  const totalLength = path.getTotalLength();
  let getPointAtNormalizedLength = (len) =>
    path.getPointAtLength(len * totalLength);
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
  return sum;
}

function generalizedIntegrate(points, n) {
  let sum = math.complex(0, 0)
  for (let i = 0; i < points.length; i++) {
    const point = points[i]
    const percentOfPoints = (points.length + 1) / i
    const percentOfOnePoint = (1 / (points.length + 1))
    const val = math.evaluate(
      `(${pointToComplexNumber(
        point
      )}) * e^(-${n} * 2 * pi * i * ${percentOfPoints}) * ${percentOfOnePoint}`
    );
    sum = math.add(sum, val);
    normalizedLength += precision;
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
// setup
Pts.namespace(window);
let space = new CanvasSpace("#board").setup({ bgcolor: "transparent" })
let form = space.getForm();

let trailingLines;
let fakeTime;
let correctForPause;

space.add({
  start: (bound, space) => {
    trailingLines = new Array(constantComponents.length);
    trailingLines.fill(new Group())
    const arrayOfObject = (size, object) => {
      const a = new Array(size);
      for (let i = 0; i < size; i++) {
        a[i] = Object.create(object);
      }
      return a;
    }
    trailingLines = arrayOfObject(constantComponents.length, new Group())
    fakeTime = 0;
    correctForPause = false

  },
  animate: (time, ftime, space) => {
    fakeTime += ftime;

    // Corrections
    if (doClearTrailingLine) {
      trailingLines.fill(new Group())
      doClearTrailingLine = false;
    }
    if (correctForPause) {
      fakeTime -= ftime
      correctForPause = false
    }

    for (let index = 0; index < constantComponents.length; index++) {
      
      const t = (fakeTime % 10000) / 10000; // t goes from 0 to 1 every 10000 milliseconds
      let lines = [];
      let vectors = constantComponents[index]
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
      trailingLines[index].push(currentPoint.$subtract(space.center).$divide(scale));
      // rotating vectors
      // skip first vector
      for (let i = 1; i < lines.length; i++) {
        const ln = lines[i];
        const dist = Math.sqrt(
          Math.pow(ln[0][0] - ln[1][0], 2) + Math.pow(ln[0][1] - ln[1][1], 2)
        );
        const circle = Circle.fromCenter(ln[0], dist);
        form.strokeOnly("rgba(255, 255, 255, 0.2").circle(circle);
        form.strokeOnly("#fff", 1).line(ln);
        form.fillOnly("rgba(255,255,255,0.8").points(ln, 0.5);
      }

      // trailing line shearing
      if (trailingLines[index].length > maxTrailLength) {
        trailingLines[index] = trailingLines[index].slice(trailingLines[index].length - maxTrailLength);
      }
      form
        .strokeOnly("#fff", 2.5)
        .line(trailingLines[index].map((pt) => pt.$multiply(scale).$add(space.center))); // reverse the 'normalization' from earlier
    }

    window.onfocus = () => {
      space.resume()
      correctForPause = true
    }
    window.onblur = () => {
      space.pause(false)
    }
  },
  action: (x, y, type) => {
    if (type === 'down') {
      space.clear('transparent')
    } else if (type === 'up') {
      const canvas = document.getElementById("board_canvas")
      console.log(canvas.toDataURL())
    }
  }
});
space.bindMouse().play();