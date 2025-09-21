# Images Directory Structure

This directory contains all images used in the Spotify Playlist Cover Generator project.

## 📁 Directory Structure

```
public/images/
├── README.md                    # This file
│
├── disc-bases/                  # Base disc images for compositing
│   ├── disc-bg-new.png         # Main disc background
│   ├── disc-bg-old.png         # Previous version
│   └── plastic-disc-cover.png  # Plastic overlay effect
│
├── templates/                   # Reference images for AI prompts
│   ├── gradient-examples/      # Gradient style references
│   ├── abstract-examples/      # Abstract style references  
│   ├── nature-examples/        # Nature style references
│   └── vintage-film-examples/  # Vintage film style references
│
├── ui-elements/                # UI component images
│   ├── buttons/               # Button graphics and states
│   ├── forms/                 # Form element graphics
│   └── cards/                 # Card component graphics
│
├── backgrounds/               # Background images
│   ├── gradients/            # Gradient backgrounds
│   └── patterns/             # Pattern backgrounds
│
├── icons/                    # Icon graphics
│   ├── social/               # Social media icons
│   ├── navigation/           # Navigation icons
│   └── status/               # Status indicators
│
├── logos/                    # Logo files
│   ├── brand/                # Main brand logos
│   └── variants/             # Logo variations
│
├── placeholders/             # Placeholder images
│   ├── loading/              # Loading state images
│   └── empty/                # Empty state images
│
├── generated/                # Generated images
│   ├── covers/               # Generated playlist covers
│   └── thumbnails/           # Thumbnail versions
│
└── user-uploads/             # User uploaded content
    ├── temp/                 # Temporary uploads
    └── processed/            # Processed user images
```

## 🎯 Image Categories

### 1. **Disc Bases** (`/disc-bases/`)
- **Purpose**: Base images for disc compositing
- **Formats**: PNG (with transparency)
- **Sizes**: 300x300px (matching cover requirements)
- **Usage**: Background for generated images

### 2. **Templates** (`/templates/`)
- **Purpose**: Reference images for AI prompt generation
- **Formats**: JPG, PNG
- **Usage**: Style examples for each generation type
- **Organization**: Separate folders for each style (gradient, abstract, nature, vintage)

### 3. **UI Elements** (`/ui-elements/`)
- **Purpose**: Interface graphics and components
- **Formats**: SVG (preferred), PNG
- **Usage**: Buttons, forms, cards, and UI graphics

### 4. **Backgrounds** (`/backgrounds/`)
- **Purpose**: Background images and patterns
- **Formats**: JPG, PNG, SVG
- **Usage**: Page backgrounds, hero sections

### 5. **Icons** (`/icons/`)
- **Purpose**: Icon graphics for navigation and actions
- **Formats**: SVG (preferred), PNG
- **Sizes**: Multiple sizes (16px, 24px, 32px, 48px)
- **Usage**: Navigation, buttons, status indicators

### 6. **Logos** (`/logos/`)
- **Purpose**: Brand logos and variations
- **Formats**: SVG (preferred), PNG
- **Usage**: Header, footer, branding elements

### 7. **Placeholders** (`/placeholders/`)
- **Purpose**: Loading and empty state images
- **Formats**: SVG, PNG
- **Usage**: Loading spinners, empty states

### 8. **Generated** (`/generated/`)
- **Purpose**: AI-generated playlist covers
- **Formats**: PNG, JPG
- **Sizes**: 300x300px
- **Usage**: Display generated results

### 9. **User Uploads** (`/user-uploads/`)
- **Purpose**: User-uploaded images
- **Formats**: JPG, PNG, WEBP
- **Usage**: Custom user content

## 📏 Image Specifications

### **Playlist Covers**
- **Size**: 300x300px (square)
- **Format**: PNG (for transparency), JPG (for photos)
- **Quality**: High resolution, optimized for web
- **Background**: Transparent or white

### **Disc Bases**
- **Size**: 300x300px
- **Format**: PNG with transparency
- **Style**: Realistic disc appearance
- **Usage**: Compositing background

### **Icons**
- **Sizes**: 16px, 24px, 32px, 48px
- **Format**: SVG (preferred) or PNG
- **Style**: Consistent with brand guidelines
- **Colors**: Use CSS variables for theming

### **Backgrounds**
- **Size**: Responsive (1920px+ width)
- **Format**: JPG for photos, SVG for patterns
- **Optimization**: Compressed for web

## 🚀 Upload Guidelines

### **For Disc Bases:**
1. Upload to `/disc-bases/`
2. Use descriptive names: `disc-base-v2.png`
3. Ensure 300x300px dimensions
4. Test compositing functionality

### **For Style Templates:**
1. Upload to appropriate `/templates/[style]/` folder
2. Use descriptive names: `gradient-example-1.jpg`
3. Include variety of examples
4. Optimize for web (under 500KB each)

### **For UI Elements:**
1. Upload to `/ui-elements/[category]/`
2. Use SVG when possible
3. Follow naming convention: `button-primary.svg`
4. Include multiple states (hover, active, disabled)

### **For Generated Images:**
1. Save to `/generated/covers/`
2. Use timestamp or ID naming: `cover-20250120-123456.png`
3. Create thumbnails in `/generated/thumbnails/`
4. Implement cleanup for old images

## 🛠️ Image Optimization

### **Before Upload:**
- Compress images using tools like TinyPNG
- Use appropriate formats (SVG for icons, PNG for transparency)
- Optimize for web delivery
- Include multiple sizes for responsive design

### **Naming Convention:**
- Use kebab-case: `playlist-cover-template.jpg`
- Include version numbers: `disc-base-v2.png`
- Use descriptive names: `gradient-style-example.png`
- Include dimensions for multiple sizes: `icon-play-24px.svg`

## 📱 Responsive Considerations

- Provide multiple sizes for different screen densities
- Use `srcset` for responsive images
- Consider mobile-first optimization
- Test on various devices and screen sizes

## 🔧 Technical Integration

### **CSS Integration:**
```css
/* Example image usage */
.disc-base {
  background-image: url('/images/disc-bases/disc-bg-new.png');
}

.style-example {
  background-image: url('/images/templates/gradient-examples/example-1.jpg');
}
```

### **JavaScript Integration:**
```javascript
// Example image loading
const discBase = '/images/disc-bases/disc-bg-new.png';
const plasticOverlay = '/images/disc-bases/plastic-disc-cover.png';
```

## 📋 Maintenance Checklist

- [ ] Regular cleanup of generated images
- [ ] Optimization of uploaded images
- [ ] Update template examples periodically
- [ ] Test all image paths and loading
- [ ] Monitor file sizes and performance
- [ ] Backup important images
- [ ] Update README when adding new categories

---

**Note**: Always ensure you have proper rights to use any images in your project.