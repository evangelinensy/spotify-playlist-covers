// Spotify Authentication Service
// Handles OAuth flow and token management

export interface SpotifyUser {
  id: string;
  display_name: string;
  email?: string;
  country?: string;
  images?: Array<{ url: string; height: number; width: number }>;
}

export interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
}

class SpotifyAuth {
  private readonly CLIENT_ID = '9950ac751e34487dbbe027c4fd7f8e99'; // Exportify's public client ID
  private readonly REDIRECT_URI: string;
  private readonly SCOPES = [
    'playlist-read-private',
    'playlist-read-collaborative', 
    'user-library-read',
    'user-read-email'
  ].join(' ');

  constructor() {
    // Use current page as redirect URI (only when window is available)
    if (typeof window !== 'undefined') {
      this.REDIRECT_URI = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
    } else {
      // Fallback for server-side rendering
      this.REDIRECT_URI = 'http://localhost:3000/';
    }
  }

  /**
   * Check if user is already authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiry = this.getTokenExpiry();
    
    if (!token || !expiry) return false;
    
    // Check if token is expired (with 5 minute buffer)
    return Date.now() < (expiry - 300000);
  }

  /**
   * Get stored access token
   */
  getAccessToken(): string | null {
    return localStorage.getItem('spotify_access_token');
  }

  /**
   * Get token expiry time
   */
  private getTokenExpiry(): number | null {
    const expiry = localStorage.getItem('spotify_token_expiry');
    return expiry ? parseInt(expiry, 10) : null;
  }

  /**
   * Store access token and expiry
   */
  private setAccessToken(token: string, expiresIn: number): void {
    const expiry = Date.now() + (expiresIn * 1000);
    localStorage.setItem('spotify_access_token', token);
    localStorage.setItem('spotify_token_expiry', expiry.toString());
  }

  /**
   * Clear stored authentication data
   */
  logout(): void {
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_user_data');
  }

  /**
   * Start OAuth flow - redirect to Spotify
   */
  authorize(): void {
    const authUrl = new URL('https://accounts.spotify.com/authorize');
    authUrl.searchParams.set('client_id', this.CLIENT_ID);
    authUrl.searchParams.set('redirect_uri', this.REDIRECT_URI);
    authUrl.searchParams.set('scope', this.SCOPES);
    authUrl.searchParams.set('response_type', 'token');
    authUrl.searchParams.set('show_dialog', 'true');

    console.log('🎵 Redirecting to Spotify OAuth:', authUrl.toString());
    window.location.href = authUrl.toString();
  }

  /**
   * Handle OAuth callback - extract token from URL hash
   */
  handleCallback(): SpotifyTokenResponse | null {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    
    const accessToken = params.get('access_token');
    const tokenType = params.get('token_type');
    const expiresIn = params.get('expires_in');
    const scope = params.get('scope');
    const error = params.get('error');

    if (error) {
      console.error('❌ Spotify OAuth error:', error);
      return null;
    }

    if (!accessToken || !expiresIn) {
      return null;
    }

    const tokenResponse: SpotifyTokenResponse = {
      access_token: accessToken,
      token_type: tokenType || 'Bearer',
      expires_in: parseInt(expiresIn, 10),
      scope: scope || ''
    };

    // Store the token
    this.setAccessToken(accessToken, parseInt(expiresIn, 10));

    // Clear the hash from URL
    window.history.replaceState({}, document.title, window.location.pathname);

    console.log('✅ Spotify OAuth successful, token stored');
    return tokenResponse;
  }

  /**
   * Get current user info from Spotify
   */
  async getCurrentUser(): Promise<SpotifyUser | null> {
    const token = this.getAccessToken();
    if (!token) return null;

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expired, clear it
          this.logout();
          return null;
        }
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const userData = await response.json();
      
      // Cache user data
      localStorage.setItem('spotify_user_data', JSON.stringify(userData));
      
      return userData;
    } catch (error) {
      console.error('❌ Error fetching user data:', error);
      return null;
    }
  }

  /**
   * Get cached user data
   */
  getCachedUser(): SpotifyUser | null {
    const cached = localStorage.getItem('spotify_user_data');
    return cached ? JSON.parse(cached) : null;
  }

  /**
   * Make authenticated API call to Spotify
   */
  async apiCall(url: string): Promise<Response> {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 401) {
      // Token expired, clear it
      this.logout();
      throw new Error('Authentication expired. Please log in again.');
    }

    return response;
  }
}

const spotifyAuth = new SpotifyAuth();
export default spotifyAuth;
