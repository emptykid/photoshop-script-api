# Photoshop Script API Documentation

This library provides a modern, TypeScript-friendly wrapper around Adobe Photoshop's ExtendScript API (ActionDescriptor/ActionReference). It simplifies common tasks like document management, layer manipulation, and file exporting.

## Table of Contents

- [Introduction](#introduction)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)

## Introduction

Photoshop scripting often involves verbose `ActionDescriptor` code. This library encapsulates these into object-oriented classes such as `Application`, `Document`, `Layer`, `Text`, etc., making your scripts cleaner and easier to maintain.

## Installation

Assuming you are using a build tool like Webpack or Rollup to bundle your ExtendScript:

```bash
npm install photoshop-script-api
```

Or just copy the `src` folder into your project if you are not using a package manager.

## Usage Guide

To use the library, import the necessary classes.

```typescript
import { Application, Document, Layer } from 'photoshop-script-api';

// Get the current application instance
const appInstance = new Application();
console.log(`Photoshop Version: ${appInstance.version()}`);

// Work with the active document
const doc = Document.activeDocument();
if (doc) {
    console.log(`Active Document: ${doc.name()}`);
    
    // Resize image
    // doc.resizeImage(new Size(800, 600));
}
```

For more detailed examples, see [Usage Examples](usage.md).

## API Reference

### Application

The `Application` class provides methods to interact with the Photoshop application itself.

- `version()`: Get Photoshop version.
- `open(path: string)`: Open a file.
- `getApplicationPath()`: Get the install path.

### Document

The `Document` class represents a Photoshop document (PSD, JPG, etc.).

- `Document.activeDocument()`: Get the currently active document.
- `Document.create(name, width, height, ...)`: Create a new document.
- `saveAs(path, format, ...)`: Save the document.
- `resizeImage(size)`, `resizeCanvas(size)`: Resize operations.
- `exportToWeb(...)`, `exportToPdf(...)`: Exporting.

### Layer

The `Layer` class represents a layer or group in the document.

- `Layer.getSelectedLayers()`: Get currently selected layers.
- `Layer.getLayerByName(name)`: Find a layer by name.
- `visible()`, `show()`, `hide()`: Visibility control.
- `bounds()`: Get layer bounds.
- `text()`: Get text object if it's a text layer.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
