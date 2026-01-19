// Browse Page Logic
document.addEventListener('DOMContentLoaded', () => {
    loadUpcomingReleases();
    loadPopularThisWeek();
    loadRecommendations();
});

// Load upcoming releases
function loadUpcomingReleases() {
    const grid = document.getElementById('upcoming-grid');
    grid.innerHTML = '';

    upcomingReleases.forEach(release => {
        const card = createUpcomingCard(release);
        grid.appendChild(card);
    });
}

// Create upcoming release card
function createUpcomingCard(release) {
    const card = document.createElement('div');
    card.className = 'comic-card';

    const releaseDate = new Date(release.releaseDate);
    const formattedDate = releaseDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    card.innerHTML = `
        <img src="${release.cover}" alt="${release.title}" class="comic-cover">
        <div class="comic-info">
            <p class="comic-author">${release.author}</p>
            <h3 class="comic-title">${release.title}</h3>
            <p class="comic-subtitle">Release: ${formattedDate}</p>
            <button class="action-btn" style="margin-top: 10px; padding: 8px 16px; font-size: 14px;" onclick="addToReadList(${release.id})">
                Add to Read List
            </button>
        </div>
    `;

    return card;
}

// Load popular comics this week
function loadPopularThisWeek() {
    const grid = document.getElementById('popular-grid');
    grid.innerHTML = '';

    const popularComics = library.getPopularThisWeek();

    if (popularComics.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; font-size: 18px; padding: 40px;">No data yet. Start reading and rating comics!</p>';
        return;
    }

    popularComics.forEach(comic => {
        const card = createPopularCard(comic);
        grid.appendChild(card);
    });
}

// Create popular comic card
function createPopularCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    card.onclick = () => viewComicDetail(comic.id);

    const stars = generateStars(comic.readersRating);

    card.innerHTML = `
        <img src="${comic.cover}" alt="${comic.title}" class="comic-cover">
        <div class="comic-info">
            <p class="comic-author">${comic.author}</p>
            <h3 class="comic-title">${comic.title}</h3>
            <div class="comic-subtitle" style="margin-bottom: 10px;">
                <span style="background: var(--superman-red); color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">TRENDING</span>
                <span style="margin-left: 8px; color: #666;">${comic.searchCount || 0} views</span>
            </div>
            <div class="star-rating">
                ${stars}
            </div>
        </div>
    `;

    return card;
}

// Load recommendations
function loadRecommendations() {
    const grid = document.getElementById('recommended-grid');
    grid.innerHTML = '';

    const recommendations = library.getRecommendations();

    if (recommendations.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #666; font-size: 18px; padding: 40px;">Rate some comics to get personalized recommendations!</p>';
        return;
    }

    recommendations.slice(0, 6).forEach(comic => {
        const card = createRecommendedCard(comic);
        grid.appendChild(card);
    });
}

// Create recommended comic card
function createRecommendedCard(comic) {
    const card = document.createElement('div');
    card.className = 'comic-card';
    card.onclick = () => viewComicDetail(comic.id);

    const stars = generateStars(comic.readersRating);

    card.innerHTML = `
        <img src="${comic.cover}" alt="${comic.title}" class="comic-cover">
        <div class="comic-info">
            <p class="comic-author">${comic.author}</p>
            <h3 class="comic-title">${comic.title}</h3>
            <p class="comic-subtitle">Because you like ${comic.genre}</p>
            <div class="star-rating">
                ${stars}
            </div>
        </div>
    `;

    return card;
}

// Generate star HTML
function generateStars(rating) {
    let starsHTML = '';
    const fullStars = Math.floor(rating);

    for (let i = 1; i <= 5; i++) {
        const filled = i <= fullStars ? 'filled' : '';
        starsHTML += `<span class="star ${filled}">★</span>`;
    }

    return starsHTML;
}

// Navigate to comic detail
function viewComicDetail(comicId) {
    library.incrementSearchCount(comicId);
    window.location.href = `detail.html?id=${comicId}`;
}

// Add to read list
function addToReadList(releaseId) {
    alert('Comic added to your read list! You\'ll be notified when it\'s released.');
}
