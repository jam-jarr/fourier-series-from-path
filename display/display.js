const __dirname = window.location.href;
const decodedPath = decodeURI(__dirname.split("=")[1]);

var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute("d", decodedPath);

const PRECISION = 1 / 10;
const N = 50;

const totalLoops = 2 * N + 1;
let n = -N;
let cArr = [];
while (n < totalLoops) {
  cArr.push(integrate(n, PRECISION));
  n++;
}

function integrate(n, deltaT) {
  // numerically integrate the function f(t) * e^(-n * 2 * pi * i * t) dt from 0 to 1
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

// now that we have the c values, compute the resulting vectors

// render visualization

Pts.quickStart("#pt", "#123");

(function () {
  space.add({
    start: (bound) => {},
    animate: (time, ftime) => {},
  });
})();

// (function () {
//   var pairs = [];

//   space.add({
//     start: (bound) => {
//       let r = space.size.minValue().value / 2;

//       // create 200 lines
//       for (let i = 0; i < 200; i++) {
//         let ln = new Group(Pt.make(2, r, true), Pt.make(2, -r, true));
//         ln.moveBy(space.center).rotate2D((i * Math.PI) / 200, space.center);
//         pairs.push(ln);
//       }
//     },

//     animate: (time, ftime) => {
//       for (let i = 0, len = pairs.length; i < len; i++) {
//         // rotate each line by 0.1 degree and check collinearity with pointer
//         let ln = pairs[i];
//         ln.rotate2D(Const.one_degree / 10, space.center);
//         let collinear = Line.collinear(ln[0], ln[1], space.pointer, 0.1);

//         if (collinear) {
//           form.stroke("#fff").line(ln);
//         } else {
//           // if not collinear, color the line based on whether the pointer is on left or right side
//           let side = Line.sideOfPt2D(ln, space.pointer);
//           form
//             .stroke(side < 0 ? "rgba(255,255,0,.1)" : "rgba(0,255,255,.1)")
//             .line(ln);
//         }
//         form.fillOnly("rgba(255,255,255,0.8").points(ln, 0.5);
//       }

//       form.fillOnly("#f03").point(space.pointer, 3, "circle");
//     },
//   });

//   //// ----

//   space.bindMouse().bindTouch().play();
// })();
