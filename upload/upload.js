let dropArea = document.getElementById("drop-area");

dropArea.addEventListener("drop", handleDrop, false);

const __dirname = window.location.href;

let FILE;

const DISPLAY_PATH = "/display";

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
  navigateWithData(getPath(file), DISPLAY_PATH);
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
  return "M 30.468726,87.664403 C 64.679226,212.212 137.37654,136.842 137.37654,136.842 Z";
}

function navigateWithData(data, path) {
  window.location.href = path + "?path=" + encodeURI(data);
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
