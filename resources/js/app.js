// Laravel Pizza Theme JavaScript
import Alpine from 'alpinejs';
import focus from '@alpinejs/focus';

// Initialize Alpine.js
Alpine.plugin(focus);
window.Alpine = Alpine;
Alpine.start();

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                if (!mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const pizzaName = this.getAttribute('data-pizza-name');
            const pizzaPrice = this.getAttribute('data-pizza-price');
            
            // Add to cart animation
            this.innerHTML = '<i class="fas fa-check mr-2"></i>Aggiunto!';
            this.classList.remove('bg-pizza-red', 'hover:bg-red-700');
            this.classList.add('bg-green-500', 'hover:bg-green-600');
            
            setTimeout(() => {
                this.innerHTML = '<i class="fas fa-plus mr-1"></i>Aggiungi';
                this.classList.add('bg-pizza-red', 'hover:bg-red-700');
                this.classList.remove('bg-green-500', 'hover:bg-green-600');
            }, 2000);
            
            console.log(`Pizza ${pizzaName} aggiunta al carrello per €${pizzaPrice}`);
        });
    });
    
    // Form validation
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Simple validation
            if (!data.name || !data.email || !data.message) {
                alert('Per favore compila tutti i campi obbligatori.');
                return;
            }
            
            // Simulate form submission
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Invio...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check mr-2"></i>Inviato!';
                submitButton.classList.remove('bg-pizza-red', 'hover:bg-red-700');
                submitButton.classList.add('bg-green-500', 'hover:bg-green-600');
                
                setTimeout(() => {
                    contactForm.reset();
                    submitButton.innerHTML = originalText;
                    submitButton.classList.add('bg-pizza-red', 'hover:bg-red-700');
                    submitButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                    submitButton.disabled = false;
                }, 2000);
            }, 1000);
        });
    }
    
    // Order now button functionality
    const orderNowButtons = document.querySelectorAll('.order-now-btn');
    orderNowButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Scroll to menu section
            const menuSection = document.querySelector('#menu');
            if (menuSection) {
                menuSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// Utility functions
const PizzaUtils = {
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(amount);
    },
    
    // Calculate delivery time
    calculateDeliveryTime: () => {
        const minTime = 25;
        const maxTime = 45;
        const randomTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
        return randomTime;
    },
    
    // Check if store is open
    isStoreOpen: () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentDay = now.getDay();
        
        // Store is open from 18:00 to 23:00, closed on Sunday evening
        if (currentDay === 0 && currentHour >= 18) return false; // Sunday evening
        if (currentHour >= 18 && currentHour < 23) return true;
        return false;
    }
};

// Expose to global scope if needed
window.PizzaUtils = PizzaUtils;

// Initialize store status
document.addEventListener('DOMContentLoaded', function() {
    const storeStatus = document.querySelector('#store-status');
    if (storeStatus) {
        const isOpen = PizzaUtils.isStoreOpen();
        storeStatus.innerHTML = isOpen ? 
            '<i class="fas fa-circle text-green-500 mr-2"></i>Aperto' : 
            '<i class="fas fa-circle text-red-500 mr-2"></i>Chiuso';
    }
});