// ===== STATE MANAGEMENT =====
class GalleryApp {
    constructor() {
        this.images = this.loadFromStorage();
        this.currentFilter = 'all';
        this.currentView = 'grid';
        this.currentLightboxIndex = 0;
        this.currentEditImage = null;
        this.editorFilters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            filter: 'none'
        };
        
        this.init();
    }

    // ===== STORAGE =====
    loadFromStorage() {
        try {
            const data = localStorage.getItem('galleryImages');
            return data ? JSON.parse(data) : [];
        } catch {
            return [];
        }
    }

    saveToStorage() {
        localStorage.setItem('galleryImages', JSON.stringify(this.images));
    }

    // ===== INIT =====
    init() {
        this.cacheDom();
        this.bindEvents();
        this.render();
        this.updateCounts();
    }

    cacheDom() {
        this.dom = {
            grid: document.getElementById('galleryGrid'),
            emptyState: document.getElementById('emptyState'),
            dropZone: document.getElementById('dropZone'),
            fileInput: document.getElementById('fileInput'),
            uploadBtn: document.getElementById('uploadBtn'),
            sidebar: document.getElementById('sidebar'),
            menuBtn: document.getElementById('menuBtn'),
            toggleSidebar: document.getElementById('toggleSidebar'),
            themeBtn: document.getElementById('themeBtn'),
            viewBtn: document.getElementById('viewBtn'),
            sectionTitle: document.getElementById('sectionTitle'),
            
            // Lightbox
            lightbox: document.getElementById('lightbox'),
            lightboxImg: document.getElementById('lightboxImg'),
            lightboxTitle: document.getElementById('lightboxTitle'),
            lightboxCategory: document.getElementById('lightboxCategory'),
            lbDate: document.getElementById('lbDate'),
            lbSize: document.getElementById('lbSize'),
            lbDimensions: document.getElementById('lbDimensions'),
            prevLb: document.getElementById('prevLb'),
            nextLb: document.getElementById('nextLb'),
            closeLb: document.getElementById('closeLb'),
            editBtn: document.getElementById('editBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            deleteBtn: document.getElementById('deleteBtn'),
            
            // Editor
            editorModal: document.getElementById('editorModal'),
            closeEditor: document.getElementById('closeEditor'),
            editorCanvas: document.getElementById('editorCanvas'),
            brightness: document.getElementById('brightness'),
            contrast: document.getElementById('contrast'),
            saturation: document.getElementById('saturation'),
            blur: document.getElementById('blur'),
            brightnessVal: document.getElementById('brightnessVal'),
            contrastVal: document.getElementById('contrastVal'),
            saturationVal: document.getElementById('saturationVal'),
            blurVal: document.getElementById('blurVal'),
            resetEditor: document.getElementById('resetEditor'),
            saveEditor: document.getElementById('saveEditor'),
            
            // Navigation items
            navItems: document.querySelectorAll('.nav-item'),
        };
    }

    // ===== EVENTS =====
    bindEvents() {
        // Upload
        this.dom.uploadBtn.addEventListener('click', () => this.dom.fileInput.click());
        this.dom.fileInput.addEventListener('change', (e) => this.handleUpload(e));
        this.dom.dropZone.addEventListener('dragover', (e) => e.preventDefault());
        this.dom.dropZone.addEventListener('dragenter', () => this.dom.dropZone.classList.add('dragover'));
        this.dom.dropZone.addEventListener('dragleave', () => this.dom.dropZone.classList.remove('dragover'));
        this.dom.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dom.dropZone.classList.remove('dragover');
            this.handleUpload({ target: { files: e.dataTransfer.files } });
        });
        this.dom.dropZone.addEventListener('click', () => this.dom.fileInput.click());

        // Navigation
        this.dom.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.dom.navItems.forEach(i => i.classList.remove('active'));
                item.classList.add('active');
                this.currentFilter = item.dataset.section;
                this.dom.sectionTitle.textContent = item.textContent.trim();
                this.render();
            });
        });

        // Sidebar
        this.dom.menuBtn.addEventListener('click', () => {
            this.dom.sidebar.classList.toggle('open');
        });
        this.dom.toggleSidebar.addEventListener('click', () => {
            this.dom.sidebar.classList.toggle('collapsed');
        });

        // Theme
        this.dom.themeBtn.addEventListener('click', () => {
            const dark = document.documentElement.getAttribute('data-theme') === 'dark';
            document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
            this.dom.themeBtn.innerHTML = dark ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        });

        // View
        this.dom.viewBtn.addEventListener('click', () => {
            this.currentView = this.currentView === 'grid' ? 'list' : 'grid';
            this.dom.viewBtn.innerHTML = this.currentView === 'grid' ? 
                '<i class="fas fa-th-large"></i>' : '<i class="fas fa-list"></i>';
            this.render();
        });

        // Lightbox
        this.dom.prevLb.addEventListener('click', () => this.navigateLightbox(-1));
        this.dom.nextLb.addEventListener('click', () => this.navigateLightbox(1));
        this.dom.closeLb.addEventListener('click', () => this.closeLightbox());
        this.dom.lightbox.addEventListener('click', (e) => {
            if (e.target === this.dom.lightbox) this.closeLightbox();
        });
        this.dom.deleteBtn.addEventListener('click', () => this.deleteCurrentImage());
        this.dom.downloadBtn.addEventListener('click', () => this.downloadCurrentImage());
        this.dom.editBtn.addEventListener('click', () => this.openEditor());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.dom.lightbox.classList.contains('active')) {
                if (e.key === 'Escape') this.closeLightbox();
                if (e.key === 'ArrowLeft') this.navigateLightbox(-1);
                if (e.key === 'ArrowRight') this.navigateLightbox(1);
            }
            if (this.dom.editorModal.classList.contains('active')) {
                if (e.key === 'Escape') this.closeEditor();
            }
        });

        // Editor
        this.dom.closeEditor.addEventListener('click', () => this.closeEditor());
        this.dom.editorModal.addEventListener('click', (e) => {
            if (e.target === this.dom.editorModal) this.closeEditor();
        });

        // Editor controls
        this.dom.brightness.addEventListener('input', (e) => {
            this.editorFilters.brightness = e.target.value;
            this.dom.brightnessVal.textContent = e.target.value + '%';
            this.applyEditorFilters();
        });
        this.dom.contrast.addEventListener('input', (e) => {
            this.editorFilters.contrast = e.target.value;
            this.dom.contrastVal.textContent = e.target.value + '%';
            this.applyEditorFilters();
        });
        this.dom.saturation.addEventListener('input', (e) => {
            this.editorFilters.saturation = e.target.value;
            this.dom.saturationVal.textContent = e.target.value + '%';
            this.applyEditorFilters();
        });
        this.dom.blur.addEventListener('input', (e) => {
            this.editorFilters.blur = e.target.value;
            this.dom.blurVal.textContent = e.target.value + 'px';
            this.applyEditorFilters();
        });

        // Editor actions
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => this.handleEditAction(btn.dataset.action));
        });

        document.querySelectorAll('.filter-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-preset').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.editorFilters.filter = btn.dataset.filter;
                this.applyEditorFilters();
            });
        });

        this.dom.resetEditor.addEventListener('click', () => this.resetEditorFilters());
        this.dom.saveEditor.addEventListener('click', () => this.saveEditedImage());
    }

    // ===== UPLOAD =====
    handleUpload(e) {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        files.forEach(file => {
            if (!file.type.startsWith('image/')) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const category = this.promptCategory(file.name);
                    this.images.push({
                        id: Date.now() + Math.random(),
                        name: file.name,
                        data: event.target.result,
                        category: category || 'uncategorized',
                        uploadedAt: new Date().toISOString(),
                        size: file.size,
                        width: img.width,
                        height: img.height
                    });
                    this.saveToStorage();
                    this.render();
                    this.updateCounts();
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });

        this.dom.fileInput.value = '';
    }

    promptCategory(filename) {
        const categories = ['Nature', 'People', 'Architecture', 'Art', 'Uncategorized'];
        const choice = prompt(
            `Select category for "${filename}":\n\n` +
            categories.map((c, i) => `${i+1}. ${c}`).join('\n') +
            '\n\nEnter number (1-5) or press Cancel for Uncategorized:'
        );
        if (choice) {
            const idx = parseInt(choice) - 1;
            if (idx >= 0 && idx < categories.length) {
                return categories[idx].toLowerCase();
            }
        }
        return 'uncategorized';
    }

    // ===== RENDER =====
    render() {
        const filtered = this.getFilteredImages();
        const grid = this.dom.grid;
        const empty = this.dom.emptyState;

        if (!filtered.length) {
            grid.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';

        grid.style.display = this.currentView === 'grid' ? 'grid' : 'flex';
        grid.style.flexDirection = this.currentView === 'list' ? 'column' : '';
        grid.style.gap = this.currentView === 'list' ? '10px' : '';

        grid.innerHTML = filtered.map((img, index) => `
            <div class="gallery-item" data-id="${img.id}" style="${this.currentView === 'list' ? 'display:flex;align-items:center;padding:10px;aspect-ratio:auto;' : ''}">
                <img src="${img.data}" alt="${img.name}" style="${this.currentView === 'list' ? 'width:80px;height:80px;object-fit:cover;border-radius:8px;' : ''}" />
                <div class="item-overlay">
                    <h4>${this.truncateName(img.name)}</h4>
                    <p>${img.category} • ${this.formatDate(img.uploadedAt)}</p>
                </div>
                <span class="category-badge">${img.category}</span>
            </div>
        `).join('');

        // Add click listeners
        grid.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                const filteredImgs = this.getFilteredImages();
                const img = filteredImgs[index];
                const globalIndex = this.images.findIndex(i => i.id === img.id);
                this.openLightbox(globalIndex);
            });
        });
    }

    getFilteredImages() {
        if (this.currentFilter === 'all') return this.images;
        return this.images.filter(img => img.category === this.currentFilter);
    }

    truncateName(name) {
        return name.length > 20 ? name.substring(0, 18) + '...' : name;
    }

    formatDate(dateStr) {
        return new Date(dateStr).toLocaleDateString('en-US', { 
            month: 'short', day: 'numeric', year: 'numeric' 
        });
    }

    // ===== COUNTS =====
    updateCounts() {
        const categories = ['all', 'nature', 'people', 'architecture', 'art', 'uncategorized'];
        categories.forEach(cat => {
            const count = cat === 'all' ? this.images.length :
                this.images.filter(img => img.category === cat).length;
            const el = document.getElementById(`${cat}Count`);
            if (el) el.textContent = count;
        });
    }

    // ===== LIGHTBOX =====
    openLightbox(index) {
        this.currentLightboxIndex = index;
        this.updateLightbox();
        this.dom.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeLightbox() {
        this.dom.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    updateLightbox() {
        const img = this.images[this.currentLightboxIndex];
        if (!img) return;
        
        this.dom.lightboxImg.src = img.data;
        this.dom.lightboxTitle.textContent = img.name;
        this.dom.lightboxCategory.textContent = img.category;
        this.dom.lbDate.textContent = `📅 ${this.formatDate(img.uploadedAt)}`;
        this.dom.lbSize.textContent = `📦 ${this.formatSize(img.size)}`;
        this.dom.lbDimensions.textContent = `📐 ${img.width} × ${img.height}`;
    }

    navigateLightbox(direction) {
        const filtered = this.getFilteredImages();
        const currentFilteredIndex = filtered.findIndex(img => img.id === this.images[this.currentLightboxIndex].id);
        const newFilteredIndex = (currentFilteredIndex + direction + filtered.length) % filtered.length;
        const newImg = filtered[newFilteredIndex];
        this.currentLightboxIndex = this.images.findIndex(img => img.id === newImg.id);
        this.updateLightbox();
    }

    deleteCurrentImage() {
        if (!confirm('Delete this image?')) return;
        this.images.splice(this.currentLightboxIndex, 1);
        this.saveToStorage();
        this.closeLightbox();
        this.render();
        this.updateCounts();
    }

    downloadCurrentImage() {
        const img = this.images[this.currentLightboxIndex];
        const link = document.createElement('a');
        link.href = img.data;
        link.download = img.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    formatSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / 1048576).toFixed(1) + ' MB';
    }

    // ===== EDITOR =====
    openEditor() {
        const img = this.images[this.currentLightboxIndex];
        if (!img) return;
        
        this.currentEditImage = img;
        const canvas = this.dom.editorCanvas;
        const ctx = canvas.getContext('2d');
        
        const tempImg = new Image();
        tempImg.onload = () => {
            canvas.width = tempImg.width;
            canvas.height = tempImg.height;
            ctx.drawImage(tempImg, 0, 0);
            this.editorOriginalData = canvas.toDataURL();
            this.dom.editorModal.classList.add('active');
            this.resetEditorFilters();
        };
        tempImg.src = img.data;
    }

    closeEditor() {
        this.dom.editorModal.classList.remove('active');
        this.currentEditImage = null;
    }

    applyEditorFilters() {
        const canvas = this.dom.editorCanvas;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            
            const filters = this.editorFilters;
            const filterString = `
                brightness(${filters.brightness}%) 
                contrast(${filters.contrast}%) 
                saturate(${filters.saturation}%) 
                blur(${filters.blur}px) 
                ${filters.filter}
            `.trim().replace(/\s+/g, ' ');
            
            ctx.filter = filterString;
            ctx.drawImage(img, 0, 0);
            ctx.filter = 'none';
        };
        img.src = this.editorOriginalData || this.currentEditImage?.data;
    }

    handleEditAction(action) {
        const canvas = this.dom.editorCanvas;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        switch(action) {
            case 'rotate-left':
                this.rotateCanvas(-90);
                break;
            case 'rotate-right':
                this.rotateCanvas(90);
                break;
            case 'flip-horizontal':
                this.flipCanvas('horizontal');
                break;
            case 'flip-vertical':
                this.flipCanvas('vertical');
                break;
        }
    }

    rotateCanvas(degrees) {
        const canvas = this.dom.editorCanvas;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = canvas.toDataURL();
        
        img.onload = () => {
            const radians = degrees * Math.PI / 180;
            const newWidth = Math.abs(Math.cos(radians)) * img.width + Math.abs(Math.sin(radians)) * img.height;
            const newHeight = Math.abs(Math.sin(radians)) * img.width + Math.abs(Math.cos(radians)) * img.height;
            
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.translate(newWidth/2, newHeight/2);
            ctx.rotate(radians);
            ctx.drawImage(img, -img.width/2, -img.height/2);
            ctx.resetTransform();
            
            this.editorOriginalData = canvas.toDataURL();
        };
    }

    flipCanvas(direction) {
        const canvas = this.dom.editorCanvas;
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = canvas.toDataURL();
        
        img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.translate(direction === 'horizontal' ? canvas.width : 0, 
                         direction === 'vertical' ? canvas.height : 0);
            ctx.scale(direction === 'horizontal' ? -1 : 1,
                     direction === 'vertical' ? -1 : 1);
            ctx.drawImage(img, 0, 0);
            ctx.resetTransform();
            this.editorOriginalData = canvas.toDataURL();
        };
    }

    resetEditorFilters() {
        this.editorFilters = {
            brightness: 100,
            contrast: 100,
            saturation: 100,
            blur: 0,
            filter: 'none'
        };
        
        this.dom.brightness.value = 100;
        this.dom.contrast.value = 100;
        this.dom.saturation.value = 100;
        this.dom.blur.value = 0;
        this.dom.brightnessVal.textContent = '100%';
        this.dom.contrastVal.textContent = '100%';
        this.dom.saturationVal.textContent = '100%';
        this.dom.blurVal.textContent = '0px';
        
        document.querySelectorAll('.filter-preset').forEach(b => b.classList.remove('active'));
        document.querySelector('[data-filter="none"]')?.classList.add('active');
        
        this.applyEditorFilters();
    }

    saveEditedImage() {
        if (!this.currentEditImage) return;
        
        const canvas = this.dom.editorCanvas;
        const newData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Update the image data
        this.currentEditImage.data = newData;
        this.saveToStorage();
        this.closeEditor();
        this.render();
        
        // Update lightbox if open
        if (this.dom.lightbox.classList.contains('active')) {
            this.updateLightbox();
        }
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const app = new GalleryApp();
    window.app = app; // For debugging
});
