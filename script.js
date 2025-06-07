const fragments = [
  { id: "hero-css", file: "pages/hero.html" },
  { id: "feature1-css", file: "pages/feature1.html" },
  { id: "color-css", file: "pages/color.html", callback: initColorSwatches },
  { id: "models-css", file: "pages/models.html" },
  { id: "scroll-css", file: "pages/scroll.html", callback: initScrollCanvas }, // initScrollCanvas will trigger image loading
  { id: "feature2-css", file: "pages/feature2.html" },
  { id: "data-css", file: "pages/data.html" },
  { id: "review-css", file: "pages/review.html" },
  { id: "contact-css", file: "pages/contact.html" }
];

let loadedCount = 0;
let totalResourcesToLoad = fragments.length; // Start with HTML fragments

function loadHTML(targetId, fileName, callback) {
  fetch(fileName)
    .then(response => response.text())
    .then(content => {
      document.getElementById(targetId).innerHTML = content;
      if (callback) callback();
      checkAllLoaded(); // Check after each HTML fragment
    })
    .catch(error => {
      console.error(`Error loading ${fileName}:`, error);
      checkAllLoaded(); // Still call checkAllLoaded to prevent infinite preloader if a fragment fails
    });
}

function checkAllLoaded() {
  loadedCount++;
  if (loadedCount === totalResourcesToLoad) {
    allLoaded(); // all done
  }
}

function allLoaded() {
  document.getElementById("preloader").style.display = "none"; // Hide preloader
  document.getElementById("main-body").style.display = "block"; // Show main content
}

// Modify initScrollCanvas to integrate with preloading
function initScrollCanvas() {
  const frameCount = 887; //
  const canvas = document.getElementById("frameCanvas"); //
  if (!canvas) {
    // If canvas not found, ensure it still counts towards total resources
    checkAllLoaded();
    return;
  }

  const context = canvas.getContext("2d"); //
  let imgWidth, imgHeight;

  const images = [];
  const currentFrame = i => `images/scenes/Image_${i}.jpg`; //

  // Add the image count to totalResourcesToLoad
  totalResourcesToLoad += frameCount;

  let imagesLoaded = 0; // New counter for images

  function resizeCanvas() {
    canvas.width = window.innerWidth; //
    canvas.height = window.innerHeight; //
    // Only draw if images are loaded to avoid errors
    if (images[currentIndex]?.complete) {
        drawFrame(currentIndex);
    }
  }

  window.addEventListener("resize", resizeCanvas); //

  let currentIndex = 1; //

  function drawFrame(index) {
    const img = images[index]; //
    if (img?.complete) { //
      context.clearRect(0, 0, canvas.width, canvas.height); //

      const canvasAspect = canvas.width / canvas.height; //
      const imgAspect = imgWidth / imgHeight; //

      let drawWidth, drawHeight; //

      if (canvasAspect > imgAspect) { //
        drawHeight = canvas.height; //
        drawWidth = drawHeight * imgAspect; //
      } else {
        drawWidth = canvas.width; //
        drawHeight = drawWidth / imgAspect; //
      }

      const x = (canvas.width - drawWidth) / 2; //
      const y = (canvas.height - drawHeight) / 2; //

      context.drawImage(img, x, y, drawWidth, drawHeight); //
    }
  }

  for (let i = 1; i <= frameCount; i++) { //
    const img = new Image(); //
    img.src = currentFrame(i); //
    images[i] = img; //

    img.onload = () => {
      imagesLoaded++; // Increment imagesLoaded for each image
      checkAllLoaded(); // Call checkAllLoaded for each image loaded

      if (i === 1) { //
        imgWidth = img.naturalWidth; //
        imgHeight = img.naturalHeight; //
        resizeCanvas(); //
      }
    };
    img.onerror = () => { // Handle image loading errors
        console.error(`Error loading image: ${img.src}`);
        imagesLoaded++;
        checkAllLoaded();
    };
  }

  window.addEventListener("scroll", () => { //
    const container = document.querySelector('.animation-container'); //
    if (!container) return; //

    const scrollTop = window.scrollY - container.offsetTop; //
    const containerHeight = container.clientHeight; //
    const scrollFraction = Math.min(1, Math.max(0, scrollTop / (containerHeight - window.innerHeight))); //

    currentIndex = Math.min( //
      frameCount, //
      Math.ceil(scrollFraction * frameCount) //
    );

    requestAnimationFrame(() => drawFrame(currentIndex)); //
  });
}

// Load all fragments (this will now also implicitly trigger image loading count)
fragments.forEach(({ id, file, callback }) => {
  loadHTML(id, file, callback); //
});

// Color swatches (remains the same)
function initColorSwatches() { //
  const swatches = document.querySelectorAll('.color-swatch'); //
  const productImage = document.getElementById('product-image'); //
  if (!productImage || swatches.length === 0) return; //

  swatches.forEach(swatch => { //
    swatch.addEventListener('click', () => { //
      swatches.forEach(s => s.classList.remove('active')); //
      swatch.classList.add('active'); //
      const selectedColor = swatch.getAttribute('data-color'); //
      productImage.src = `images/colors/${selectedColor}.png`; //
    });

    swatch.addEventListener('keydown', (e) => { //
      if (e.key === 'Enter' || e.key === ' ') { //
        swatch.click(); //
      }
    });
  });
}

/// Get the button:
const mybutton = document.getElementById("scr-btn");

// When the user scrolls down 200px from the top of the document, show the button
// Using a higher scroll threshold (200px) is generally better for "scroll to top" buttons.
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        mybutton.classList.add("show"); // Add the 'show' class
    } else {
        mybutton.classList.remove("show"); // Remove the 'show' class
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    // Smooth scroll behavior can be added with CSS 'scroll-behavior: smooth;' on html or body
    // Or via JavaScript for more control across browsers:
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
