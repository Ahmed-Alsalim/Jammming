# Jammming 🎵

A React-based web application that allows users to search the Spotify library, create custom playlists, and save them directly to their Spotify account.

## 🌟 Features

- **Spotify Login**: Secure authentication with your Spotify account
- **Track Search**: Search for songs, artists, and albums from Spotify's extensive library
- **Playlist Management**: Create custom playlists with your favorite tracks
- **Add/Remove Tracks**: Easy-to-use interface for building your perfect playlist
- **Save to Spotify**: Save your created playlists directly to your Spotify account

## 🚀 Technologies Used

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe code
- **Vite** - Fast build tool and dev server
- **Spotify Web API** - Music data and playlist management
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code quality and consistency

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher) installed
- **npm** or **yarn** package manager
- A **Spotify account** (free or premium)

## 🔧 Setup Instructions

### 1. Clone the Repository

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Spotify API

1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create App"
4. Fill in the app details:
   - **App Name**: Jammming (or your preferred name)
   - **App Description**: A playlist creation app
   - **Redirect URI**: `http://localhost:5173/` (or your deployment URL)
5. Save your app and note the **Client ID**

### 4. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173/
VITE_SPOTIFY_API_BASE_URL=https://api.spotify.com/v1
```

Replace `your_spotify_client_id` with the Client ID from your Spotify app.

### 5. Update Spotify App Settings

In your Spotify Developer Dashboard:
1. Go to your app settings
2. Add `http://localhost:5173/` to the Redirect URIs
3. Save the changes

## 🎮 Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`


## 🧪 Testing

### Run Tests

```bash
npm test
```

## 📁 Project Structure

```
Jammming/
├── src/
│   ├── components/
│   │   ├── App/              # Main application component
│   │   ├── SearchBar/        # Search input component
│   │   ├── SearchResults/    # Display search results
│   │   ├── Playlist/         # Playlist creation component
│   │   ├── Track/            # Individual track component
│   │   ├── Tracklist/        # List of tracks component
│   │   └── SpotifyLoginButton/ # Authentication button
│   ├── utils/
│   │   └── FetchHelper.tsx   # Spotify API helper functions
│   ├── test/                 # Test configuration
│   ├── types.d.ts            # TypeScript type definitions
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── public/                   # Static assets
├── index.html                # HTML template
├── package.json              # Dependencies and scripts
├── vite.config.ts            # Vite configuration
├── tsconfig.json             # TypeScript configuration
└── eslint.config.js          # ESLint configuration
```

## 🎯 How to Use

1. **Login**: Click the "Login with Spotify" button to authenticate
2. **Search**: Enter a song, artist, or album name in the search bar
3. **Add Tracks**: Click the "+" button on tracks you want to add to your playlist
4. **Name Playlist**: Give your playlist a custom name
5. **Save**: Click "Save to Spotify" to save your playlist to your Spotify account
6. **Remove Tracks**: Click the "-" button to remove tracks from your playlist

## 🔒 Authentication

The app uses Spotify's secure authentication system:
1. Click the login button
2. Authorize the app on Spotify's website
3. Get redirected back to the app
4. Start creating playlists!
