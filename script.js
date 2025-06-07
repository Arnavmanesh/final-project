

let loadedCount = 0;
let totalResourcesToLoad = 0; // Only image frames or other dynamic assets now

function checkAllLoaded() {
  loadedCount++;
  if (loadedCount === totalResourcesToLoad) {
    allLoaded();
  }
}




function allLoaded() {
  document.getElementById("preloader").style.display = "none"; // Hide preloader
  document.getElementById("main-body").style.display = "block"; // Show main content
}

checkAllLoaded();

//  Image-scroll
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

;

// Change Color 
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

/// Get to top button:
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

initColorSwatches();
initScrollCanvas();
