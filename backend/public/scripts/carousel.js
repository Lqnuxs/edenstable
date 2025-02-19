export function setupCarousel() {
  const track = document.querySelector(".carousel-track");
  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".next-btn");
  const prevButton = document.querySelector(".prev-btn");
  const indicatorContainer = document.querySelector(".carousel-indicators");
  const indicators = indicatorContainer
    ? Array.from(indicatorContainer.children)
    : [];

  if (!track || slides.length === 0) return;

  let currentSlideIndex = 0;
  let autoSlideInterval;
  let autoSlideTimeout;

  function setSlidePositions() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + "px";
    });
  }
  setSlidePositions();
  window.addEventListener("resize", setSlidePositions);

  function moveToSlide(index) {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${2 * slideWidth * index}px)`;
    currentSlideIndex = index;
    updateIndicators(index);
  }

  function updateIndicators(index) {
    indicators.forEach((indicator, i) => {
      indicator.classList.toggle("active", i === index);
    });
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      let newIndex = currentSlideIndex + 1;
      if (newIndex >= slides.length) newIndex = 0;
      moveToSlide(newIndex);
    }, 5000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  function resetAutoSlideTimeout() {
    if (autoSlideTimeout) {
      clearTimeout(autoSlideTimeout);
    }
    autoSlideTimeout = setTimeout(() => {
      startAutoSlide();
    }, 15000);
  }

  startAutoSlide();

  nextButton.addEventListener("click", () => {
    stopAutoSlide();
    let newIndex = currentSlideIndex + 1;
    if (newIndex >= slides.length) {
      newIndex = 0;
    }
    moveToSlide(newIndex);
    resetAutoSlideTimeout();
  });

  prevButton.addEventListener("click", () => {
    stopAutoSlide();
    let newIndex = currentSlideIndex - 1;
    if (newIndex < 0) {
      newIndex = slides.length - 1;
    }
    moveToSlide(newIndex);
    resetAutoSlideTimeout();
  });

  indicators.forEach((indicator) => {
    indicator.addEventListener("click", (e) => {
      stopAutoSlide();
      const targetIndex = parseInt(e.target.dataset.slide, 10);
      moveToSlide(targetIndex);
      resetAutoSlideTimeout();
    });
  });
}
