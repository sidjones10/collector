# Collector - Your Comic Library

A stunning web application for managing your comic book collection, inspired by the sleek vault aesthetics of Iron Man's garage and Batman's lair.

## Features

### Core Functionality
- **Comic Library Management** - Organize and track your entire comic collection
- **Smart Search** - Search by title, author, character, genre, or universe
- **Manual Input & Scanning** - Add comics manually or prepare for barcode scanning integration
- **Rating System** - Rate comics with a 5-star system (like Letterboxd for comics)
- **Read List** - Track comics you want to read
- **Browse & Discover** - Explore upcoming releases, popular comics, and personalized recommendations

### Design
- **Vault-Themed UI** - High-tech, sleek interface inspired by superhero lairs
- **Superman Color Scheme** - Bold red (#DC143C) and blue (#0047AB) with metallic accents
- **Responsive Design** - Works on desktop and mobile devices
- **Smooth Animations** - Polished hover effects and transitions

### Smart Features
- **Recommendation Algorithm** - Get personalized suggestions based on your library and ratings
- **Popular This Week** - See trending comics based on search activity and ratings
- **Auto-Population** - Search functionality ready for Comic Vine API integration
- **Local Storage** - All your data is saved locally in your browser

## File Structure

```
collector/
├── index.html           # Landing page
├── deck.html           # Main library view
├── detail.html         # Comic detail page
├── browse.html         # Browse new and popular comics
├── css/
│   ├── styles.css      # Main stylesheet
│   └── browse.css      # Browse page styles
├── js/
│   ├── data.js         # Data management and sample comics
│   ├── app.js          # Deck page functionality
│   ├── detail.js       # Detail page functionality
│   └── browse.js       # Browse page functionality
└── README.md           # This file
```

## Getting Started

1. **Open the app**: Simply open `index.html` in your web browser
2. **Explore the landing page**: Click "Enter the Vault" to access your library
3. **Add comics**: Click the "Add" button to add comics to your collection
4. **Browse**: Click "BROWSE" to see upcoming releases and recommendations
5. **Rate comics**: Click on any comic to view details and add your rating

## Pages

### Landing Page (index.html)
- Hero section with featured comics
- "Comics of the Week" showcase
- "New Releases" section
- Launching date banner

### The Deck (deck.html)
- Main library view with all your comics
- Filter by Collection, Universe, Genre, Rating, Character
- Search functionality
- Add new comics

### Detail Page (detail.html)
- Full comic information
- Large cover image
- Your rating and readers' rating
- Description
- Add to read list
- Remove from collection

### Browse Page (browse.html)
- Upcoming Releases - See what's coming soon
- Popular This Week - Trending comics based on activity
- Recommended For You - Personalized suggestions

## Features In Detail

### Rating System
- 5-star rating system for each comic
- Track your personal ratings
- See average readers' ratings
- Interactive star selection on detail pages

### Filtering
- **Collection**: View all comics in your library
- **Universe**: Filter by Marvel, DC, Image, etc.
- **Genre**: Filter by Superhero, Horror, Action, etc.
- **Rating**: Show highly-rated comics (4+ stars)
- **Character**: Filter by character names
- **Read List**: View comics you want to read

### Search
- Real-time search as you type
- Search across titles, authors, characters, and genres
- Visual search results with covers

### Algorithms

#### Recommendation Algorithm
```javascript
// Analyzes your rated comics to find your favorite genres and universes
// Recommends unread comics that match your preferences
// Weights: User rating influences genre/universe preferences
```

#### Popular This Week Algorithm
```javascript
// Combines multiple factors:
// - Search count (40% weight)
// - Readers' rating (40% weight via multiplication)
// - User rating (20% weight via multiplication)
// Result: Comics that are both searched often AND highly rated rise to the top
```

## Data Management

All data is stored in your browser's localStorage:
- Comic library
- Your ratings
- Read list status
- Search history

Sample data is included to get you started with:
- The Walking Dead
- X-Men
- Batman
- Spider-Man
- Wolverine
- Elektra

## Future Enhancements

### Ready for Integration
- **Comic Vine API**: Search and auto-populate comic data
- **Barcode Scanning**: Use device camera to scan comic barcodes
- **Cloud Sync**: Sync your library across devices
- **Social Features**: Share your collection and reviews
- **Advanced Filtering**: More filter options and combinations
- **Export/Import**: Backup and restore your collection

### Planned Features
- Reading progress tracking
- Collection statistics and insights
- Wishlist with price tracking
- Pull list management for new releases
- Custom tags and collections
- Dark mode toggle

## Color Scheme

- **Superman Red**: #DC143C (Crimson) - Primary buttons, headers
- **Superman Blue**: #0047AB (Cobalt) - Filters, secondary elements
- **Vault Dark**: #1a1a1a - Dark backgrounds
- **Vault Darker**: #0d0d0d - Deeper backgrounds
- **Metallic Silver**: #C0C0C0 - Icons
- **Gold Accent**: #FFD700 - Stars, special highlights
- **Cream**: #F5E6D3 - Content backgrounds

## Browser Compatibility

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## Tips

1. **Start by rating comics** - This helps the recommendation algorithm learn your preferences
2. **Use the read list** - Track comics you want to read
3. **Explore Browse** - Discover new comics and see what's trending
4. **Search is powerful** - Search by character names, authors, or genres
5. **Data persists** - Your library is saved automatically in your browser

## Credits

**App Name**: Collector
**Branding**: STICKYPAGES
**Design Inspiration**: Iron Man's garage, Batman's lair
**Color Scheme**: Superman Red and Blue
**Built with**: HTML, CSS, JavaScript (Vanilla)

---

**Note**: This is a front-end application. For production use, consider:
- Backend database for data persistence
- User authentication
- API integration for comic data
- Cloud storage for cover images
- Analytics for better recommendations
