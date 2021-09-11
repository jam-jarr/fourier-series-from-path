let dropArea = document.getElementById("drop-area");

dropArea.addEventListener("drop", handleDrop, false);

const __dirname = window.location.href;

let FILE;

const DISPLAY_PATH = "/display";

const cardButtons = [...document.getElementsByClassName("card")];

const examples = {
  dog: `<g xmlns="http://www.w3.org/2000/svg" id="zZHJnr_1_"><g><path clip-rule="evenodd" d="m341.44 72.48c-4.996 5.373-16.788 6.249-19.439 15.36s-12.298 50.862-24.24 70.56c-1.711 22.575-5.242 43.325-1.92 68.16 0.512 3.827 2.866 6.739 3.6 10.8 2.746 2.787 11.308 2.142 11.04 7.2-0.214 4.048-15.984 4.37-19.199 1.68-6.181-5.172-4.091-18.73-9.12-24.48 0.391 7.822-1.031 15.667 2.399 21.36 1.779 2.952 9.235 4.252 9.12 8.4-0.185 6.643-18.83 1.623-20.16-0.48-2.101-3.322-1.912-9.327-3.84-14.399-2.19-5.765-3.423-5.582-3.12-12.96 0.308-7.478-2.403-17.44-3.6-25.681-1.598-11-2.987-21.504-6-28.8-33.955-4.925-58.845-18.915-96.24-20.4-14.532 23.549-37.729 38.432-58.8 55.44-1.453 6.972 1.004 14.763 1.44 22.08 2.946 1.99 9.732 0.78 9.6 5.28-0.109 3.701-13.088 4.427-16.56 2.159-6.799-4.439-3.471-22.006-8.4-28.079-14.843 4.438-17 23.64-22.32 38.399 2.486 2.285 9.844 2.29 7.92 6.96-2.098 5.092-19.677 1.365-20.4-2.399-1.232-6.421 3.276-16.929 4.56-22.801 1.385-6.33 1.811-17.056 4.8-22.56 0.893-1.644 4.24-2.775 5.52-4.08 5.983-6.097 16.533-14.781 18.72-23.76 3.528-14.487 8.287-30.359 7.2-48.72-4.202 16.561-11.877 27.42-24.72 34.56-15.535 8.636-36.694 1.528-54.96 1.92 9.262-6.627 28.635-3.066 41.04-5.28 35.111-6.264 21.791-55.728 52.8-67.2 20.893-7.729 42.031-12 71.52-12 9.277 0 48.22-1.306 60.72-3.12s26.796-11.99 41.04-19.68 29.986-35.007 53.28-36.72c11.954-0.879 20.691 3.304 26.4 9.12 8.817 8.984 9.726 22.967 22.08 29.52 2.517 1.335 4.622 0.951 5.04 3.6 0.617 3.918-3.49 10.69-5.521 12.72-10.04 10.039-31.3 5.056-41.28-1.68z" fill-rule="evenodd"/></g></g>`,
  initials: `<g id="layer1" transform="translate(-66.467791,-122.71825)"> <path id="text63872" style="font-style:normal;font-variant:normal;font-weight:normal;font-stretch:normal;font-size:29.9861px;line-height:1.25;font-family:Georgia;-inkscape-font-specification:'Georgia, Normal';font-variant-ligatures:normal;font-variant-caps:normal;font-variant-numeric:normal;font-variant-east-asian:normal;fill:#000000;fill-opacity:1;stroke:none;stroke-width:0.264583" d="m 76.907463,122.71825 c -1.464165,0 -2.840482,0.27348 -4.128947,0.82011 -1.278705,0.53686 -2.382055,1.293 -3.309358,2.26911 -0.956588,0.99563 -1.698088,2.17219 -2.225188,3.52898 -0.517338,1.34703 -0.776179,2.8112 -0.776179,4.3925 0,1.63986 0.273481,3.12338 0.820105,4.45089 0.546621,1.32751 1.283411,2.45492 2.210715,3.38222 0.917543,0.91754 1.991096,1.62505 3.220993,2.12287 1.229899,0.49782 2.508948,0.74672 3.836458,0.74672 1.23966,0 2.503551,-0.15583 3.792016,-0.46819 0.584952,-0.1418 1.17107,-0.31552 1.758035,-0.51366 -2.2e-5,0.01 -5.19e-4,0.0195 -5.19e-4,0.0295 0,1.63986 0.272968,3.12338 0.819589,4.45089 0.546621,1.32751 1.283931,2.45492 2.211234,3.38222 0.917544,0.91754 1.991093,1.62557 3.220993,2.12339 1.229897,0.49781 2.508432,0.74672 3.835942,0.74672 1.239658,0 2.504067,-0.15635 3.792532,-0.46871 1.288466,-0.31235 2.58164,-0.76153 3.879866,-1.3472 -0.01952,-0.26355 -0.03887,-0.60031 -0.05839,-1.01027 -0.0098,-0.40997 -0.01499,-1.20062 -0.01499,-2.37195 v -1.61024 c 0,-0.36116 0.05857,-0.67386 0.175699,-0.93741 0.126891,-0.27331 0.337101,-0.483 0.629941,-0.62942 0.24402,-0.11713 0.56091,-0.20498 0.95136,-0.26355 0.4002,-0.0683 0.71761,-0.11696 0.95188,-0.14624 v -1.06919 h -9.106939 v 1.06919 c 0.312354,0.0195 0.741672,0.0682 1.288293,0.14624 0.556382,0.0683 0.995632,0.17553 1.317749,0.32195 0.351399,0.14641 0.580957,0.38068 0.68833,0.70279 0.117133,0.31236 0.175699,0.67369 0.175699,1.08366 v 1.14205 c 0,0.36116 -0.0052,0.80041 -0.01499,1.31775 0,0.51734 -0.0387,1.02979 -0.11679,1.53737 -0.292833,0.29283 -0.795874,0.57103 -1.508434,0.83458 -0.7028,0.26354 -1.483516,0.39532 -2.342491,0.39532 -1.151811,0 -2.181437,-0.24891 -3.089217,-0.74673 -0.907783,-0.49781 -1.664441,-1.18126 -2.26963,-2.05 -0.605187,-0.84922 -1.069012,-1.85426 -1.391129,-3.01584 -0.312357,-1.17133 -0.468188,-2.41587 -0.468188,-3.73362 0,-1.49345 0.161057,-2.84571 0.483174,-4.05608 0.322117,-1.21038 0.780716,-2.22065 1.376143,-3.03082 0.605189,-0.83946 1.317921,-1.46905 2.137854,-1.88878 0.819933,-0.42949 1.751775,-0.64389 2.796212,-0.64389 0.956588,0 1.776521,0.18512 2.459797,0.55604 0.693039,0.36116 1.278705,0.84956 1.757,1.46451 0.478292,0.61495 0.86891,1.31253 1.171503,2.09342 0.302596,0.77112 0.556213,1.55706 0.761196,2.35747 h 1.20096 l -0.131776,-7.26208 h -1.171504 l -0.60048,0.99528 c -0.663754,-0.4002 -1.429829,-0.74167 -2.298567,-1.02474 -0.868738,-0.28307 -1.888948,-0.42478 -3.060279,-0.42478 -1.464165,0 -2.840482,0.27348 -4.128948,0.8201 -0.812114,0.34097 -1.552747,0.77119 -2.223119,1.28933 h -8.436178 v 1.06867 c 0.312356,0.0195 0.741672,0.0687 1.288293,0.14676 0.556384,0.0683 0.995632,0.17553 1.317749,0.32195 0.351401,0.14641 0.580959,0.38068 0.68833,0.70279 0.117133,0.31236 0.175701,0.67369 0.175701,1.08366 v 1.14205 c 0,0.36116 -0.0047,0.80041 -0.01447,1.31775 0,0.51734 -0.03922,1.02979 -0.117305,1.53737 -0.292833,0.29283 -0.795359,0.57103 -1.507919,0.83458 -0.702799,0.26355 -1.484032,0.39532 -2.34301,0.39532 -1.15181,0 -2.181434,-0.24891 -3.089216,-0.74672 -0.907783,-0.49782 -1.664441,-1.18127 -2.269628,-2.05001 -0.605189,-0.84921 -1.068499,-1.85478 -1.390613,-3.01635 -0.312356,-1.17133 -0.468707,-2.41588 -0.468707,-3.73362 0,-1.49345 0.16106,-2.84519 0.483175,-4.05557 0.322117,-1.21038 0.780716,-2.22065 1.376145,-3.03082 0.605187,-0.83946 1.317921,-1.46905 2.137852,-1.88878 0.819933,-0.42948 1.752293,-0.6444 2.79673,-0.6444 0.956588,0 1.776521,0.18563 2.459797,0.55655 0.693039,0.36117 1.278705,0.84905 1.757,1.464 0.478293,0.61495 0.868392,1.31304 1.170988,2.09393 0.302593,0.77112 0.556725,1.55707 0.761709,2.35747 h 1.200443 l -0.131773,-7.2626 h -1.171506 l -0.599964,0.9958 c -0.663755,-0.4002 -1.430345,-0.74167 -2.299083,-1.02474 -0.868739,-0.28307 -1.888429,-0.42478 -3.059761,-0.42478 z" /> </g>`,
  yinyang: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-40 -40 80 80"> <circle r="39"/> <path fill="#fff" d="M0,38a38,38 0 0 1 0,-76a19,19 0 0 1 0,38a19,19 0 0 0 0,38"/> <circle r="5" cy="19" fill="#fff"/> <circle r="5" cy="-19"/> </svg>`,
}

