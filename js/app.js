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
    const upc = document.getElementById('comic-upc').value;
    const description = document.getElementById('comic-description').value;
    const cover = document.getElementById('comic-cover').value || 'https://via.placeholder.com/400x600/2a2a2a/FFFFFF?text=' + encodeURIComponent(title);

    const newComic = {
        title,
        author,
        issue,
        year,
        upc,
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
    closeAddModal();
    document.getElementById('add-comic-form').reset();
    loadComics(currentFilter);

    alert(`Added "${title}" to your collection!`);
}

// ==================== //
// BARCODE SCANNING     //
// ==================== //

let currentBarcode = null;
let scannerActive = false;

// Show different add modes
function showScanMode() {
    hideAllAddModes();
    document.getElementById('scan-mode').style.display = 'block';
}

function showSearchMode() {
    hideAllAddModes();
    document.getElementById('search-mode').style.display = 'block';
}

function showManualMode() {
    hideAllAddModes();
    document.getElementById('manual-entry').style.display = 'block';
}

function hideAllAddModes() {
    document.getElementById('scan-mode').style.display = 'none';
    document.getElementById('search-mode').style.display = 'none';
    document.getElementById('manual-entry').style.display = 'none';
}

function closeAddModal() {
    document.getElementById('add-modal').style.display = 'none';
    stopScanner();
    hideAllAddModes();
}

// Start barcode scanner
function startScanner() {
    if (scannerActive) return;

    const config = {
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#camera-preview'),
            constraints: {
                width: 500,
                height: 300,
                facingMode: "environment"
            },
        },
        decoder: {
            readers: [
                "ean_reader",      // European Article Number
                "ean_8_reader",    // EAN-8
                "upc_reader",      // Universal Product Code
                "upc_e_reader",    // UPC-E
                "code_128_reader", // Code 128
                "code_39_reader",  // Code 39
            ],
            debug: {
                drawBoundingBox: true,
                showFrequency: true,
                drawScanline: true,
                showPattern: true
            }
        },
        locate: true
    };

    Quagga.init(config, function(err) {
        if (err) {
            console.error("Scanner initialization failed:", err);
            alert("Camera access failed. Please check permissions and try again.");
            return;
        }
        console.log("Scanner initialized");
        Quagga.start();
        scannerActive = true;

        document.getElementById('start-scan-btn').style.display = 'none';
        document.getElementById('stop-scan-btn').style.display = 'inline-block';
    });

    // Listen for barcode detection
    Quagga.onDetected(onBarcodeDetected);
}

// Stop barcode scanner
function stopScanner() {
    if (!scannerActive) return;

    if (typeof Quagga !== 'undefined') {
        Quagga.stop();
        Quagga.offDetected(onBarcodeDetected);
    }
    scannerActive = false;

    document.getElementById('start-scan-btn').style.display = 'inline-block';
    document.getElementById('stop-scan-btn').style.display = 'none';
}

// Handle detected barcode
function onBarcodeDetected(result) {
    const code = result.codeResult.code;

    // Validate barcode (must be numeric and reasonable length)
    if (!code || code.length < 8 || code.length > 13) {
        return;
    }

    currentBarcode = code;

    // Display the detected barcode
    document.getElementById('barcode-value').textContent = code;
    document.getElementById('barcode-result').style.display = 'block';

    // Stop scanner after successful detection
    stopScanner();

    // Play success sound (optional)
    playBeep();

    // Auto-lookup after 1 second
    setTimeout(() => {
        lookupBarcode();
    }, 1000);
}

