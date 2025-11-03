# QR & Barcode Generator Platform

A comprehensive, professional QR code and barcode generator built with Next.js, TypeScript, and Framer Motion. Features advanced customization options, multiple QR code types, batch generation, history tracking, and much more.

## ✨ Features

### 🎨 Design & Customization
- **Color Customization** - Custom colors for QR codes and barcodes
- **Size Control** - Adjustable dimensions with sliders
- **Logo/Icon Overlay** - Add custom logo to QR codes
- **Border & Padding** - Customizable margins
- **Error Correction Level** - Choose QR code error correction (L, M, Q, H)
- **Background Color** - Customizable background colors

### 🔲 Advanced QR Code Types
- **WiFi QR Codes** - Generate WiFi connection QR codes (WPA/WPA2, WEP, No Password)
- **vCard/Contact QR Codes** - Create contact card QR codes
- **Email QR Codes** - Generate mailto QR codes with subject and body
- **SMS QR Codes** - Create SMS QR codes with phone number and message
- **Geolocation QR Codes** - Generate location QR codes (with current location support)
- **Event QR Codes** - Create calendar event QR codes
- **Text/URL QR Codes** - Standard URL or text QR codes

### 📥 Export Options
- **PNG Download** - Download as PNG images
- **JPG/JPEG Download** - Download as JPEG images
- **SVG Download** - Download QR codes as scalable vector graphics
- **PDF Download** - Download as PDF documents
- **Copy to Clipboard** - Copy generated codes directly to clipboard

### 🔧 Functionality
- **QR Code Scanner/Reader** - Scan QR codes from camera or uploaded images
- **Code Validation** - Input validation for all code types
- **Generation History** - Save and view recent codes (up to 50 items)
- **Batch Generation** - Generate multiple codes at once
- **Code Templates** - Save and load custom settings templates
- **Dark Mode** - Full dark mode support with persistence

### 🎯 User Experience
- **Beautiful Animated UI** - Modern interface with smooth animations
- **Real-time Preview** - See code changes as you adjust settings
- **Advanced Options Panel** - Collapsible panel for customization
- **Responsive Design** - Fully responsive layout for all devices
- **Professional Design** - Gradient backgrounds and modern styling

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📖 Usage Guide

### Basic Usage

1. **Select Code Type**: Choose between QR Code or Barcode
2. **Choose QR Sub-Type** (if QR Code): Select from Text, WiFi, vCard, Email, SMS, Location, or Event
3. **Enter Data**: Fill in the required information
4. **Customize** (Optional): Click "Show Advanced Options" to customize colors, sizes, and more
5. **Generate**: Click the "Generate" button
6. **Download**: Choose your preferred format (PNG, JPG, SVG, PDF) or copy to clipboard

### Advanced Features

#### History
- View your generation history
- Click on any item to reload its settings
- Delete items individually or clear all

#### Batch Generation
- Add multiple items
- Generate all codes at once
- Download all as PNG or PDF

#### Templates
- Configure your preferred settings
- Save as template for reuse
- Load templates anytime

#### Scanner
- Scan QR codes from camera
- Upload image to scan
- Copy scanned text to clipboard

#### Dark Mode
- Toggle dark/light theme
- Preference persists across sessions

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling with dark mode
- **Framer Motion** - Animations
- **QRCode** - QR code generation
- **JsBarcode** - Barcode generation
- **jsPDF** - PDF generation
- **html5-qrcode** - QR code scanning
- **Lucide React** - Icons

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles with Tailwind
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Main page component
├── components/
│   ├── QRCodeGenerator.tsx  # Main generator component
│   ├── AdvancedOptions.tsx  # Customization options
│   ├── QRTypeForm.tsx       # QR code type forms
│   ├── HistoryPanel.tsx     # History management
│   ├── QRScanner.tsx        # QR code scanner
│   ├── BatchGenerator.tsx   # Batch generation
│   └── CodeTemplates.tsx    # Template management
├── utils/
│   ├── qrcode.ts           # QR code generation utilities
│   ├── barcode.ts          # Barcode generation utilities
│   ├── download.ts         # Download utilities
│   ├── history.ts          # History management
│   └── scanner.ts          # Scanner utilities
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 📝 Features Summary

- ✅ 30+ Features Implemented
- ✅ Full TypeScript Support
- ✅ Dark Mode Support
- ✅ Responsive Design
- ✅ Local Storage for History & Templates
- ✅ Multiple Export Formats
- ✅ Advanced Customization
- ✅ Batch Processing
- ✅ QR Code Scanning

## 📄 License

MIT

## 🙏 Acknowledgments

Built with modern web technologies and best practices for a professional, feature-rich QR and Barcode generation platform.
