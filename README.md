# Nextube - Modern YouTube Clone

Nextube is a premium, high-performance YouTube-style video streaming application built with **React**, **Vite**, and **Tailwind CSS v4**. It leverages the **YouTube Data API v3** to provide a real-time video browsing and playback experience.

![Nextube Mockup](https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop)

## ✨ Features

- 🎥 **Real-time Video Streaming**: Fetch and play real videos from YouTube.
- 🔍 **Dynamic Search**: Instantly find videos with a debounced search bar and autocomplete suggestions.
- 🌍 **Language Selection**: Filter content globally by your preferred language (English, Spanish, Tamil, Hindi, etc.).
- 🌗 **Premium Dark Theme**: Sleek, modern interface inspired by the latest YouTube design.
- 📱 **Fully Responsive**: Optimized for desktop, tablet, and mobile viewing.
- 🍔 **Collapsible Sidebar**: Interactive sidebar with category filtering.
- ⚡ **Lightning Fast**: Built with Vite for near-instant load times and HMR.

## 🚀 Technologies

- **Frontend**: React.js, Tailwind CSS v4, Framer Motion (for animations)
- **Routing**: React Router DOM
- **API**: Axios, YouTube Data API v3
- **Icons**: Lucide React / React Icons
- **Date Handling**: Date-fns

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or later)
- A YouTube Data API Key from [Google Cloud Console](https://console.cloud.google.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/nextube.git
   cd nextube
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your API key:
   ```env
   VITE_YOUTUBE_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📂 Project Structure

```text
src/
 ├── components/  # Reusable UI components
 ├── context/     # React Context for global state (Sidebar, Language)
 ├── pages/       # Page-level components (Home, Video, Search)
 ├── services/    # API logic and Axios instances
 ├── utils/       # Constants and helper functions
 └── main.jsx     # App entry point
```

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

Developed with ❤️ by Antigravity
