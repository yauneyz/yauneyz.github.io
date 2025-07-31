document.addEventListener('DOMContentLoaded', function() {
  const tagButtons = document.querySelectorAll('.tag-button');
  const essayCards = document.querySelectorAll('.essay-card');
  const allButton = document.querySelector('[data-tag="all"]');
  
  if (!tagButtons.length || !essayCards.length) return;
  
  // Set "All" as active by default
  if (allButton) {
    allButton.classList.add('active');
  }
  
  tagButtons.forEach(button => {
    button.addEventListener('click', function() {
      const selectedTag = this.getAttribute('data-tag');
      
      // Update active button
      tagButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Filter essays
      essayCards.forEach(card => {
        if (selectedTag === 'all') {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          const cardTags = card.getAttribute('data-tags').split(',');
          
          if (cardTags.includes(selectedTag)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, 10);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        }
      });
      
      // Update URL without page reload
      const url = new URL(window.location);
      if (selectedTag === 'all') {
        url.searchParams.delete('tag');
      } else {
        url.searchParams.set('tag', selectedTag);
      }
      window.history.pushState({}, '', url);
      
      // Update essay count
      updateEssayCount();
    });
  });
  
  // Handle initial page load with URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const tagParam = urlParams.get('tag');
  
  if (tagParam) {
    const targetButton = document.querySelector(`[data-tag="${tagParam}"]`);
    if (targetButton) {
      targetButton.click();
    }
  }
  
  function updateEssayCount() {
    const visibleEssays = Array.from(essayCards).filter(card => 
      card.style.display !== 'none' && 
      window.getComputedStyle(card).display !== 'none'
    ).length;
    
    const countElement = document.querySelector('.essay-count');
    if (countElement) {
      const activeTag = document.querySelector('.tag-button.active').getAttribute('data-tag');
      const tagText = activeTag === 'all' ? 'essays' : `essays tagged "${activeTag}"`;
      countElement.textContent = `${visibleEssays} ${tagText}`;
    }
  }
  
  // Initialize essay count
  updateEssayCount();
  
  // Add smooth transitions
  essayCards.forEach(card => {
    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  });
});