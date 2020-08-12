const __dirname = window.location.href;
const decodedPath = decodeURI(__dirname.split("=")[1]);

var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute("d", decodedPath);

const PRECISION = 0.01;
const N = 5;

let n = -N;
let constantComponent = [];
// calculate constants in range: [-N, N]
for (let n = -N; n <= N; n++) {
  constantComponent.push(integrate(n));
}

function integrate(n) {
  // numerically integrate the function f(t) * e^(-n * 2 * pi * i * t) dt from 0 to 1
  const totalLength = path.getTotalLength();
  let getPointAtNormalizedLength = (len) =>
    path.getPointAtLength(len * totalLength);
  let sum = math.complex(0, 0);
  let normalizedLength = 0;
  while (normalizedLength <= 1) {
    const val = math.evaluate(
      `(${pointToComplexNumber(
        getPointAtNormalizedLength(normalizedLength)
      )}) * e^(-${n} * 2 * pi * i * ${normalizedLength}) * ${PRECISION}`
    );
    sum = math.add(sum, val);
    normalizedLength += PRECISION;
  }
  return sum;
}

function pointToComplexNumber(point) {
  return math.complex(point.x, point.y);
}

// render visualization

function getSortedArray() {
  // reorder array so that elements are in opposite pairs [0, 1, -1, 2, -2, 3, -3, ...]
  // looks a little funky to reorder an array from the middle
  let reorderedArr = [];
  let i = Math.floor(constantComponent.length / 2);
  let move = 1;
  while (i < constantComponent.length) {
    reorderedArr.push(constantComponent[i]);
    i = move % 2 === 0 ? i - move : i + move;
    move++;
  }
  return reorderedArr;
}

function evalAtTime(value, i, t) {
  // console.log(`(${value}) * e^(${i - N} * 2 * pi * i * ${t})`);
  // console.log(math.evaluate(`(${value}) * e^(${i - N} * 2 * pi * i * ${t})`));
  return math.evaluate(`(${value}) * e^(${i - N} * 2 * pi * i * ${t})`);
}

function complexNumberToVector(complex) {
  return {
    x: complex.re,
    y: complex.im,
  };
}

const test1 = [];
constantComponent.forEach((value, i) => {
  test1.push(evalAtTime(value, i, 0));
});

const test2 = [];
constantComponent.forEach((value, i) => {
  test2.push(evalAtTime(value, i, 0.35415));
});

console.log(constantComponent);
console.log(test1);
console.log(test2);

Pts.quickStart("#board", "#123");

(function () {
  // var complex = math.complex("50 + 50i");
  var previous = null;
  space.add((time, ftime) => {
    let lines = [];
    const t = (time % 1000) / 1000;
    let vectors = constantComponent.map((value, i) => evalAtTime(value, i, t));
    const sortedArray = getSortedArray(vectors);
    let currentPoint = new Pt(space.center);
    sortedArray.forEach((value, i) => {
      let nextPoint = currentPoint.$add(
        complexNumberToVector(math.multiply(value, 2))
      );
      let ln = new Group(currentPoint, nextPoint);
      currentPoint = nextPoint;
      lines.push(ln);
    });
    for (let i = 0; i < lines.length; i++) {
      const ln = lines[i];
      form.stroke("#fff").line(ln);
      form.fillOnly("rgba(255,255,255,0.8").points(ln, 0.5);
    }

    // let center = new Pt(space.center);
    // let vector = complexNumberToVector(complex);
    // let ln = new Group(center, center.clone().add(vector));
    // form.stroke("#fff").line(ln);
    // form.fillOnly("rgba(255,255,255,0.8").points(ln, 0.5);
    // const nomalizeComplexVector = (n) => {
    //   const mag = Math.sqrt(n.re * n.re + n.im * n.im);
    //   return math.complex(n.re / mag, n.im / mag);
    // };
    // complex = math.multiply(
    //   complex,
    //   nomalizeComplexVector(math.complex("1 + 0.1i"))
    // );
  });

  //// ----
  space.play();
  // space.playOnce(500);
})();