cardButtons.forEach((button) => {
  button.onclick = () => {
    sessionStorage.setItem('svg-data', examples[button.attributes["value"].value]);
    navigate(DISPLAY_PATH)
  }
})

console.log(cardButtons)

function handleDrop(e) {
  let dt = e.dataTransfer;
  let files = dt.files;
  if (files.length == 1) {
    handleFile(files);
  } else {
    alert("You may only upload one file at a time");
  }
}

function handleFile(files) {
  const file = files[0];
  FILE = file;
  sessionStorage.setItem('svg-data', getPath(file));
  navigate(DISPLAY_PATH);
}

// function uploadFile(file) {
//   let url = __dirname;
//   let formData = new FormData();

//   formData.append("file", file);

//   fetch(url, {
//     method: "POST",
//     body: formData,
//   })
//     .then(() => {
//       alert("Successfully upload your file!");
//       /* Done. Inform the user */
//     })
//     .catch(() => {
//       alert("Sorry, there was some error uploading your file.");
//       /* Error. Inform the user */
//     });
// }

function getPath(file) {
  const mock_data=
  '<g xmlns="http://www.w3.org/2000/svg" id="zZHJnr_1_"><g><path clip-rule="evenodd" d="m341.44 72.48c-4.996 5.373-16.788 6.249-19.439 15.36s-12.298 50.862-24.24 70.56c-1.711 22.575-5.242 43.325-1.92 68.16 0.512 3.827 2.866 6.739 3.6 10.8 2.746 2.787 11.308 2.142 11.04 7.2-0.214 4.048-15.984 4.37-19.199 1.68-6.181-5.172-4.091-18.73-9.12-24.48 0.391 7.822-1.031 15.667 2.399 21.36 1.779 2.952 9.235 4.252 9.12 8.4-0.185 6.643-18.83 1.623-20.16-0.48-2.101-3.322-1.912-9.327-3.84-14.399-2.19-5.765-3.423-5.582-3.12-12.96 0.308-7.478-2.403-17.44-3.6-25.681-1.598-11-2.987-21.504-6-28.8-33.955-4.925-58.845-18.915-96.24-20.4-14.532 23.549-37.729 38.432-58.8 55.44-1.453 6.972 1.004 14.763 1.44 22.08 2.946 1.99 9.732 0.78 9.6 5.28-0.109 3.701-13.088 4.427-16.56 2.159-6.799-4.439-3.471-22.006-8.4-28.079-14.843 4.438-17 23.64-22.32 38.399 2.486 2.285 9.844 2.29 7.92 6.96-2.098 5.092-19.677 1.365-20.4-2.399-1.232-6.421 3.276-16.929 4.56-22.801 1.385-6.33 1.811-17.056 4.8-22.56 0.893-1.644 4.24-2.775 5.52-4.08 5.983-6.097 16.533-14.781 18.72-23.76 3.528-14.487 8.287-30.359 7.2-48.72-4.202 16.561-11.877 27.42-24.72 34.56-15.535 8.636-36.694 1.528-54.96 1.92 9.262-6.627 28.635-3.066 41.04-5.28 35.111-6.264 21.791-55.728 52.8-67.2 20.893-7.729 42.031-12 71.52-12 9.277 0 48.22-1.306 60.72-3.12s26.796-11.99 41.04-19.68 29.986-35.007 53.28-36.72c11.954-0.879 20.691 3.304 26.4 9.12 8.817 8.984 9.726 22.967 22.08 29.52 2.517 1.335 4.622 0.951 5.04 3.6 0.617 3.918-3.49 10.69-5.521 12.72-10.04 10.039-31.3 5.056-41.28-1.68z" fill-rule="evenodd"/></g></g>'
      
  
  
  // return "M 30.468726,87.664403 C 64.679226,212.212 137.37654,136.842 137.37654,136.842 Z";
  return mock_data;
}

function navigate(path) {
  window.location.href = path;
}

function saveCookie(data) {
  var expires = "";
  const days = 1;
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    "svg-path" + "=" + (data || "") + expires + "; path=/" + ";SameSite=Lax";
}

function previewFile(file) {
  let reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function () {
    let img = document.createElement("img");
    img.src = reader.result;
    document.getElementById("gallery").appendChild(img);
  };
}

["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, preventDefaults, false);
});

["dragenter", "dragover"].forEach((eventName) => {
  dropArea.addEventListener(eventName, highlight, false);
});

["dragleave", "drop"].forEach((eventName) => {
  dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  dropArea.classList.add("highlight");
}

function unhighlight(e) {
  dropArea.classList.remove("highlight");
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}
