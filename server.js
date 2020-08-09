var express = require("express");
var path = require("path");
var app = express();

var PORT = 8080;

app.use(express.static(__dirname + "/upload"));
app.use(express.static(__dirname + "/display"));

app.get("/", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "upload/index.html"));
});
app.get("/display", function (req, res) {
  res.status(200).sendFile(path.join(__dirname, "display/display.html"));
});

app.listen(PORT, function () {
  console.log(`Server is running at http://localhost:${PORT}`);
});
