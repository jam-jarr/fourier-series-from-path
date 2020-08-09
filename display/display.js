const __dirname = window.location.href;
const decodedPath = decodeURI(__dirname.split("=")[1]);

var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
path.setAttribute("d", decodedPath);

const LENGTH_INCREMENT = 2;

let points = [];
while (length < path.getTotalLength()) {
  const point = path.getPointAtLength(length);
  points.push(point);
  length += LENGTH_INCREMENT;
}
console.log(points.length);
