// Sample Comic Data
const sampleComics = [
    {
        id: 1,
        title: "The Walking Dead",
        volume: "Volume 3",
        author: "Robert Kirkman",
        issue: "Book Three",
        year: 2008,
        upc: "978158240391",
        cover: "https://via.placeholder.com/400x600/2a2a2a/FFFFFF?text=The+Walking+Dead+3",
        description: "The walking dead book 3 is about the continuing journey of Rick Grimes and his group of survivors as they navigate the zombie apocalypse. They face new threats from both the undead and the living.",
        genre: "Horror",
        universe: "Image Comics",
        characters: ["Rick Grimes", "Michonne"],
        userRating: 5,
        readersRating: 4.8,
        volumes: [1, 2, 4, 7],
        popularity: 95,
        searchCount: 234,
        inReadList: false
    },
    {
        id: 2,
        title: "Elektra",
        volume: "Volume 1",
        author: "Frank Miller",
        issue: "#1",
        year: 1996,
        upc: "759606075645",
        cover: "https://via.placeholder.com/400x600/DC143C/FFFFFF?text=Elektra+1",
        description: "Elektra is a skilled martial artist and assassin in the Marvel Universe. This series follows her deadly adventures.",
        genre: "Action",
        universe: "Marvel",
        characters: ["Elektra"],
        userRating: 4,
        readersRating: 4.5,
        volumes: [1, 4],
        popularity: 78,
        searchCount: 156,
        inReadList: false
    },
    {
        id: 3,
        title: "Batman",
        volume: "Issue #458",
        author: "Marv Wolfman",
        issue: "#458",
        year: 1990,
        upc: "761941234567",
        cover: "https://via.placeholder.com/400x600/0047AB/FFFFFF?text=Batman+458",
        description: "Batman protects Gotham City from crime and corruption. This issue features a thrilling confrontation with classic villains.",
        genre: "Superhero",
        universe: "DC Comics",
        characters: ["Batman", "Robin"],
        userRating: 0,
        readersRating: 4.2,
        volumes: [],
        popularity: 88,
        searchCount: 298,
        inReadList: false
    },
    {
        id: 4,
        title: "The Amazing Spider-Man",
        volume: "Issue #324",
        author: "David Michelinie",
        issue: "#324",
        year: 1989,
        upc: "759606011234",
        cover: "https://via.placeholder.com/400x600/DC143C/FFFFFF?text=Spider-Man+324",
        description: "Peter Parker swings into action as Spider-Man, fighting crime while dealing with his personal life challenges.",
        genre: "Superhero",
        universe: "Marvel",
        characters: ["Spider-Man", "Mary Jane"],
        userRating: 3,
        readersRating: 4.0,
        volumes: [],
        popularity: 92,
        searchCount: 412,
        inReadList: true
    },
    {
        id: 5,
        title: "X-Men",
        volume: "Issue #1",
        author: "Chris Claremont",
        issue: "#1",
        year: 1991,
        upc: "759606098765",
        cover: "https://via.placeholder.com/400x600/0047AB/FFFFFF?text=X-Men+1",
        description: "The X-Men are mutants with extraordinary powers, fighting for a world that hates and fears them.",
        genre: "Superhero",
        universe: "Marvel",
        characters: ["Cyclops", "Wolverine", "Storm", "Jean Grey"],
        userRating: 5,
        readersRating: 4.9,
        volumes: [],
        popularity: 98,
        searchCount: 523,
        inReadList: false
    },
    {
        id: 6,
        title: "Wolverine",
        volume: "Issue #88",
        author: "Larry Hama",
        issue: "#88",
        year: 1994,
        upc: "759606054321",
        cover: "https://via.placeholder.com/400x600/DC143C/FFFFFF?text=Wolverine+88",
        description: "Wolverine is the best at what he does, and what he does isn't very nice. Follow his brutal adventures.",
        genre: "Action",
        universe: "Marvel",
        characters: ["Wolverine"],
        userRating: 4,
        readersRating: 4.3,
        volumes: [],
        popularity: 85,
        searchCount: 267,
        inReadList: false
    }
];

