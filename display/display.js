const __dirname = window.location.href;
const decodedPath = decodeURI(__dirname.split("=")[1]);

var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute("d", decodedPath);

const PRECISION = 1 / 10;
const N = 50;
// let points = [];
// while (length < path.getTotalLength()) {
//   const point = path.getPointAtLength(length);
//   points.push(point);
//   length += LENGTH_INCREMENT;
// }

// console.log(points);
const totalLoops = 2 * N + 1;
let n = -N;
let cArr = [];
while (n < totalLoops) {
  cArr.push(integrate(n, PRECISION));
  n++;
}
console.log(cArr);

function integrate(n, deltaT) {
  // numerically integrate the function f(t) * e^(-n * 2 * pi * i * t) dt from 0 to 1
  console.log(deltaT);
  const totalLength = path.getTotalLength();
  let getPointAtNormalizedLength = (len) =>
    path.getPointAtLength(len * totalLength);
  let sum = math.complex(0, 0);
  let normalizedLength = 0;
  while (normalizedLength <= 1) {
    const val = math.evaluate(
      `${pointToComplexNumber(
        getPointAtNormalizedLength(normalizedLength)
      )} * e^(-${n} * 2 * pi * i * ${normalizedLength}) * ${deltaT}`
    );
    sum = math.add(sum, val);
    normalizedLength += deltaT;
  }
  return sum;
}

function pointToComplexNumber(point) {
  return math.complex(point.x, point.y);
}

let p = new Pts.Pt(1, 2, 3);
console.log(p);
