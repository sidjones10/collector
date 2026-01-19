// Main Application Logic
let currentFilter = 'all';

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
    loadComics();
    setupEventListeners();
});

// Load and display comics
function loadComics(filter = 'all') {
    const grid = document.getElementById('comics-grid');
    let comics = [];

    switch (filter) {
        case 'all':
            comics = library.getAllComics();
            break;
        case 'readlist':
            comics = library.getReadList();
            break;
        case 'universe':
            comics = library.getAllComics();
            break;
        case 'genre':
            comics = library.getAllComics();
            break;
        case 'rating':
            comics = library.filterByRating(4);
            break;
        case 'character':
            comics = library.getAllComics();
            break;
        default:
            comics = library.getAllComics();
    }

    grid.innerHTML = '';

    if (comics.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; font-size: 24px; padding: 60px;">No comics found. Add some to your collection!</p>';
        return;
    }

    comics.forEach(comic => {
        const card = createComicCard(comic);
        grid.appendChild(card);
    });
}

// Create comic card element
function createComicCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    card.onclick = () => viewComicDetail(comic.id);

    const stars = generateStars(comic.userRating || 0);

    card.innerHTML = `
        <img src="${comic.cover}" alt="${comic.title}" class="comic-cover">
        <div class="comic-info">
            <p class="comic-author">${comic.author}</p>
            <h3 class="comic-title">${comic.title}</h3>
            ${comic.volumes && comic.volumes.length > 0 ?
                `<p class="comic-subtitle">You have book: ${comic.volumes.join(', ')}</p>` :
                ''}
            <div class="star-rating">
                ${stars}
            </div>
        </div>
    `;

    return card;
}

// Generate star HTML
function generateStars(rating, interactive = false) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= rating ? 'filled' : '';
        if (interactive) {
            starsHTML += `<span class="star ${filled}" data-rating="${i}" onclick="rateComic(event, ${i})">★</span>`;
        } else {
            starsHTML += `<span class="star ${filled}">★</span>`;
        }
    }
    return starsHTML;
}

// Navigate to comic detail page
function viewComicDetail(comicId) {
    library.incrementSearchCount(comicId);
    window.location.href = `detail.html?id=${comicId}`;
}

// Filter comics
function filterComics(filterType) {
    currentFilter = filterType;

    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filterType) {
            btn.classList.add('active');
        }
    });

    loadComics(filterType);
}

// Search functionality
function setupEventListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    const addForm = document.getElementById('add-comic-form');
    if (addForm) {
        addForm.addEventListener('submit', handleAddComic);
    }
}

function handleSearch(e) {
    const query = e.target.value;
    const results = library.searchComics(query);
    displaySearchResults(results);
}

function displaySearchResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = '<p style="color: #666; padding: 20px;">No results found</p>';
        return;
    }

    results.forEach(comic => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.onclick = () => {
            viewComicDetail(comic.id);
            document.getElementById('search-modal').style.display = 'none';
        };

        item.innerHTML = `
            <img src="${comic.cover}" alt="${comic.title}" class="search-result-img">
            <div class="search-result-info">
                <h4>${comic.title}</h4>
                <p>${comic.author} - ${comic.year}</p>
            </div>
        `;

        resultsContainer.appendChild(item);
    });
}

// Add comic to collection
function handleAddComic(e) {
    e.preventDefault();

    const title = document.getElementById('comic-title').value;
    const author = document.getElementById('comic-author').value;
    const issue = document.getElementById('comic-issue').value;
    const year = parseInt(document.getElementById('comic-year').value);
    const description = document.getElementById('comic-description').value;
    const cover = document.getElementById('comic-cover').value || 'https://via.placeholder.com/400x600/2a2a2a/FFFFFF?text=' + encodeURIComponent(title);

    const newComic = {
        title,
        author,
        issue,
        year,
        description,
        cover,
        volume: issue,
        genre: 'Unknown',
        universe: 'Unknown',
        characters: [],
        readersRating: 0,
        volumes: []
    };

    library.addComic(newComic);

    // Close modal and refresh
    document.getElementById('add-modal').style.display = 'none';
    document.getElementById('add-comic-form').reset();
    document.getElementById('manual-entry').style.display = 'none';
    loadComics(currentFilter);
}

// Search comic database (placeholder for API integration)
function searchComicDatabase() {
    const query = document.getElementById('comic-search').value;

    // Placeholder - In real implementation, this would call Comic Vine API or similar
    alert(`Searching for: ${query}\n\nAPI integration coming soon! For now, use manual entry.`);

    // Show manual entry form
    document.getElementById('manual-entry').style.display = 'block';

    // Simulate API response by pre-filling if it matches our sample data
    const found = library.searchComics(query);
    if (found.length > 0) {
        const comic = found[0];
        document.getElementById('comic-title').value = comic.title;
        document.getElementById('comic-author').value = comic.author;
        document.getElementById('comic-issue').value = comic.issue;
        document.getElementById('comic-year').value = comic.year;
        document.getElementById('comic-description').value = comic.description;
        document.getElementById('comic-cover').value = comic.cover;
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const searchModal = document.getElementById('search-modal');
    const addModal = document.getElementById('add-modal');

    if (event.target === searchModal) {
        searchModal.style.display = 'none';
    }
    if (event.target === addModal) {
        addModal.style.display = 'none';
    }
}
