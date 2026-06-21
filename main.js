document.addEventListener('DOMContentLoaded', () => {
  // Lens effect on cover
  const heroSection = document.getElementById('heroSection');
  const lens = document.querySelector('.lens');

  if (heroSection && lens) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      lens.style.setProperty('--mouse-x', `${x}px`);
      lens.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  // Handle Hero Slide Down / Back to Cover
  const openBtn = document.getElementById('openBtn');
  const openMenuBtn = document.getElementById('openMenuBtn');
  const backBtn = document.getElementById('backBtn');
  const backBtnMenu = document.getElementById('backBtnMenu');
  const bookSection = document.getElementById('bookSection');
  const foodMenuSection = document.getElementById('foodMenuSection');

  if (openBtn && heroSection) {
    openBtn.addEventListener('click', () => {
      if (bookSection) bookSection.classList.add('active');
      if (foodMenuSection) foodMenuSection.classList.remove('active');
      heroSection.classList.add('opened');
    });
  }

  if (openMenuBtn && heroSection) {
    openMenuBtn.addEventListener('click', () => {
      if (bookSection) bookSection.classList.remove('active');
      if (foodMenuSection) foodMenuSection.classList.add('active');
      heroSection.classList.add('opened');
    });
  }

  if (backBtn && heroSection) {
    backBtn.addEventListener('click', () => {
      heroSection.classList.remove('opened');
    });
  }

  if (backBtnMenu && heroSection) {
    backBtnMenu.addEventListener('click', () => {
      heroSection.classList.remove('opened');
    });
  }

  // Initialize PageFlip for 2-page menu book spread (Proposal)
  const bookContainer = document.getElementById('amoreMenu');
  const pages = document.querySelectorAll('#amoreMenu .my-page');
  
  if (bookContainer && pages.length > 0) {
    // Initialize book as closed
    if (bookContainer.parentElement) {
      bookContainer.parentElement.classList.add('is-closed');
    }

    // We use St.PageFlip loaded via CDN in index.html
    const pageFlip = new St.PageFlip(bookContainer, {
      width: 560, // base width per page — landscape-leaning spread
      height: 640, // base height per page
      size: "stretch", // Stretch to fit the wrapper (.book-wrapper)
      minWidth: 400,
      maxWidth: 1400,
      minHeight: 420,
      maxHeight: 1200,
      maxShadowOpacity: 0.6,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: false // Forces double-page landscape spread
    });

    pageFlip.loadFromHTML(pages);

    // Button Navigation
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    pageFlip.on('flip', (e) => {
      // e.data contains the new page index
      const pageIndex = e.data;
      if (prevBtn) prevBtn.disabled = pageIndex === 0;
      if (nextBtn) nextBtn.disabled = pageIndex >= pages.length - 2;

      // Handle book center/slide animation
      if (bookContainer.parentElement) {
        if (pageIndex === 0) {
          bookContainer.parentElement.classList.add('is-closed');
          bookContainer.parentElement.classList.remove('is-open');
        } else {
          bookContainer.parentElement.classList.remove('is-closed');
          bookContainer.parentElement.classList.add('is-open');
        }
      }
    });
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        pageFlip.flipNext();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        pageFlip.flipPrev();
      });
    }

    // Wheel scroll to turn pages inside the book section
    if (bookSection) {
      let isScrolling = false;
      bookSection.addEventListener('wheel', (e) => {
        if (heroSection.classList.contains('opened') === false) return; // Prevent scroll if hero is visible
        if (!bookSection.classList.contains('active')) return;
        if (isScrolling) return;
        
        if (e.deltaY > 50) {
          pageFlip.flipNext();
          debounceScroll();
        } else if (e.deltaY < -50) {
          pageFlip.flipPrev();
          debounceScroll();
        }
      });

      function debounceScroll() {
        isScrolling = true;
        setTimeout(() => {
          isScrolling = false;
        }, 1200);
      }
    }

    // Handle Window Resize
    window.addEventListener('resize', () => {
      pageFlip.update();
    });
  }

  // Initialize PageFlip for 2-page menu book spread (Food Menu)
  const foodMenuContainer = document.getElementById('amoreFoodMenu');
  const foodPages = document.querySelectorAll('#amoreFoodMenu .my-page');
  
  if (foodMenuContainer && foodPages.length > 0) {
    if (foodMenuContainer.parentElement) {
      foodMenuContainer.parentElement.classList.add('is-closed');
    }

    const foodPageFlip = new St.PageFlip(foodMenuContainer, {
      width: 560,
      height: 640,
      size: "stretch",
      minWidth: 400,
      maxWidth: 1400,
      minHeight: 420,
      maxHeight: 1200,
      maxShadowOpacity: 0.6,
      showCover: true,
      mobileScrollSupport: false,
      usePortrait: false
    });

    foodPageFlip.loadFromHTML(foodPages);

    const prevBtnMenu = document.getElementById('prevBtnMenu');
    const nextBtnMenu = document.getElementById('nextBtnMenu');

    foodPageFlip.on('flip', (e) => {
      const pageIndex = e.data;
      if (prevBtnMenu) prevBtnMenu.disabled = pageIndex === 0;
      if (nextBtnMenu) nextBtnMenu.disabled = pageIndex >= foodPages.length - 2;

      if (foodMenuContainer.parentElement) {
        if (pageIndex === 0) {
          foodMenuContainer.parentElement.classList.add('is-closed');
          foodMenuContainer.parentElement.classList.remove('is-open');
        } else {
          foodMenuContainer.parentElement.classList.remove('is-closed');
          foodMenuContainer.parentElement.classList.add('is-open');
        }
      }
    });
    
    if (nextBtnMenu) {
      nextBtnMenu.addEventListener('click', () => {
        foodPageFlip.flipNext();
      });
    }
    
    if (prevBtnMenu) {
      prevBtnMenu.addEventListener('click', () => {
        foodPageFlip.flipPrev();
      });
    }

    if (foodMenuSection) {
      let isScrollingMenu = false;
      foodMenuSection.addEventListener('wheel', (e) => {
        if (heroSection.classList.contains('opened') === false) return;
        if (!foodMenuSection.classList.contains('active')) return;
        if (isScrollingMenu) return;
        
        if (e.deltaY > 50) {
          foodPageFlip.flipNext();
          debounceScrollMenu();
        } else if (e.deltaY < -50) {
          foodPageFlip.flipPrev();
          debounceScrollMenu();
        }
      });

      function debounceScrollMenu() {
        isScrollingMenu = true;
        setTimeout(() => {
          isScrollingMenu = false;
        }, 1200);
      }
    }

    window.addEventListener('resize', () => {
      foodPageFlip.update();
    });
  }
});
