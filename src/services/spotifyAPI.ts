// Enhanced Spotify API Service
// Handles both basic URL scraping and authenticated API calls

import spotifyAuth from './spotifyAuth';

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: Array<{
    id: string;
    name: string;
    genres?: string[];
  }>;
  album: {
    id: string;
    name: string;
    release_date: string;
    images: Array<{ url: string; height: number; width: number }>;
    genres?: string[];
  };
  duration_ms: number;
  popularity: number;
  explicit: boolean;
  preview_url?: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  public: boolean;
  collaborative: boolean;
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
    items: Array<{
      track: SpotifyTrack;
      added_at: string;
      added_by: {
        id: string;
      };
    }>;
  };
  images: Array<{ url: string; height: number; width: number }>;
}

export interface AudioFeatures {
  danceability: number;      // 0.0-1.0
  energy: number;           // 0.0-1.0
  valence: number;          // 0.0-1.0 (happiness)
  tempo: number;            // BPM
  acousticness: number;     // 0.0-1.0
  instrumentalness: number; // 0.0-1.0
  speechiness: number;      // 0.0-1.0
  loudness: number;         // dB
  liveness: number;         // 0.0-1.0
  key: number;              // 0-11
  mode: number;             // 0=minor, 1=major
  time_signature: number;   // beats per bar
}

export interface EnhancedPlaylistAnalysis {
  playlist: SpotifyPlaylist;
  audioFeatures: Map<string, AudioFeatures>;
  averageFeatures: {
    danceability: number;
    energy: number;
    valence: number;
    tempo: number;
    acousticness: number;
    instrumentalness: number;
    speechiness: number;
  };
  personality: {
    theme: string;
    description: string;
    copy: string;
  };
}

class SpotifyAPI {
  private readonly AUDIO_FEATURES_LIMIT = 100;

  /**
   * Parse Spotify URL to extract playlist ID
   */
  parsePlaylistURL(url: string): string | null {
    const patterns = [
      /spotify\.com\/playlist\/([a-zA-Z0-9]+)/,
      /spotify\.com\/user\/[^/]+\/playlist\/([a-zA-Z0-9]+)/,
      /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Basic playlist analysis from URL (no authentication required)
   * Uses web scraping to get the actual playlist title
   */
  async getBasicPlaylistAnalysis(url: string): Promise<{
    name: string;
    description: string;
    estimatedMood: string;
    basicSubjects: string[];
  }> {
    const playlistId = this.parsePlaylistURL(url);
    if (!playlistId) {
      throw new Error('Invalid Spotify playlist URL');
    }

    console.log('🔍 Basic analysis for playlist ID:', playlistId);
    
    // Try to scrape the playlist title from the public Spotify page
    let playlistName = await this.scrapePlaylistTitle(url);
    
    // If scraping fails, try to extract from URL patterns
    if (!playlistName || playlistName === 'Unknown Playlist') {
      playlistName = this.extractPlaylistNameFromUrl(url);
    }
    
    // If still no name, provide a meaningful default
    if (!playlistName || playlistName === 'Unknown Playlist') {
      playlistName = `Spotify Playlist ${playlistId.slice(0, 8)}`;
    }
    
    console.log('📝 Extracted playlist name:', playlistName);
    
    // Estimate mood based on playlist name
    const estimatedMood = this.estimateMoodFromName(playlistName);
    const basicSubjects = this.extractSubjectsFromName(playlistName);
    
    return {
      name: playlistName,
      description: 'A curated collection of tracks',
      estimatedMood,
      basicSubjects
    };
  }

  /**
   * Scrape playlist title from public Spotify page
   */
  private async scrapePlaylistTitle(url: string): Promise<string> {
    try {
      console.log('🕷️ Attempting to scrape playlist title from:', url);
      
      // Use a CORS proxy or try direct fetch
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const html = await response.text();
      console.log('📄 HTML content length:', html.length);
      
      // Extract title from various possible patterns
      const titlePatterns = [
        /<title[^>]*>([^<]+)<\/title>/i,
        /<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i,
        /<meta[^>]*name="twitter:title"[^>]*content="([^"]+)"/i,
        /<h1[^>]*class="[^"]*Title[^"]*"[^>]*>([^<]+)<\/h1>/i,
        /<span[^>]*class="[^"]*Title[^"]*"[^>]*>([^<]+)<\/span>/i
      ];
      
      for (const pattern of titlePatterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          let title = match[1].trim();
          
          // Clean up the title
          title = title.replace(/&amp;/g, '&')
                     .replace(/&lt;/g, '<')
                     .replace(/&gt;/g, '>')
                     .replace(/&quot;/g, '"')
                     .replace(/&#39;/g, "'");
          
          // Remove common Spotify suffixes
          title = title.replace(/\s*-\s*Spotify$/, '')
                      .replace(/\s*on\s*Spotify$/, '')
                      .replace(/\s*\|\s*Spotify$/, '');
          
          if (title && title.length > 0 && title.length < 100) {
            console.log('✅ Successfully scraped playlist title:', title);
            return title;
          }
        }
      }
      
      console.log('⚠️ Could not extract title from HTML');
      return 'Unknown Playlist';
      
    } catch (error) {
      console.log('❌ Error scraping playlist title:', error);
      return 'Unknown Playlist';
    }
  }

