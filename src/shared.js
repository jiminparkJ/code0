const page = document.body.dataset.page;
const links = document.querySelectorAll('nav a[data-page]');
for (const link of links) {
  if (link.dataset.page === page) {
    link.setAttribute('aria-current', 'page');
  }
}

const sectionElements = document.querySelectorAll('[data-track-section]');
const progressEl = document.querySelector('#path-progress');
const progressText = document.querySelector('#progress-text');

if (sectionElements.length && progressEl && progressText) {
  const updateProgress = () => {
    let seen = 0;
    for (const section of sectionElements) {
      const r = section.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.75) seen += 1;
    }
    const percent = Math.round((seen / sectionElements.length) * 100);
    progressEl.value = percent;
    progressText.textContent = `${percent}% of learning path explored`;
  };

  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
}
