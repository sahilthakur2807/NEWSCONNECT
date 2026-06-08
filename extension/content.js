let hoverButton = null;
let currentTarget = null;

function createHoverButton() {
  const btn = document.createElement('div');
  btn.id = 'newsconnect-hover-btn';
  btn.innerHTML = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
    <span>Discuss</span>
  `;
  btn.style.position = 'absolute';
  btn.style.display = 'none';
  btn.style.zIndex = '2147483647';
  document.body.appendChild(btn);
  
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    const url = window.location.href; // Default to current page
    const title = document.title;
    chrome.runtime.sendMessage({ action: "openSidePanel", url: url, title: title });
  });

  return btn;
}

function positionButton(element) {
  const rect = element.getBoundingClientRect();
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  hoverButton.style.top = `${rect.top + scrollTop + 10}px`;
  hoverButton.style.left = `${rect.left + scrollLeft + 10}px`;
  hoverButton.style.display = 'flex';
}

document.addEventListener('mouseover', (e) => {
  const target = e.target;
  
  // Detect images or article links
  if (target.tagName === 'IMG' && target.width > 200) {
    if (!hoverButton) hoverButton = createHoverButton();
    currentTarget = target;
    positionButton(target);
  }
});

document.addEventListener('mousemove', (e) => {
  if (hoverButton && hoverButton.style.display === 'flex') {
    const isOverButton = hoverButton.contains(e.target);
    const isOverTarget = currentTarget && currentTarget.contains(e.target);
    
    if (!isOverButton && !isOverTarget) {
      hoverButton.style.display = 'none';
    }
  }
});
