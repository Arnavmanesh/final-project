const fragments = [
  { id: "hero-css", file: "pages/hero.html" },
  { id: "feature1-css", file: "pages/feature1.html" },
  { id: "color-css", file: "pages/color.html", callback: initColorSwatches },
  { id: "models-css", file: "pages/models.html" },
  { id: "scroll-css", file: "pages/scroll.html", callback: initScrollCanvas },
  { id: "feature2-css", file: "pages/feature2.html" },
  { id: "data-css", file: "pages/data.html" },
  { id: "review-css", file: "pages/review.html" },
  { id: "contact-css", file: "pages/contact.html" }
];

let loadedCount = 0;

function loadHTML(targetId, fileName, callback) {
  fetch(fileName)
    .then(response => response.text())
    .then(content => {
      document.getElementById(targetId).innerHTML = content;
      if (callback) callback();
      loadedCount++;
      if (loadedCount === fragments.length) allLoaded(); // all done
    });
}

function allLoaded() {
  document.getElementById("preloader").style.display = "none";
  document.getElementById("main-body").style.display = "block";
}

// Load all fragments
fragments.forEach(({ id, file, callback }) => {
  loadHTML(id, file, callback);
});

// Color swatches
function initColorSwatches() {
  const swatches = document.querySelectorAll('.color-swatch');
  const productImage = document.getElementById('product-image');
  if (!productImage || swatches.length === 0) return;

  swatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      swatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');
      const selectedColor = swatch.getAttribute('data-color');
      productImage.src = `images/colors/${selectedColor}.png`;
    });

    swatch.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        swatch.click();
      }
    });
  });
}

// Scroll animation
function initScrollCanvas() {
  const frameCount = 887;
  const canvas = document.getElementById("frameCanvas");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  let imgWidth, imgHeight;

  const images = [];
  const currentFrame = i => `images/scenes/Image_${i}.jpg`;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drawFrame(currentIndex);
  }

  window.addEventListener("resize", resizeCanvas);

  let currentIndex = 1;

  function drawFrame(index) {
    const img = images[index];
    if (img?.complete) {
      context.clearRect(0, 0, canvas.width, canvas.height);

      const canvasAspect = canvas.width / canvas.height;
      const imgAspect = imgWidth / imgHeight;

      let drawWidth, drawHeight;

      if (canvasAspect > imgAspect) {
        drawHeight = canvas.height;
        drawWidth = drawHeight * imgAspect;
      } else {
        drawWidth = canvas.width;
        drawHeight = drawWidth / imgAspect;
      }

      const x = (canvas.width - drawWidth) / 2;
      const y = (canvas.height - drawHeight) / 2;

      context.drawImage(img, x, y, drawWidth, drawHeight);
    }
  }

  for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images[i] = img;

    img.onload = () => {
      if (i === 1) {
        imgWidth = img.naturalWidth;
        imgHeight = img.naturalHeight;
        resizeCanvas();
      }
    };
  }

  window.addEventListener("scroll", () => {
    const container = document.querySelector('.animation-container');
    if (!container) return;

    const scrollTop = window.scrollY - container.offsetTop;
    const containerHeight = container.clientHeight;
    const scrollFraction = Math.min(1, Math.max(0, scrollTop / (containerHeight - window.innerHeight)));

    currentIndex = Math.min(
      frameCount,
      Math.ceil(scrollFraction * frameCount)
    );

    requestAnimationFrame(() => drawFrame(currentIndex));
  });
}
