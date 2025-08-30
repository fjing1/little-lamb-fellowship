# Little Lamb Fellowship — Youth Site

A simple, GitHub Pages–friendly static site for the youth fellowship.

## Features
- Events/announcements from `data/events.json`
- Song library from `data/songs.txt` (searchable)
- Prayer form (Formspree-ready)
- Photo gallery
- Dark mode + QR share modal
- Verse of the day

## Getting Started
1. Copy everything in this folder to your repository root.
2. In GitHub: **Settings → Pages**, serve from the `main` branch (root).
3. Replace placeholder images in `assets/images/` with your own.
4. Update `data/events.json` and `data/songs.txt` regularly.
5. In `contact.html`, replace the `form` action with your Formspree endpoint.

### Events JSON structure
```json
[
  {
    "title": "Event title",
    "date": "2025-09-09T18:30:00-05:00",
    "location": "Apple Park",
    "excerpt": "Food, games, worship—kick off the new year with friends!",
    "signup_url": "https://example.com/signup",
    "DRI":"tim"
  }
]
```

### Songs TXT format
Each line:
```
Title - optional tags, comma separated | https://link-to-file.pdf
```
Example:
```
Amazing Grace - hymn | https://example.com/amazing-grace.pdf
```

## Optional
- Add more pages or sections as needed.
- If your repository serves at a subfolder, adjust links accordingly.
