// DOM Elements
const themeSelector = document.getElementById('theme-selector');
const fontSizeSlider = document.getElementById('font-size');
const fontSizeValue = document.getElementById('font-size-value');
const speedButtons = document.querySelectorAll('.speed-btn');
const saveButton = document.getElementById('save-preferences');
const triggerAnimationButton = document.getElementById('trigger-animation');
const animatedElement = document.querySelector('.animated-element');

// Current user preferences
let userPreferences = {
    theme: 'light',
    fontSize: 16,
    animationSpeed: 'medium',
    animationType: 'bounce' // Default animation type
};

// Animation types to cycle through
const animationTypes = ['bounce', 'rotate', 'scale'];
let currentAnimationIndex = 0;

// Initialize the application
function init() {
    loadPreferences();
    applyPreferences();
    setupEventListeners();
}

// Load preferences from localStorage
function loadPreferences() {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
        userPreferences = JSON.parse(savedPreferences);
        console.log('Loaded preferences:', userPreferences);
    }
}

// Save preferences to localStorage
function savePreferences() {
    localStorage.setItem('userPreferences', JSON.stringify(userPreferences));
    console.log('Saved preferences:', userPreferences);
    
    // Animate the save button to provide feedback
    saveButton.classList.add('animate');
    setTimeout(() => {
        saveButton.classList.remove('animate');
    }, 1500);
}

// Apply preferences to the UI
function applyPreferences() {
    // Apply theme
    document.body.setAttribute('data-theme', userPreferences.theme);
    themeSelector.value = userPreferences.theme;
    
    // Apply font size
    document.body.style.fontSize = `${userPreferences.fontSize}px`;
    fontSizeSlider.value = userPreferences.fontSize;
    fontSizeValue.textContent = `${userPreferences.fontSize}px`;
    
    // Apply animation speed
    document.body.className = '';
    document.body.classList.add(`animation-${userPreferences.animationSpeed}`);
    
    // Update speed button active state
    speedButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.speed === userPreferences.animationSpeed) {
            btn.classList.add('active');
        }
    });
}

// Set up event listeners
function setupEventListeners() {
    // Theme selector
    themeSelector.addEventListener('change', () => {
        userPreferences.theme = themeSelector.value;
        applyPreferences();
    });
    
    // Font size slider
    fontSizeSlider.addEventListener('input', () => {
        userPreferences.fontSize = fontSizeSlider.value;
        fontSizeValue.textContent = `${userPreferences.fontSize}px`;
        applyPreferences();
    });
    
    // Animation speed buttons
    speedButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            userPreferences.animationSpeed = btn.dataset.speed;
            applyPreferences();
        });
    });
    
    // Save preferences button
    saveButton.addEventListener('click', savePreferences);
    
    // Trigger animation button
    triggerAnimationButton.addEventListener('click', triggerAnimation);
}

// Trigger animation function
function triggerAnimation() {
    // Remove any existing animation classes
    animationTypes.forEach(type => {
        animatedElement.classList.remove(`animate-${type}`);
    });
    
    // Get the current animation type and increment the index for next time
    const animationType = animationTypes[currentAnimationIndex];
    currentAnimationIndex = (currentAnimationIndex + 1) % animationTypes.length;
    
    // Store the current animation type in preferences
    userPreferences.animationType = animationType;
    
    // Apply the animation class
    animatedElement.classList.add(`animate-${animationType}`);
    
    // Remove the animation class after it completes to allow it to be triggered again
    const duration = getComputedStyle(document.documentElement).getPropertyValue('--animation-duration');
    const durationInMs = parseFloat(duration) * 1000 || 1000; // Default to 1 second if parsing fails
    
    setTimeout(() => {
        animatedElement.classList.remove(`animate-${animationType}`);
    }, durationInMs);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);