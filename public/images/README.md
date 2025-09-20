# Images Directory

This directory contains all images used by the Spotify Playlist Cover Generator.

## Folder Structure

### `/disc-bases/`
- **Purpose**: Base disc images that will be used as the foundation for all generated covers
- **Format**: PNG files with transparent backgrounds
- **Size**: 300x300px recommended
- **Usage**: The app will overlay generated images onto these disc shapes

**Current Files:**
- `disc-bg-new.png` - Main disc base (gray center with transparent outer ring)

### `/templates/`
- **Purpose**: Reference images for different style templates
- **Format**: Any image format (JPG, PNG, etc.)
- **Usage**: Visual references for the AI prompt generation

**Suggested Templates:**
- `gradient-examples/` - Sample gradient images
- `abstract-examples/` - Sample abstract art
- `nature-examples/` - Sample vintage film photography
- `vintage-film-examples/` - Sample retro camera effects

### `/uploaded/`
- **Purpose**: User-uploaded images for custom processing
- **Format**: Any image format
- **Usage**: Images uploaded through the app interface

## Adding New Images

1. **Disc Bases**: Add new disc base images to `/disc-bases/`
2. **Templates**: Add reference images to `/templates/`
3. **User Uploads**: Images uploaded through the app will be stored in `/uploaded/`

## File Naming Convention

- Use descriptive names with hyphens: `vintage-film-golden-gate.jpg`
- Include dimensions if relevant: `disc-base-300x300.png`
- Use lowercase letters and avoid spaces

## Supported Formats

- **PNG**: Best for disc bases (supports transparency)
- **JPG**: Good for photographs and templates
- **WebP**: Modern format with good compression
- **SVG**: Vector graphics for scalable elements

## Tips

- Keep file sizes reasonable (< 5MB per image)
- Use high-quality images for better AI generation results
- Test images in the app before adding to production
