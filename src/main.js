const container = document.querySelector('#carousel');
const slides = container.querySelectorAll('.slide');
const slidesContainer = container.querySelector('#slides-container');
const indicatorsContainer = container.querySelector('#indicators-container');
const indicators = container.querySelectorAll('.indicator');
const pauseButton = container.querySelector('#pause-btn');
const nextButton = container.querySelector('#next-btn');
const prevButton = container.querySelector('#prev-btn');

const CODE_SPACE = 'Space';
const CODE_ARROW_RIGHT = 'ArrowRight';
const CODE_ARROW_LEFT = 'ArrowLeft';

const SLIDES_COUNT = slides.length;
const FA_PAUSE = '<i class="fas fa-pause"></i>';
const FA_PLAY = '<i class="fas fa-play"></i>';
const TIMER_INTERVAL = 2000;
const SWIPE_THRESHOLD = 100;

let currentSlide = 0;
let isPlaying = true;
let timerId = null;
let swipeStartX = null;
let swipeEndX = null;

function goToNth(n) {
  slides[currentSlide].classList.toggle('active');
  indicators[currentSlide].classList.toggle('active');
  currentSlide = (n + SLIDES_COUNT) % SLIDES_COUNT;
  slides[currentSlide].classList.toggle('active');
  indicators[currentSlide].classList.toggle('active');
}

function goToNext() {
  goToNth(currentSlide + 1);
}

function goToPrev() {
  goToNth(currentSlide - 1);
}

function tick() {
  timerId= setInterval(goToNext, TIMER_INTERVAL);
}

function playHandler() {
  pauseButton.innerHTML = FA_PAUSE;   
  isPlaying = true;
  tick();
}

function pauseHandler() {
  if (!isPlaying) return;
  isPlaying = false;
  pauseButton.innerHTML = FA_PLAY;
  clearInterval(timerId);
}

function pausePlayHandler() {
  isPlaying ? pauseHandler() : playHandler();
}

function prevHandler() {
  pauseHandler();
  goToPrev();
}

function nextHandler() {
  pauseHandler();
  goToNext();
}

function indicatorClickHandler(e) {
  const { target } = e;
  const slideTo = +target.dataset.slideTo;
  pauseHandler();
  goToNth(slideTo);
}

function keydownHandler(e) {
  const { code } = e;
  if (code === CODE_ARROW_RIGHT) nextHandler();
  if (code === CODE_ARROW_LEFT) prevHandler();
  if (code === CODE_SPACE) {
    e.preventDefault();
    pausePlayHandler();
  }
}

function swipeStartHandler(e) {
  swipeStartX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;
}

function swipeEndHandler(e) {
  swipeEndX = e instanceof MouseEvent ? e.clientX : e.changedTouches[0].clientX;

  const diffX = swipeEndX - swipeStartX;
  if (diffX > SWIPE_THRESHOLD) prevHandler();
  if (diffX < -SWIPE_THRESHOLD) nextHandler();
}

function initEventListeners() {
  pauseButton.addEventListener('click', pausePlayHandler);
  nextButton.addEventListener('click', nextHandler);
  prevButton.addEventListener('click', prevHandler);
  indicatorsContainer.addEventListener('click', indicatorClickHandler);
  slidesContainer.addEventListener('touchstart', swipeStartHandler);
  slidesContainer.addEventListener('mousedown', swipeStartHandler);
  slidesContainer.addEventListener('touchend', swipeEndHandler);
  slidesContainer.addEventListener('mouseup', swipeEndHandler);
  document.addEventListener('keydown', keydownHandler);
}

function init() {
  initEventListeners();
  tick();
}

init();
