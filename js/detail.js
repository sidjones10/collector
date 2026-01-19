// Comic Detail Page Logic
let currentComic = null;

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
    loadComicDetail();
    setupRatingInteraction();
});

// Load comic details from URL parameter
function loadComicDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const comicId = urlParams.get('id');

    if (!comicId) {
        window.location.href = 'deck.html';
        return;
    }

    currentComic = library.getComicById(parseInt(comicId));

    if (!currentComic) {
        alert('Comic not found!');
        window.location.href = 'deck.html';
        return;
    }

    displayComicDetail();
}

// Display comic information
function displayComicDetail() {
    document.getElementById('comic-series').textContent = currentComic.title.toUpperCase();
    document.getElementById('comic-volume').textContent = currentComic.volume;
    document.getElementById('comic-year').textContent = currentComic.year;
    document.getElementById('comic-cover').src = currentComic.cover;
    document.getElementById('comic-cover').alt = currentComic.title;
    document.getElementById('comic-description').textContent = currentComic.description;

    // Set user rating
    updateUserRatingDisplay(currentComic.userRating);

    // Set readers rating
    updateReadersRatingDisplay(currentComic.readersRating);
}

// Update user rating stars
function updateUserRatingDisplay(rating) {
    const userRatingDiv = document.getElementById('user-rating');
    userRatingDiv.innerHTML = '';

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.dataset.rating = i;
        star.textContent = '★';

        if (i <= rating) {
            star.classList.add('filled');
        }

        userRatingDiv.appendChild(star);
    }
}

// Update readers rating stars
function updateReadersRatingDisplay(rating) {
    const readersRatingDiv = document.getElementById('readers-rating');
    readersRatingDiv.innerHTML = '';

    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
        const star = document.createElement('span');
        star.className = 'star';
        star.textContent = '★';

        if (i <= fullStars) {
            star.classList.add('filled');
        } else if (i === fullStars + 1 && hasHalfStar) {
            star.classList.add('filled');
            star.style.opacity = '0.5';
        }

        readersRatingDiv.appendChild(star);
    }
}

// Setup interactive rating
function setupRatingInteraction() {
    const userRatingDiv = document.getElementById('user-rating');

    userRatingDiv.addEventListener('click', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            rateComic(rating);
        }
    });

    // Hover effect
    userRatingDiv.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('star')) {
            const rating = parseInt(e.target.dataset.rating);
            highlightStars(rating);
        }
    });

    userRatingDiv.addEventListener('mouseout', () => {
        updateUserRatingDisplay(currentComic.userRating);
    });
}

// Highlight stars on hover
function highlightStars(rating) {
    const stars = document.querySelectorAll('#user-rating .star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('filled');
        } else {
            star.classList.remove('filled');
        }
    });
}

// Rate comic
function rateComic(rating) {
    if (currentComic) {
        library.rateComic(currentComic.id, rating);
        currentComic.userRating = rating;
        updateUserRatingDisplay(rating);
    }
}

// Toggle read list
function toggleReadList() {
    if (currentComic) {
        const updated = library.toggleReadList(currentComic.id);
        currentComic.inReadList = updated.inReadList;

        const btn = document.querySelector('.action-btn');
        if (currentComic.inReadList) {
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
                Remove from Read List
            `;
            btn.style.background = '#4CAF50';
        } else {
            btn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                </svg>
                Add to Read List
            `;
            btn.style.background = '';
        }
    }
}

// Remove from collection
function removeFromCollection() {
    if (confirm('Are you sure you want to remove this comic from your collection?')) {
        library.deleteComic(currentComic.id);
        window.location.href = 'deck.html';
    }
}
