let img = new Image();
let file = document.getElementById("upload");
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let slider = document.getElementById("scaleSlider");
let pixelSlider = document.getElementById("pixelSlider");
let scaleValue = document.getElementById("scaleValue");

let originalWidth, originalHeight;

let fileNameDisplay = document.getElementById("fileName");

file.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    let name = file.name;
    if (name.length > 16) {
      name = name.substring(0, 13) + "...";
    }
    fileNameDisplay.textContent = name;
  }
});


file.addEventListener("change", function(e) {
    const file = e.target.files[0];
    img.src = URL.createObjectURL(file);

    img.onload = function() {
        originalWidth = img.width;
        originalHeight = img.height;
        drawImage();  // Draw first time
    };
});

// 🔁 Both sliders trigger this
slider.addEventListener("input", drawImage);
pixelSlider.addEventListener("input", drawImage);

// 🧠 This handles scaling + pixelation
function drawImage() {
    if (!img.src || !img.complete) return;

    let scale = slider.value / 100;
    let pixelSize = pixelSlider.value;

    scaleValue.textContent = `${slider.value}%`;
    document.getElementById("pixelValue").textContent = `${pixelSlider.value}%`;

    // Step 1: Downscale to pixel size
    let tempCanvas = document.createElement("canvas");
    let tempCtx = tempCanvas.getContext("2d");

    tempCanvas.width = pixelSize;
    tempCanvas.height = pixelSize * (originalHeight / originalWidth);

    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);

    // Step 2: Upscale to final scaled size
    let newWidth = originalWidth * scale;
    let newHeight = originalHeight * scale;
    canvas.width = newWidth;
    canvas.height = newHeight;

    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tempCanvas, 0, 0, newWidth, newHeight);
};

document.getElementById("saveBtn").addEventListener("click", function () {
  const link = document.createElement("a");
  link.download = "pixel-art.png"; // default file name
  link.href = canvas.toDataURL("image/png"); // convert canvas to data URL
  link.click(); // trigger the download
});