  /**
   * Try to extract playlist name from URL patterns
   */
  private extractPlaylistNameFromUrl(url: string): string {
    try {
      // Check if URL contains title information (some URLs have this)
      const titleMatch = url.match(/[?&]title=([^&]+)/);
      if (titleMatch) {
        return decodeURIComponent(titleMatch[1]).replace(/\+/g, ' ');
      }
      
      // Check for other common patterns
      const pathMatch = url.match(/\/playlist\/[^/]+\/([^/?]+)/);
      if (pathMatch) {
        return decodeURIComponent(pathMatch[1]).replace(/\+/g, ' ').replace(/-/g, ' ');
      }
      
      return 'Unknown Playlist';
    } catch (error) {
      console.log('⚠️ Could not extract playlist name from URL:', error);
      return 'Unknown Playlist';
    }
  }

  /**
   * Estimate mood from playlist name
   */
  private estimateMoodFromName(name: string): string {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('chill') || lowerName.includes('calm') || lowerName.includes('peaceful')) {
      return 'calm';
    }
    if (lowerName.includes('party') || lowerName.includes('dance') || lowerName.includes('energy')) {
      return 'energetic';
    }
    if (lowerName.includes('sad') || lowerName.includes('melancholy') || lowerName.includes('rain')) {
      return 'melancholy';
    }
    if (lowerName.includes('happy') || lowerName.includes('sunny') || lowerName.includes('summer')) {
      return 'happy';
    }
    if (lowerName.includes('love') || lowerName.includes('romantic') || lowerName.includes('heart')) {
      return 'romantic';
    }
    
