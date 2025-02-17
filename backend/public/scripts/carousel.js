export function setupCarousel() {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(track.children);
    const nextButton = document.querySelector('.next-btn');
    const prevButton = document.querySelector('.prev-btn');
  
    if (!track || slides.length === 0) return;
  
    // Function to set the position of each slide
    const setSlidePositions = () => {
      const slideWidth = slides[0].getBoundingClientRect().width;
      slides.forEach((slide, index) => {
        slide.style.left = slideWidth * index + 'px';
      });
    };
  
    // Initialize slide positions and update on window resize
    setSlidePositions();
    window.addEventListener('resize', setSlidePositions);
  
    let currentSlideIndex = 0;
  
    const moveToSlide = (index) => {
        const slideWidth = slides[0].getBoundingClientRect().width;
        // Slide the track
        track.style.transform = `translateX(-${slideWidth * index}px)`;
      
        currentSlideIndex = index;
      };
      
  
    nextButton.addEventListener('click', () => {
      let newIndex = currentSlideIndex + 1;
      if (newIndex >= slides.length) {
        newIndex = 0;
      }
      moveToSlide(newIndex);
    });
  
    prevButton.addEventListener('click', () => {
      let newIndex = currentSlideIndex - 1;
      if (newIndex < 0) {
        newIndex = slides.length - 1;
      }
      moveToSlide(newIndex);
    });
  
    // Auto-slide every 5 seconds
    setInterval(() => {
      let newIndex = currentSlideIndex + 1;
      if (newIndex >= slides.length) {
        newIndex = 0;
      }
      moveToSlide(newIndex);
    }, 5000);
  }
  