// Upcoming releases
const upcomingReleases = [
    {
        id: 101,
        title: "Batman: The Dark Knight Returns",
        author: "Frank Miller",
        releaseDate: "2026-02-15",
        cover: "https://via.placeholder.com/400x600/0047AB/FFFFFF?text=Batman+DKR"
    },
    {
        id: 102,
        title: "Saga",
        author: "Brian K. Vaughan",
        releaseDate: "2026-03-01",
        cover: "https://via.placeholder.com/400x600/DC143C/FFFFFF?text=Saga"
    },
    {
        id: 103,
        title: "Invincible",
        author: "Robert Kirkman",
        releaseDate: "2026-03-20",
        cover: "https://via.placeholder.com/400x600/0047AB/FFFFFF?text=Invincible"
    }
];

// Data Management Functions
class ComicLibrary {
    constructor() {
        this.loadFromStorage();
    }

    loadFromStorage() {
        const stored = localStorage.getItem('comicLibrary');
        if (stored) {
            this.comics = JSON.parse(stored);
        } else {
            this.comics = [...sampleComics];
            this.saveToStorage();
        }
    }

    saveToStorage() {
        localStorage.setItem('comicLibrary', JSON.stringify(this.comics));
    }

    getAllComics() {
        return this.comics;
    }

    getComicById(id) {
        return this.comics.find(comic => comic.id === parseInt(id));
    }

    addComic(comic) {
        comic.id = this.comics.length > 0 ? Math.max(...this.comics.map(c => c.id)) + 1 : 1;
        comic.userRating = 0;
        comic.inReadList = false;
        comic.searchCount = 0;
        comic.popularity = 0;
        this.comics.push(comic);
        this.saveToStorage();
        return comic;
    }

    updateComic(id, updates) {
        const index = this.comics.findIndex(comic => comic.id === parseInt(id));
        if (index !== -1) {
            this.comics[index] = { ...this.comics[index], ...updates };
            this.saveToStorage();
            return this.comics[index];
        }
        return null;
    }

    deleteComic(id) {
        this.comics = this.comics.filter(comic => comic.id !== parseInt(id));
        this.saveToStorage();
    }

    rateComic(id, rating) {
        return this.updateComic(id, { userRating: rating });
    }

    toggleReadList(id) {
        const comic = this.getComicById(id);
        if (comic) {
            return this.updateComic(id, { inReadList: !comic.inReadList });
        }
        return null;
    }

    searchComics(query) {
        query = query.toLowerCase();
        return this.comics.filter(comic =>
            comic.title.toLowerCase().includes(query) ||
            comic.author.toLowerCase().includes(query) ||
            (comic.characters && comic.characters.some(char => char.toLowerCase().includes(query))) ||
            comic.genre.toLowerCase().includes(query)
        );
    }

    incrementSearchCount(id) {
        const comic = this.getComicById(id);
        if (comic) {
            this.updateComic(id, { searchCount: (comic.searchCount || 0) + 1 });
        }
    }

    getPopularThisWeek() {
        // Algorithm: Combine search count and ratings with weighted scoring
        return this.comics
            .map(comic => ({
                ...comic,
                score: (comic.searchCount * 0.4) + (comic.readersRating * 20) + (comic.userRating * 10)
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);
    }

    getRecommendations() {
        // Simple recommendation algorithm based on user's library
        const userGenres = {};
        const userUniverses = {};

        this.comics.forEach(comic => {
            if (comic.userRating > 0) {
                userGenres[comic.genre] = (userGenres[comic.genre] || 0) + comic.userRating;
                userUniverses[comic.universe] = (userUniverses[comic.universe] || 0) + comic.userRating;
            }
        });

        const topGenre = Object.keys(userGenres).reduce((a, b) =>
            userGenres[a] > userGenres[b] ? a : b, Object.keys(userGenres)[0]
        );

        const topUniverse = Object.keys(userUniverses).reduce((a, b) =>
            userUniverses[a] > userUniverses[b] ? a : b, Object.keys(userUniverses)[0]
        );

        return this.comics.filter(comic =>
            (comic.genre === topGenre || comic.universe === topUniverse) && comic.userRating === 0
        );
    }

    filterByGenre(genre) {
        return this.comics.filter(comic => comic.genre === genre);
    }

    filterByUniverse(universe) {
        return this.comics.filter(comic => comic.universe === universe);
    }

    filterByRating(minRating) {
        return this.comics.filter(comic => comic.readersRating >= minRating);
    }

    filterByCharacter(character) {
        return this.comics.filter(comic =>
            comic.characters && comic.characters.some(char =>
                char.toLowerCase().includes(character.toLowerCase())
            )
        );
    }

    getReadList() {
        return this.comics.filter(comic => comic.inReadList);
    }
}

// Initialize global library instance
const library = new ComicLibrary();
