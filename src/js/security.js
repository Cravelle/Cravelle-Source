document.addEventListener('contextmenu', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && (e.key === 'u' || e.key === 's')) {
    e.preventDefault();
  }
});

document.addEventListener('selectstart', (e) => {
  if (e.target.tagName === 'IMG') {
    e.preventDefault();
  }
});

export {};