    return 'mixed';
  }

  /**
   * Extract subjects from playlist name
   */
  private extractSubjectsFromName(name: string): string[] {
    const subjects: string[] = [];
    const lowerName = name.toLowerCase();
    
    // Nature subjects
    if (lowerName.includes('ocean') || lowerName.includes('sea')) subjects.push('ocean');
    if (lowerName.includes('mountain')) subjects.push('mountain');
    if (lowerName.includes('forest')) subjects.push('forest');
    if (lowerName.includes('sunset') || lowerName.includes('sunrise')) subjects.push('sunset');
    if (lowerName.includes('rain')) subjects.push('rain');
    
    // Urban subjects
    if (lowerName.includes('city')) subjects.push('city');
    if (lowerName.includes('night')) subjects.push('night');
    if (lowerName.includes('street')) subjects.push('street');
    
    // Abstract concepts
    if (lowerName.includes('dream')) subjects.push('dream');
    if (lowerName.includes('memory')) subjects.push('memory');
    if (lowerName.includes('light')) subjects.push('light');
    
    // If no specific subjects found, return generic ones
    if (subjects.length === 0) {
      subjects.push('music', 'sound', 'rhythm');
    }
    
    return subjects.slice(0, 3); // Return max 3 subjects
  }

  /**
   * Generate witty, music-obsessed microcopy based on playlist data
   */
  generateMicrocopy(playlistData: {
    name: string;
    description?: string;
    estimatedMood?: string;
    basicSubjects?: string[];
  }): string {
    const name = playlistData.name.toLowerCase();
    const mood = playlistData.estimatedMood || 'mixed';
    const subjects = playlistData.basicSubjects || [];

    // Extract potential artist/band names from playlist name
    const artistNames = this.extractPotentialArtistNames(playlistData.name);

    // Summer/Beach vibes
    if (name.includes('summer') || name.includes('beach') || name.includes('sunny') || name.includes('vacation')) {
      const responses = [
        "Your summer vibes are about to get a glow-up that even the beach would be jealous of. 🏖️",
        "This playlist screams 'main character walking on the beach' and we're here for it. 🌊",
        "Summer playlist? More like summer masterpiece incoming. ☀️",
        "Your beach playlist is about to look as good as it sounds. 🏄‍♀️"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Love/Romantic vibes
    if (name.includes('love') || name.includes('heart') || name.includes('romantic') || name.includes('soulmate') || name.includes('crush')) {
      const responses = [
        "Your love songs deserve a cover as beautiful as your feelings. 💕",
        "This playlist is about to make your crush's heart skip a beat. 💘",
        "Love songs with a side of main character energy? We stan. 💖",
        "Your romantic playlist is getting the glow-up it deserves. 🌹"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Sad/Melancholy vibes
    if (name.includes('sad') || name.includes('rain') || name.includes('lonely') || name.includes('missing') || name.includes('breakup') || mood === 'melancholy') {
      const responses = [
        "Your sad playlist is about to look as deep as your feelings. 🎭",
        "Even your melancholy vibes deserve a beautiful cover. 🌧️",
        "This playlist hits different, and so will your cover. 💔",
        "Your emotional playlist is getting the aesthetic it deserves. 🎪"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Party/Dance vibes
    if (name.includes('party') || name.includes('dance') || name.includes('club') || name.includes('night') || name.includes('rave') || mood === 'energetic') {
      const responses = [
        "Your party playlist is about to look as wild as your dance moves. 💃",
        "This playlist is about to turn your room into the hottest club in town. 🕺",
        "Your dance playlist deserves a cover that slaps as hard as the bass. 🎵",
        "Party playlist incoming with main character energy. 🎉"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Chill/Calm vibes
    if (name.includes('chill') || name.includes('calm') || name.includes('peaceful') || name.includes('zen') || name.includes('meditation') || mood === 'calm') {
      const responses = [
        "Your chill playlist is about to look as peaceful as it sounds. 🧘‍♀️",
        "This playlist is basically audio meditation with a glow-up. 🌸",
        "Your zen vibes are getting the aesthetic they deserve. 🕯️",
        "Chill playlist incoming with main character energy. 🌿"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Work/Study vibes
    if (name.includes('work') || name.includes('study') || name.includes('focus') || name.includes('productivity') || name.includes('homework')) {
      const responses = [
        "Your study playlist is about to look as focused as your brain. 📚",
        "This playlist is about to make productivity look aesthetic. 💻",
        "Your work playlist deserves a cover as good as your hustle. 💼",
        "Study vibes with main character energy incoming. 🎓"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Workout/Exercise vibes
    if (name.includes('workout') || name.includes('gym') || name.includes('run') || name.includes('exercise') || name.includes('fitness')) {
      const responses = [
        "Your workout playlist is about to look as strong as your gains. 💪",
        "This playlist is about to make your gym session look aesthetic. 🏋️‍♀️",
        "Your fitness playlist deserves a cover as intense as your workout. 🔥",
        "Gym playlist incoming with main character energy. 🏃‍♀️"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Travel vibes
    if (name.includes('travel') || name.includes('road') || name.includes('journey') || name.includes('adventure') || name.includes('trip')) {
      const responses = [
        "Your travel playlist is about to look as wanderlust as your soul. ✈️",
        "This playlist is about to make your road trip look cinematic. 🛣️",
        "Your adventure playlist deserves a cover as epic as your journey. 🗺️",
        "Travel vibes with main character energy incoming. 🌍"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Nostalgia vibes
    if (name.includes('throwback') || name.includes('old') || name.includes('retro') || name.includes('90s') || name.includes('2000s') || name.includes('nostalgia')) {
      const responses = [
        "Your throwback playlist is about to look as nostalgic as your memories. 📱",
        "This playlist is taking you back with main character energy. 🕰️",
        "Your retro vibes are getting the aesthetic they deserve. 📼",
        "Nostalgia playlist incoming with main character energy. 🌟"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Nature vibes
    if (subjects.some(s => ['ocean', 'mountain', 'forest', 'sunset', 'rain', 'nature'].includes(s))) {
      const responses = [
        "Your nature playlist is about to look as organic as your vibes. 🌿",
        "This playlist is bringing the outdoors to your aesthetic. 🌊",
        "Your natural playlist deserves a cover as beautiful as nature. 🌄",
        "Nature vibes with main character energy incoming. 🌸"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // City/Urban vibes
    if (subjects.some(s => ['city', 'night', 'street', 'urban', 'downtown'].includes(s))) {
      const responses = [
        "Your city playlist is about to look as urban as your aesthetic. 🌃",
        "This playlist is about to make your night look cinematic. 🌙",
        "Your urban playlist deserves a cover as cool as your vibe. 🏙️",
        "City vibes with main character energy incoming. 🚦"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Dream/Sleep vibes
    if (name.includes('dream') || name.includes('sleep') || name.includes('lullaby') || name.includes('bedtime') || name.includes('night')) {
      const responses = [
        "Your dream playlist is about to look as ethereal as your sleep. 😴",
        "This playlist is about to make your bedtime look aesthetic. 🌙",
        "Your sleep playlist deserves a cover as peaceful as your dreams. 🌙",
        "Dream vibes with main character energy incoming. ✨"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Artist-specific responses
    if (artistNames.length > 0) {
      const artistName = artistNames[0];
      const responses = [
        `Your ${artistName} playlist is about to look as iconic as their music. 🎤`,
        `This ${artistName} playlist is getting the main character treatment. ⭐`,
        `Your ${artistName} vibes deserve a cover as legendary as they are. 🎵`,
        `${artistName} playlist incoming with main character energy. 🔥`
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }

    // Default witty responses
    const defaultResponses = [
      "Your playlist is about to look as good as it sounds. 🎵",
      "This playlist is getting the main character treatment it deserves. ✨",
      "Your music taste is about to get a glow-up. 🎭",
      "This playlist is about to become your personality. 🎨",
      "Your playlist deserves a cover as unique as your vibe. 💫",
      "This playlist is about to look as aesthetic as your life. 🌟"
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  }

  /**
   * Extract potential artist/band names from playlist name
   */
  private extractPotentialArtistNames(playlistName: string): string[] {
    const artists: string[] = [];
    
    // Common patterns that might indicate artist names
    const patterns = [
      // "Artist - Song" or "Artist: Song"
      /^([^-:]+)[-:]/,
      // "by Artist" 
      /\bby\s+([^,\n]+)/i,
      // "Artist playlist" or "Artist vibes"
      /^([^-\s]+(?:\s+[^-\s]+)*?)\s+(?:playlist|vibes|mix|collection)/i,
      // "Artist & Other" or "Artist ft. Other"
      /^([^&\n]+?)\s*(?:&|ft\.|feat\.)/i,
      // "Artist - Album" pattern
      /^([^-]+)\s*-\s*[^-]+$/
    ];

    for (const pattern of patterns) {
      const match = playlistName.match(pattern);
      if (match && match[1]) {
        const artist = match[1].trim();
        if (artist.length > 2 && artist.length < 50 && !artists.includes(artist)) {
          artists.push(artist);
        }
      }
    }

    // If no patterns match, try to extract first word/phrase
    if (artists.length === 0) {
      const firstPart = playlistName.split(/[-:&]/)[0].trim();
      if (firstPart.length > 2 && firstPart.length < 50) {
        artists.push(firstPart);
      }
    }

    return artists.slice(0, 2); // Return max 2 artists
  }

  /**
   * Enhanced playlist analysis with authentication
   */
  async getEnhancedPlaylistAnalysis(playlistId: string): Promise<EnhancedPlaylistAnalysis> {
    if (!spotifyAuth.isAuthenticated()) {
      throw new Error('User must be authenticated for enhanced analysis');
    }

    console.log('🎵 Getting enhanced playlist analysis for:', playlistId);

    // Get playlist data
    const playlist = await this.getPlaylist(playlistId);
    
    // Get audio features for all tracks
    const audioFeatures = await this.getAudioFeatures(playlist.tracks.items.map(item => item.track));
    
    // Calculate average features
    const averageFeatures = this.calculateAverageFeatures(audioFeatures);
    
    // Determine personality based on audio features
    const personality = this.determinePersonality(averageFeatures, playlist);

    return {
      playlist,
      audioFeatures,
      averageFeatures,
      personality
    };
  }

  /**
   * Get playlist data from Spotify API
   */
  private async getPlaylist(playlistId: string): Promise<SpotifyPlaylist> {
    const response = await spotifyAuth.apiCall(`https://api.spotify.com/v1/playlists/${playlistId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch playlist: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get audio features for tracks
   */
  private async getAudioFeatures(tracks: SpotifyTrack[]): Promise<Map<string, AudioFeatures>> {
    const trackIds = tracks.map(track => track.id).filter(id => id);
    
    if (trackIds.length === 0) {
      return new Map();
    }

    const audioFeatures = new Map<string, AudioFeatures>();

    // Split into batches of 100 (Spotify limit)
    for (let i = 0; i < trackIds.length; i += this.AUDIO_FEATURES_LIMIT) {
      const batch = trackIds.slice(i, i + this.AUDIO_FEATURES_LIMIT);
      const idsParam = batch.join(',');
      
      const response = await spotifyAuth.apiCall(`https://api.spotify.com/v1/audio-features?ids=${idsParam}`);
      
      if (!response.ok) {
        console.warn(`Failed to fetch audio features for batch: ${response.status}`);
        continue;
      }

      const data = await response.json();
      
      data.audio_features.forEach((features: AudioFeatures, index: number) => {
        if (features) {
          const trackId = batch[index];
          audioFeatures.set(trackId, features);
        }
      });
    }

    return audioFeatures;
  }

  /**
   * Calculate average audio features
   */
  private calculateAverageFeatures(audioFeatures: Map<string, AudioFeatures>): any {
    const features = Array.from(audioFeatures.values());
    
    if (features.length === 0) {
      return {
        danceability: 0.5,
        energy: 0.5,
        valence: 0.5,
        tempo: 120,
        acousticness: 0.5,
        instrumentalness: 0.5,
        speechiness: 0.5
      };
    }

    const sum = features.reduce((acc, features) => ({
      danceability: acc.danceability + features.danceability,
      energy: acc.energy + features.energy,
      valence: acc.valence + features.valence,
      tempo: acc.tempo + features.tempo,
      acousticness: acc.acousticness + features.acousticness,
      instrumentalness: acc.instrumentalness + features.instrumentalness,
      speechiness: acc.speechiness + features.speechiness
    }), {
      danceability: 0,
      energy: 0,
      valence: 0,
      tempo: 0,
      acousticness: 0,
      instrumentalness: 0,
      speechiness: 0
    });

    const count = features.length;
    return {
      danceability: sum.danceability / count,
      energy: sum.energy / count,
      valence: sum.valence / count,
      tempo: sum.tempo / count,
      acousticness: sum.acousticness / count,
      instrumentalness: sum.instrumentalness / count,
      speechiness: sum.speechiness / count
    };
  }

  /**
   * Determine personality based on audio features
   */
  private determinePersonality(averageFeatures: any, playlist: SpotifyPlaylist): {
    theme: string;
    description: string;
    copy: string;
  } {
    const { danceability, energy, valence, tempo, acousticness, instrumentalness, speechiness } = averageFeatures;

    // High Danceability + High Energy
    if (danceability > 0.7 && energy > 0.7) {
      return {
        theme: 'Dance Floor Queen',
        description: 'Your playlist is pure dance energy',
        copy: "You're definitely the person who starts the dance party and doesn't stop until 3 AM. Your playlist is basically liquid energy."
      };
    }

    // High Acousticness + Low Energy
    if (acousticness > 0.7 && energy < 0.4) {
      return {
        theme: 'Organic Soul',
        description: 'Your taste is beautifully authentic',
        copy: "You appreciate the raw, unfiltered beauty of music. Very sophisticated taste. You're the person who finds beauty in simplicity."
      };
    }

    // High Valence (happiness) + High Tempo
    if (valence > 0.7 && tempo > 130) {
      return {
        theme: 'Sunshine Person',
        description: 'You radiate pure joy energy',
        copy: "Your playlist is basically liquid happiness. You're the human equivalent of a golden retriever on a sunny day."
      };
    }

    // Low Valence (sadness) + High Instrumentalness
    if (valence < 0.3 && instrumentalness > 0.5) {
      return {
        theme: 'Melancholy Master',
        description: 'Your sadness is art',
        copy: "You turn sadness into poetry. Your playlist is a work of art that makes people feel things they didn't know they could feel."
      };
    }

    // High Speechiness (rap/hip-hop)
    if (speechiness > 0.4) {
      return {
        theme: 'Word Wizard',
        description: 'You speak in fire verses',
        copy: "You appreciate lyrics that hit different. Your playlist has bars that could start a revolution. You're basically a lyrical genius."
      };
    }

    // High Tempo + High Energy
    if (tempo > 140 && energy > 0.7) {
      return {
        theme: 'Speed Demon',
        description: 'You move at the speed of light',
        copy: "Your playlist is basically adrenaline in audio form. You probably drink coffee for fun and run marathons for relaxation."
      };
    }

    // Default fallback
    return {
      theme: 'Musical Explorer',
      description: 'Your taste is beautifully eclectic',
      copy: "You don't fit into any box and that's exactly why we love you. Your playlist is a beautiful chaos of musical exploration."
    };
  }
}

const spotifyAPI = new SpotifyAPI();
export default spotifyAPI;
