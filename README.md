# CodeAlpha_Image-Gallery

A feature-rich, responsive image gallery application built with vanilla JavaScript, CSS, and HTML. Upload, organize, categorize, and edit your images with an intuitive user interface and powerful editing capabilities.


## ✨ Features

### 📤 Image Management
- **Drag & Drop Upload**: Easily upload images by dragging them to the drop zone
- **Multi-category Organization**: Automatically organize images into categories:
  - Nature
  - People
  - Architecture
  - Art
  - Uncategorized
- **Local Storage**: All images are saved in browser's localStorage for persistence
- **Image Metadata**: Track upload date, file size, and image dimensions

### 🎨 Image Editing
- **Image Editor Modal**: Advanced editing capabilities with:
  - **Transform Options**: Rotate left/right, flip horizontally/vertically
  - **Adjustments**: Control brightness, contrast, saturation, and blur
  - **Filter Presets**: Apply pre-built filters (Grayscale, Sepia, Hue Rotate, Invert)
  - **Real-time Preview**: See changes instantly on canvas
  - **Save & Reset**: Save edited images or reset to original

### 🔍 Viewing & Navigation
- **Lightbox View**: Full-screen image viewing with:
  - Navigation arrows to browse through images
  - Image information (title, category, date, size, dimensions)
  - Quick actions (edit, download, delete)
- **Gallery Grid View**: Responsive grid layout with smooth hover effects
- **List View Toggle**: Switch between grid and list view modes
- **Empty State**: Friendly message when no images are available

### 🎭 Theme & UI
- **Dark/Light Mode**: Toggle between light and dark themes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Collapsible Sidebar**: Space-saving navigation panel
- **Smooth Animations**: Transition effects and visual feedback
- **Category Badges**: Quick visual identification of image categories
- **Counter Badges**: See image count per category

### ⌨️ Keyboard Shortcuts
- **Escape**: Close lightbox or editor modal
- **Arrow Left/Right**: Navigate between images in lightbox
- **Click Background**: Close lightbox or modal

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server or build process required

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/adnanrahimtech/CodeAlpha_Image-Gallery.git
   ```

2. **Navigate to the directory**
   ```bash
   cd CodeAlpha_Image-Gallery
   ```

3. **Open in browser**
   - Double-click `index.html` or
   - Use a local server:
     ```bash
     python -m http.server 8000
     # or
     npx http-server
     ```
   - Visit `http://localhost:8000`

---

## 💻 Usage

### Uploading Images
1. Click the **"Upload Images"** button in the sidebar
2. Select images from your computer, or
3. Drag and drop images directly onto the drop zone

### Categorizing Images
- When uploading, you'll be prompted to select a category
- Choose from: Nature, People, Architecture, Art, or Uncategorized

### Viewing Images
1. Click any image thumbnail to open the lightbox viewer
2. Use navigation arrows to browse
3. View image metadata in the footer

### Editing Images
1. Open an image in lightbox view
2. Click the **Edit** button (pencil icon)
3. Adjust brightness, contrast, saturation, or blur
4. Apply filter presets
5. Click **Save Changes** to apply edits

### Managing Images
- **Download**: Click the download icon to save an image to your device
- **Delete**: Click the trash icon to remove an image
- **Filter**: Use sidebar categories to filter images

### Theme & View Settings
- **Dark Mode**: Click the moon/sun icon in the header
- **View Mode**: Click the grid/list icon to toggle view

---

## 📁 File Structure

```
CodeAlpha_Image-Gallery/
├── index.html          # Main HTML structure
├── style.css           # Styling and responsive design
├── script.js           # JavaScript functionality and state management
└── README.md           # Documentation
```

### Key Components

**index.html**
- Sidebar navigation with category filters
- Main gallery grid area
- Lightbox modal for full-screen viewing
- Editor modal for image adjustments
- Font Awesome icons integration

**style.css**
- CSS custom properties for theming
- Flexbox and Grid layouts
- Dark/light mode variables
- Responsive breakpoints (1024px, 768px, 480px)
- Smooth transitions and animations

**script.js**
- `GalleryApp` class for state management
- Image upload and storage handling
- Filter and rendering logic
- Lightbox navigation
- Image editing with canvas API
- Theme switching

---

## 🛠️ Technologies Used

| Technology | Purpose | Share |
|-----------|---------|-------|
| **JavaScript** | Interactivity, state management, image editing | 45.9% |
| **CSS** | Styling, layout, animations, responsive design | 33.1% |
| **HTML** | Semantic markup, structure | 21% |
| **Font Awesome** | Icons (via CDN) | - |
| **Canvas API** | Image manipulation and editing | - |
| **LocalStorage API** | Client-side data persistence | - |

---

## 💾 Data Storage

Images are stored in browser's **localStorage** with the following structure:

```javascript
{
  id: unique_timestamp,
  name: "filename.jpg",
  data: "data:image/jpeg;base64,...", // Base64 encoded image
  category: "nature",
  uploadedAt: "2026-06-22T12:00:00.000Z",
  size: 102400,          // in bytes
  width: 1920,           // in pixels
  height: 1080           // in pixels
}
```

**Note**: Storage is limited by browser (typically 5-10MB). Consider using a backend for production use.

---

## 📱 Responsive Design

The gallery is fully responsive with optimized layouts for:

| Device | Grid Columns | Layout |
|--------|-------------|--------|
| Desktop (>1024px) | 4-5 columns | Full sidebar visible |
| Tablet (768-1024px) | 3-4 columns | Collapsible sidebar |
| Mobile (480-768px) | 2-3 columns | Mobile menu button |
| Small Mobile (<480px) | 2 columns | Optimized for small screens |

---

## 🎨 Theme Customization

Edit CSS variables in `style.css` to customize colors:

```css
:root {
    --bg-primary: #f0f2f5;
    --bg-secondary: #ffffff;
    --accent: #6c63ff;
    --accent-hover: #5a52d5;
    --text-primary: #1a1a2e;
    --text-secondary: #6c757d;
}

[data-theme="dark"] {
    --bg-primary: #0d0d1a;
    --bg-secondary: #1a1a2e;
    /* ... more dark theme variables */
}
```

---

## 🐛 Known Limitations

- Images are stored locally in browser localStorage (~5-10MB limit)
- No backend integration (images lost on browser cache clear)
- Limited to client-side image processing
- No user authentication or sharing features

---

## 🚀 Future Enhancements

- [ ] Backend integration for cloud storage
- [ ] User authentication and profiles
- [ ] Image sharing and collaboration
- [ ] Advanced filters and effects
- [ ] Batch operations
- [ ] Image tagging system
- [ ] Search and sort functionality
- [ ] Export gallery as album
- [ ] EXIF data reading
- [ ] Undo/Redo functionality
