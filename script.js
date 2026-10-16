document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('menu-container')) {
        initMenuFilter();
    }

    if (document.getElementById('contact-form')) {
        initFormValidationAndStorage();
    }
});

/* ==========================================================================
   DYNAMIC MENU FILTERING
   ========================================================================== */

const menuItems = [
    { id: 1, name: "Artisan Sourdough", category: "bread", price: "$7.50", desc: "Classic naturally leavened sourdough with a crisp crust." },
    { id: 2, name: "Butter Croissant", category: "pastry", price: "$4.00", desc: "Flaky, layered French pastry made with premium European butter." },
    { id: 3, name: "Cinnamon Roll", category: "pastry", price: "$4.50", desc: "Soft baked roll with cinnamon spice swirl and cream cheese frosting." },
    { id: 4, name: "Seasonal Fruit Tart", category: "pastry", price: "$5.50", desc: "Crisp pastry shell filled with vanilla custard and fresh berries." },
    { id: 5, name: "Whole Wheat Baguette", category: "bread", price: "$5.00", desc: "Traditional crusty baguette baked with organic whole wheat flour." }
];

function initMenuFilter() {
    const container = document.getElementById('menu-container');
    const filterButtons = document.querySelectorAll('.filter-btn');

    renderMenuItems(menuItems, container);

    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const category = e.target.getAttribute('data-category');
            if (category === 'all') {
                renderMenuItems(menuItems, container);
            } else {
                renderMenuItems(menuItems.filter(item => item.category === category), container);
            }
        });
    });
}

function renderMenuItems(items, container) {
    if (!container) return;
    container.innerHTML = items.map(item => `
        <article class="menu-item">
            <h3>${item.name}</h3>
            <p>${item.desc}</p>
            <p class="price">${item.price}</p>
        </article>
    `).join('');
}


/* ==========================================================================
   FORM VALIDATION & LOCAL STORAGE
   ========================================================================== */

function initFormValidationAndStorage() {
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('full-name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const welcomeDiv = document.getElementById('welcome-message');

    // Load existing user data from browser storage on page load
    loadStoredUserData(nameInput, emailInput, welcomeDiv);

    // Save input text in real-time as user types
    if (nameInput) {
        nameInput.addEventListener('input', () => {
            if (nameInput.value.trim() !== '') {
                localStorage.setItem('bakery_user_name', nameInput.value.trim());
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            if (emailInput.value.trim() !== '') {
                localStorage.setItem('bakery_user_email', emailInput.value.trim());
            }
        });
    }

    // Intercept form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            clearErrors();

            const isNameValid = validateRequired(nameInput, 'name-error', 'Full name is required.');
            const isEmailValid = validateEmail(emailInput);
            const isMessageValid = validateMinLength(messageInput, 'message-error', 10, 'Message must be at least 10 characters.');

            if (isNameValid && isEmailValid && isMessageValid) {
                const finalName = nameInput.value.trim();
                const finalEmail = emailInput.value.trim();

                localStorage.setItem('bakery_user_name', finalName);
                localStorage.setItem('bakery_user_email', finalEmail);

                alert('Thank you! Your message has been sent successfully.');

                if (welcomeDiv) {
                    welcomeDiv.innerHTML = `<p style="color: #78350f; font-weight: bold; margin-bottom: 1rem;">Welcome back, ${finalName}!</p>`;
                }
            }
        });
    }
}

function loadStoredUserData(nameInput, emailInput, welcomeDiv) {
    const savedName = localStorage.getItem('bakery_user_name');
    const savedEmail = localStorage.getItem('bakery_user_email');

    if (savedName) {
        if (nameInput) nameInput.value = savedName;
        if (welcomeDiv) {
            welcomeDiv.innerHTML = `<p style="color: #78350f; font-weight: bold; margin-bottom: 1rem;">Welcome back, ${savedName}!</p>`;
        }
    }

    if (savedEmail && emailInput) {
        emailInput.value = savedEmail;
    }
}

function validateRequired(input, errorId, message) {
    if (!input || !input.value.trim()) {
        showError(errorId, message);
        return false;
    }
    return true;
}

function validateEmail(input) {
    if (!input) return false;
    const emailValue = input.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValue) {
        showError('email-error', 'Email address is required.');
        return false;
    } else if (!emailPattern.test(emailValue)) {
        showError('email-error', 'Please enter a valid email address (e.g., name@example.com).');
        return false;
    }
    return true;
}

function validateMinLength(input, errorId, minLength, message) {
    if (!input || input.value.trim().length < minLength) {
        showError(errorId, message);
        return false;
    }
    return true;
}

function showError(elementId, message) {
    const errorSpan = document.getElementById(elementId);
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function clearErrors() {
    const errorSpans = document.querySelectorAll('.error-message');
    errorSpans.forEach(span => span.textContent = '');
}