// DOM Elements
const sliderWrapper = document.querySelector(".slider-wrapper");
const menuItems = document.querySelectorAll(".menu-item");
const modal = document.querySelector(".payment-modal");
const modalClose = document.querySelector(".modal-close");
const productBuyBtn = document.querySelector(".product-buy-btn");

// Product Data
const products = [
  {
    id: 1,
    title: "Air Force",
    price: 899,
    description: "Tênis clássico com design atemporal e máximo conforto para uso diário. Feito com materiais premium e tecnologia de ponta.",
    colors: [
      { code: "#000000", name: "Preto", img: "./img/air.png" },
      { code: "#1e3a8a", name: "Azul Escuro", img: "./img/air2.png" }
    ]
  },
  {
    id: 2,
    title: "Air Jordan",
    price: 1199,
    description: "Ícone do basquete mundial com tecnologia revolucionária e estilo inconfundível para performance máxima.",
    colors: [
      { code: "#9ca3af", name: "Cinza Claro", img: "./img/jordan.png" },
      { code: "#16a34a", name: "Verde", img: "./img/jordan2.png" }
    ]
  },
  {
    id: 3,
    title: "Blazer",
    price: 549,
    description: "Estilo vintage reimaginado com toque moderno para os amantes de design clássico e elegância urbana.",
    colors: [
      { code: "#9ca3af", name: "Cinza Claro", img: "./img/blazer.png" },
      { code: "#16a34a", name: "Verde", img: "./img/blazer2.png" }
    ]
  },
  {
    id: 4,
    title: "Crater",
    price: 549,
    description: "Sustentabilidade e inovação se encontram neste modelo eco-friendly feito com materiais reciclados.",
    colors: [
      { code: "#000000", name: "Preto", img: "./img/crater.png" },
      { code: "#9ca3af", name: "Cinza Claro", img: "./img/crater2.png" }
    ]
  },
  {
    id: 5,
    title: "Hippie",
    price: 799,
    description: "Expressão de liberdade e criatividade com padrões únicos para quem quer se destacar na multidão.",
    colors: [
      { code: "#6b7280", name: "Cinza", img: "./img/hippie.png" },
      { code: "#000000", name: "Preto", img: "./img/hippie2.png" }
    ]
  }
];

// Current State
let currentProduct = products[0];
let currentColorIndex = 0;
let currentSize = null;

// DOM References for Product
const productImg = document.querySelector(".product-img");
const productTitle = document.querySelector(".product-title");
const productPrice = document.querySelector(".product-price");
const productDesc = document.querySelector(".product-desc");
const colorOptions = document.querySelectorAll(".color-option");
const sizeOptions = document.querySelectorAll(".size-option");

// Utility Functions
const formatPrice = (price) => `R$ ${price.toLocaleString('pt-BR')}`;

const updateSliderPosition = (index) => {
  if (sliderWrapper) {
    sliderWrapper.style.transform = `translateX(-${100 * index}vw)`;
  }
};

const updateProductDisplay = (product, colorIndex = 0) => {
  if (!product) return;

  currentProduct = product;
  currentColorIndex = colorIndex;

  // Update product info
  if (productTitle) productTitle.textContent = product.title;
  if (productPrice) productPrice.textContent = formatPrice(product.price);
  if (productDesc) productDesc.textContent = product.description;
  if (productImg) productImg.src = product.colors[colorIndex].img;

  // Update color options
  colorOptions.forEach((colorBtn, index) => {
    if (product.colors[index]) {
      colorBtn.style.backgroundColor = product.colors[index].code;
      colorBtn.setAttribute('aria-label', `Cor ${product.colors[index].name}`);
      colorBtn.style.display = 'block';
      
      // Update active state
      colorBtn.classList.toggle('active', index === colorIndex);
    } else {
      colorBtn.style.display = 'none';
    }
  });

  // Reset size selection
  currentSize = null;
  sizeOptions.forEach(sizeBtn => sizeBtn.classList.remove('active'));
};

const showNotification = (message, type = 'success') => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Style notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '20px',
    right: '20px',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    color: 'white',
    fontWeight: '600',
    zIndex: '9999',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out',
    backgroundColor: type === 'success' ? '#16a34a' : '#dc2626'
  });

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  // Initialize first product
  updateProductDisplay(products[0]);

  // Menu navigation
  menuItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      // Remove active class from all menu items
      menuItems.forEach(menuItem => menuItem.classList.remove('active'));
      
      // Add active class to clicked item
      item.classList.add('active');

      // Update slider position
      updateSliderPosition(index);
      
      // Update product display
      if (products[index]) {
        updateProductDisplay(products[index]);
      }
    });
  });

  // Color selection
  colorOptions.forEach((colorBtn, index) => {
    colorBtn.addEventListener('click', () => {
      if (currentProduct.colors[index]) {
        colorOptions.forEach(btn => btn.classList.remove('active'));
        colorBtn.classList.add('active');
        
        currentColorIndex = index;
        if (productImg) {
          productImg.src = currentProduct.colors[index].img;
        }
      }
    });
  });

  // Size selection
  sizeOptions.forEach((sizeBtn) => {
    sizeBtn.addEventListener('click', () => {
      // Remove active class from all sizes
      sizeOptions.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to selected size
      sizeBtn.classList.add('active');
      
      // Store selected size
      currentSize = sizeBtn.getAttribute('data-size') || sizeBtn.textContent;
    });
  });

  // Buy button
  if (productBuyBtn) {
    productBuyBtn.addEventListener('click', () => {
      if (!currentSize) {
        showNotification('Por favor, selecione um tamanho', 'error');
        return;
      }
      
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  // Modal controls
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // Form submission
  const paymentForm = document.querySelector('.payment-form');
  if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate payment processing
      const submitBtn = paymentForm.querySelector('.confirm-payment-btn');
      const originalText = submitBtn.textContent;
      
      submitBtn.textContent = 'PROCESSANDO...';
      submitBtn.disabled = true;
      
      setTimeout(() => {
        closeModal();
        showNotification('Compra realizada com sucesso! 🎉');
        
        // Reset form
        paymentForm.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2000);
    });
  }

  // Search functionality
  const searchForm = document.querySelector('.search');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const searchInput = searchForm.querySelector('.search-input');
      const query = searchInput.value.toLowerCase().trim();
      
      if (query) {
        // Find matching product
        const matchingProductIndex = products.findIndex(product => 
          product.title.toLowerCase().includes(query)
        );
        
        if (matchingProductIndex !== -1) {
          // Update menu active state
          menuItems.forEach(item => item.classList.remove('active'));
          if (menuItems[matchingProductIndex]) {
            menuItems[matchingProductIndex].classList.add('active');
          }
          
          // Update display
          updateSliderPosition(matchingProductIndex);
          updateProductDisplay(products[matchingProductIndex]);
          
          showNotification(`Produto encontrado: ${products[matchingProductIndex].title}`);
        } else {
          showNotification('Produto não encontrado', 'error');
        }
        
        searchInput.value = '';
      }
    });
  }
});

// Helper Functions
const closeModal = () => {
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
};

// Global functions for HTML onclick events
window.scrollToProduct = () => {
  const productSection = document.querySelector('#product');
  if (productSection) {
    productSection.scrollIntoView({ behavior: 'smooth' });
  }
};

window.scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  // Close modal with Escape key
  if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
    closeModal();
  }
});

// Performance optimizations
// Preload images
const preloadImages = () => {
  products.forEach(product => {
    product.colors.forEach(color => {
      const img = new Image();
      img.src = color.img;
    });
  });
};

// Initialize preloading after page load
window.addEventListener('load', preloadImages);