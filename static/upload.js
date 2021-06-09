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
  sessionStorage.setItem('svg-data', getPath(file));
  navigateWithData('duh', DISPLAY_PATH);
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

function navigateWithData(data, path) {
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