// Simple beep sound for barcode detection
function playBeep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Look up comic by barcode
function lookupBarcode() {
    if (!currentBarcode) return;

    // Show loading state
    const resultDiv = document.getElementById('barcode-result');
    resultDiv.innerHTML = `
        <p class="barcode-detected">
            Looking up: <strong>${currentBarcode}</strong>
            <span style="display: block; margin-top: 10px;">
                <span class="loading-spinner">⏳</span> Searching database...
            </span>
        </p>
    `;

    // Simulate API call (in production, this would call Comic Vine or similar API)
    setTimeout(() => {
        // For demo, check if barcode matches sample data
        const found = library.getAllComics().find(c => c.upc === currentBarcode);

        if (found) {
            displayBarcodeResult({
                title: found.title,
                author: found.author,
                issue: found.issue,
                year: found.year,
                description: found.description,
                cover: found.cover,
                upc: currentBarcode
            });
        } else {
            // Show "not found" and offer manual entry
            resultDiv.innerHTML = `
                <div style="background: #ff9800; color: white; padding: 15px; border-radius: 8px; text-align: center;">
                    <p><strong>Comic not found in database</strong></p>
                    <p style="font-size: 14px; margin-top: 5px;">UPC: ${currentBarcode}</p>
                    <button onclick="prefillManualEntry()" class="search-btn" style="margin-top: 10px;">
                        Enter Details Manually
                    </button>
                </div>
            `;
        }
    }, 1500);
}

// Display barcode lookup result
function displayBarcodeResult(comic) {
    const resultDiv = document.getElementById('barcode-result');
    resultDiv.innerHTML = `
        <div class="database-result-item" style="margin: 15px 0; display: flex; gap: 15px; background: #4CAF50; color: white; padding: 15px; border-radius: 8px;">
            <img src="${comic.cover}" alt="${comic.title}" style="width: 80px; height: 120px; object-fit: cover; border-radius: 4px;">
            <div style="flex: 1;">
                <h4 style="color: white; margin-bottom: 5px;">${comic.title}</h4>
                <p style="margin: 3px 0;">${comic.author} - ${comic.year}</p>
                <p style="margin: 3px 0; font-size: 14px;">${comic.issue}</p>
                <button onclick="addScannedComic()" class="submit-btn" style="margin-top: 10px;">
                    Add to Collection
                </button>
            </div>
        </div>
    `;

    // Store the found comic data temporarily
    window.scannedComicData = comic;
}

// Add scanned comic to collection
function addScannedComic() {
    if (!window.scannedComicData) return;

    library.addComic(window.scannedComicData);

    // Close modal and refresh
    closeAddModal();
    loadComics(currentFilter);

    // Show success message
    alert(`Added "${window.scannedComicData.title}" to your collection!`);

    // Clear data
    window.scannedComicData = null;
    currentBarcode = null;
}

// Pre-fill manual entry with barcode
function prefillManualEntry() {
    showManualMode();
    if (currentBarcode) {
        document.getElementById('comic-upc').value = currentBarcode;
    }
}

// Search comic database (updated)
function searchComicDatabase(event) {
    if (event) event.preventDefault();

    const query = document.getElementById('comic-search').value.trim();
    if (!query) return;

    const resultsDiv = document.getElementById('database-results');
    resultsDiv.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">⏳ Searching...</p>';

    // Simulate API search
    setTimeout(() => {
        const results = library.searchComics(query);

        if (results.length === 0) {
            resultsDiv.innerHTML = `
                <p style="text-align: center; color: #666; padding: 20px;">
                    No results found for "${query}"
                    <br><br>
                    <button onclick="showManualMode()" class="manual-btn">Enter Manually</button>
                </p>
            `;
            return;
        }

        resultsDiv.innerHTML = '';
        results.forEach(comic => {
            const item = document.createElement('div');
            item.className = 'database-result-item';
            item.onclick = () => addComicFromSearch(comic);

            item.innerHTML = `
                <img src="${comic.cover}" alt="${comic.title}" class="database-result-img">
                <div class="database-result-info">
                    <h4>${comic.title}</h4>
                    <p>${comic.author} - ${comic.year}</p>
                    <p>${comic.issue}</p>
                    <div class="result-meta">
                        <span class="result-tag">${comic.genre}</span>
                        <span class="result-tag">${comic.universe}</span>
                    </div>
                </div>
            `;

            resultsDiv.appendChild(item);
        });
    }, 800);
}

// Add comic from search results
function addComicFromSearch(comic) {
    if (confirm(`Add "${comic.title}" to your collection?`)) {
        library.addComic({...comic});
        closeAddModal();
        loadComics(currentFilter);
        alert(`Added "${comic.title}" to your collection!`);
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
        closeAddModal();
    }
}
