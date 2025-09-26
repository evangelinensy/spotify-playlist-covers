# Fonts Directory

This directory contains custom fonts for the Spotify Playlist Cover Generator.

## Font Structure

```
public/fonts/
├── README.md                 # This file
├── primary/                  # Main brand fonts
│   ├── spotify-font/        # Spotify-style font family
│   └── custom-brand/        # Custom brand fonts
├── headings/                # Fonts for headings and titles
│   ├── display/             # Large display fonts
│   └── titles/              # Title fonts
├── body/                    # Body text fonts
│   ├── sans-serif/          # Clean sans-serif fonts
│   └── serif/               # Elegant serif fonts
└── special/                 # Special purpose fonts
    ├── mono/                # Monospace fonts
    └── decorative/          # Decorative/display fonts
```

## Supported Font Formats

- **WOFF2** (preferred) - Best compression, modern browsers
- **WOFF** - Good compression, wide browser support
- **TTF** - Fallback format
- **OTF** - Alternative format

## Usage Guidelines

### 1. Upload Your Fonts
Place font files in the appropriate subdirectory based on their use case.

### 2. Font Naming Convention
Use descriptive names:
- `spotify-primary-bold.woff2`
- `display-title-light.woff2`
- `body-text-regular.woff2`

### 3. CSS Integration
Fonts will be automatically loaded via CSS. See `src/styles/fonts.css` for implementation.

## Recommended Fonts for This Project

### Primary Brand Font (Spotify-style)
- **Inter** - Modern, clean, Spotify-like
- **Circular** - Spotify's actual font (if available)
- **Poppins** - Similar to Spotify's aesthetic

### Display/Heading Fonts
- **Montserrat** - Great for large headings
- **Roboto** - Google's clean font
- **Open Sans** - Highly readable

### Body Text
- **Source Sans Pro** - Adobe's clean font
- **Lato** - Friendly and readable
- **Nunito** - Rounded, modern feel

## File Size Optimization

- Use **WOFF2** format when possible (smallest file size)
- Include only the font weights you need (400, 600, 700)
- Consider using Google Fonts for common fonts to reduce bundle size

## Examples

```css
/* Example font declaration */
@font-face {
  font-family: 'SpotifyFont';
  src: url('/fonts/primary/spotify-font/spotify-regular.woff2') format('woff2'),
       url('/fonts/primary/spotify-font/spotify-regular.woff') format('woff');
  font-weight: 400;
  font-style: normal;
  font-display: swap; /* Improves loading performance */
}
```

## Next Steps

1. Upload your chosen fonts to the appropriate subdirectories
2. Update `src/styles/fonts.css` with your font declarations
3. Update CSS variables in `src/index.css` to use your custom fonts
4. Test font loading and fallbacks

---

**Note**: Always ensure you have proper licensing for any fonts you use in your project.
