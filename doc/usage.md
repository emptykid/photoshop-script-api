# Usage Examples

This document provides examples for common tasks using the Photoshop Script API.

## Document Operations

### Creating a New Document

```typescript
import { Document } from 'photoshop-script-api';

// Create a new document: Name, Width, Height, Resolution, Artboard(bool), Background(bool)
const newDoc = Document.create("My New Doc", 1920, 1080, 72, false, true);
```

### Opening and Saving

```typescript
import { Application, Document, DocumentFormat } from 'photoshop-script-api';

const app = new Application();
app.open("/path/to/image.jpg");

const doc = Document.activeDocument();
if (doc) {
    // Save as PSD
    doc.saveAs("/path/to/save/image.psd", DocumentFormat.PSD, true);
    
    // Save as JPEG
    doc.saveAs("/path/to/save/image.jpg", DocumentFormat.JPG, true);
    
    // Close without saving changes
    doc.close(false);
}
```

### Resizing

```typescript
import { Document, Size } from 'photoshop-script-api';

const doc = Document.activeDocument();
if (doc) {
    // Resize image to 800x600 px
    doc.resizeImage(new Size(800, 600));
    
    // Resize canvas
    doc.resizeCanvas(new Size(1000, 1000));
}
```

## Layer Operations

### Finding and Selecting Layers

```typescript
import { Layer } from 'photoshop-script-api';

// Get all selected layers
const selectedLayers = Layer.getSelectedLayers();
selectedLayers.forEach(layer => {
    console.log(`Selected Layer ID: ${layer.id}, Name: ${layer.name()}`);
});

// Find a layer by name
const specificLayer = Layer.getLayerByName("Logo");
if (specificLayer) {
    specificLayer.select();
}
```

### Manipulating Layers

```typescript
import { Layer } from 'photoshop-script-api';

const layer = Layer.getSelectedLayer();

if (layer) {
    // Hide/Show
    layer.hide();
    layer.show();
    
    // Lock/Unlock
    layer.lock();
    layer.unlock();
    
    // Get Bounds
    const bounds = layer.bounds();
    console.log(`Bounds: x=${bounds.x}, y=${bounds.y}, w=${bounds.width}, h=${bounds.height}`);
    
    // Check if it's a text layer
    if (layer.isTextLayer()) {
        const textObj = layer.text();
        if (textObj) {
            console.log(`Text Content: ${textObj.content()}`);
        }
    }
}
```

### looping through layers

```typescript
import { Layer } from 'photoshop-script-api';

// Create a group from selected layers
Layer.groupSelectedLayers();

// Loop through all layers in the document
// direction 0: down->up (background to top), 1: up->down (top to background)
Layer.loopLayers((layer: Layer) => {
    console.log(`Processing layer: ${layer.name()}`);
    if (!layer.visible()) {
        layer.show();
    }
}, 1);
```

## Exporting

### Export to Web (PNG/JPG)

```typescript
import { Document, ExportOptionsSaveForWeb } from 'photoshop-script-api'; // specific types might need checking in source

const doc = Document.activeDocument();
if (doc) {
    // Note: You might need to construct ExportOptionsSaveForWeb object using standard PS scripting 
    // or helper if provided by the library.
    // The library wrapper accepts the standard ExportOptionsSaveForWeb object.
    
    const options = new ExportOptionsSaveForWeb();
    options.format = SaveDocumentType.PNG;
    options.PNG8 = false;
    options.transparency = true;
    
    doc.exportToWeb("/output/path", "exported_image.png", options);
}
```

## Tips

- Most methods return `this` (the object instance) to allow method chaining.
- The library uses `UnitValue` internally for some calculations but exposes simple numbers (pixels) in most arguments.
- Wrap your code in `try...catch` blocks as Photoshop operations can fail (e.g., if no document is open).
