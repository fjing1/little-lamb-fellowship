# Little Lamb Fellowship Website

A modern, accessible static website for the Little Lamb Fellowship young professional group at Austin Chinese Church.

## 🚀 Recent Improvements

### ✅ Fixed Issues
- **HTML Validation**: Fixed typos and inconsistent CSS paths
- **CSS Organization**: Consolidated styles and fixed broken links
- **Form Integration**: Unified Formspree endpoints across all forms
- **Responsive Design**: Enhanced mobile experience with better navigation

### 🎨 Enhanced Design
- **Modern UI**: Updated with CSS custom properties and smooth transitions
- **Dark/Light Theme**: Improved theme toggle with better contrast
- **Interactive Elements**: Enhanced buttons, cards, and form elements
- **Loading States**: Added visual feedback for async operations

### ♿ Accessibility Improvements
- **Skip Links**: Added for keyboard navigation
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Visible focus indicators and logical tab order
- **Form Accessibility**: Enhanced form labels and validation feedback
- **Color Contrast**: Improved contrast ratios for better readability

### 📱 Mobile Optimization
- **Responsive Navigation**: Mobile-friendly header with collapsible nav
- **Touch Targets**: Minimum 44px touch targets for better usability
- **Viewport Meta**: Proper mobile viewport configuration
- **Progressive Enhancement**: Works without JavaScript

### ⚡ Performance Enhancements
- **Error Handling**: Robust error handling with user-friendly messages
- **Loading Optimization**: Lazy loading for images and async content
- **Timeout Management**: Request timeouts to prevent hanging
- **Debounced Search**: Optimized search functionality
- **Resource Optimization**: Efficient CSS and JavaScript loading

### 🔒 Security Features
- **Honeypot Protection**: Spam prevention in forms
- **Input Sanitization**: XSS protection with HTML escaping
- **HTTPS Links**: Secure external links with proper rel attributes

## 📁 Project Structure

```
├── index.html              # Homepage
├── events.html             # Events and announcements
├── songs.html              # Song library with search
├── contact.html            # Prayer request center
├── photos.html             # Photo gallery
├── financial.html          # Financial tracking system
├── assets/
│   ├── css/
│   │   ├── style.css       # Main styles
│   │   └── theme.css       # Theme enhancements
│   ├── js/
│   │   ├── script.js       # Main JavaScript
│   │   └── prayer-encryption.js  # Prayer encryption system
│   └── images/             # Images and assets
├── data/
│   ├── events.json         # Event data
│   └── songs.txt           # Song library data (35 songs)
├── netlify/functions/      # Serverless functions
├── .github/workflows/      # GitHub Actions
└── resource/               # Additional resources
```

## 🛠️ Setup & Development

### Prerequisites
- Modern web browser
- Local web server (optional, for development)

### Quick Start
1. Clone or download the repository
2. Open `index.html` in a web browser
3. For development, use a local server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js (with http-server)
   npx http-server
   
   # PHP
   php -S localhost:8000
   ```

### Content Management

#### Adding Events
Edit `data/events.json`:
```json
{
  "title": "Event Name",
  "date": "2025-12-25T18:00:00-06:00",
  "location": "Location Name",
  "excerpt": "Brief description",
  "signup_url": "https://example.com/signup" // optional
}
```

#### Adding Songs
Edit `data/songs.txt`:
```
Song Title - tag1, tag2 | https://example.com/song.pdf
```

#### Adding Photos
1. Add images to `assets/images/`
2. Update `photos.html` with new `<figure>` elements
3. Use descriptive alt text for accessibility

### Form Configuration
Update Formspree endpoints in:
- `index.html` (signup form)
- `events.html` (signup form)
- `contact.html` (prayer form)

Replace `https://formspree.io/f/mandojop` with your endpoint.

### Financial System Setup
The financial tracking system requires:
1. Admin credentials (configured in `financial.html`)
2. Local storage for transaction data
3. Secure access for authorized users only

### Prayer Encryption Setup
For secure prayer requests, see `PRAYER-ENCRYPTION-SETUP.md` for detailed configuration instructions including:
- GitHub repository setup
- Environment variables
- Encryption key management

## 🎯 Features

### Navigation
- Sticky header with backdrop blur
- Active page highlighting
- Mobile-responsive collapsible menu
- Skip links for accessibility

### Theme System
- Automatic dark/light mode detection
- Manual theme toggle
- Persistent theme preference
- High contrast support

### Event Management
- Dynamic event loading from JSON
- Automatic past/future sorting
- Signup integration
- Loading states and error handling

### Song Library
- Real-time search functionality
- Tag-based filtering
- Bulk download capability
- Responsive card layout
- 35 songs including 20 Chinese worship songs

### Prayer Center
- Secure encrypted prayer request submission
- Admin dashboard for prayer management
- Military-grade AES-256-GCM encryption
- GitHub integration for secure storage
- Automatic email notifications

### Financial Tracking
- Secure login system for authorized users
- Transaction management (offerings & expenses)
- Category-based organization
- Financial reporting and summaries
- CSV export functionality
- Real-time balance calculations

### Forms
- Spam protection with honeypots
- Client-side validation
- Accessible error messages
- Progressive enhancement

## 🔧 Customization

### Colors
Modify CSS custom properties in `assets/css/style.css`:
```css
:root {
  --brand: #2563eb;        /* Primary brand color */
  --accent: #3b82f6;       /* Accent color */
  --bg: #ffffff;           /* Background */
  --fg: #0f172a;           /* Foreground text */
}
```

### Typography
Update font stack in the body selector:
```css
body {
  font: 16px/1.6 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}
```

### Layout
Adjust container max-width:
```css
.container {
  max-width: 1000px; /* Adjust as needed */
}
```

## 📊 Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with ES2020 support

## 🤝 Contributing

1. Test changes across different browsers and devices
2. Ensure accessibility standards are maintained
3. Validate HTML and CSS
4. Test with JavaScript disabled
5. Check mobile responsiveness

## 📝 License

This project is for Little Lamb Fellowship at Austin Chinese Church. Please respect the community and use responsibly.

## 🆘 Support

For technical issues or questions:
1. Check browser console for errors
2. Verify all file paths are correct
3. Ensure forms are properly configured
4. Test with a local server for development

---

*Built with ❤️ for the Little Lamb Fellowship community*