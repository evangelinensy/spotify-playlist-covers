// DreamLayer API Service
// Communicates with your local DreamLayer AI backend

export interface GenerationRequest {
  prompt: string;
  negative_prompt?: string;
  checkpoint?: string;
  steps?: number;
  cfg?: number;
  width?: number;
  height?: number;
  batch_size?: number;
  seed?: number;
}

export interface GeneratedImage {
  filename: string;
  url?: string;
}

export interface GenerationResponse {
  status: string;
  message?: string;
  generated_images?: GeneratedImage[];
  error?: string;
}

export interface Model {
  filename: string;
  id: string;
  name: string;
}

export interface ModelsResponse {
  status: string;
  models: Model[];
}

class DreamLayerAPI {
  private baseURL: string;
  private txt2imgURL: string;
  private modelsURL: string;
  private imagesURL: string;

  constructor(baseURL?: string) {
    // Use environment variable or fallback to localhost for development
    this.baseURL = baseURL || process.env.REACT_APP_API_BASE_URL || 'http://localhost';
    this.txt2imgURL = `${this.baseURL}:5001/api/txt2img`;
    this.modelsURL = `${this.baseURL}:5002/api/models`;
    this.imagesURL = `${this.baseURL}:5001/api/images`;
  }

  /**
   * Check if we're in demo mode (production without API)
   */
  private isDemoMode(): boolean {
    return !this.baseURL.includes('localhost') && !this.baseURL.includes('127.0.0.1');
  }

  /**
   * Get available models from DreamLayer
   */
  async getModels(): Promise<Model[]> {
    try {
      const response = await fetch(this.modelsURL);
      const data: ModelsResponse = await response.json();
      
      if (data.status === 'success') {
        return data.models;
      } else {
        throw new Error('Failed to fetch models');
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }

  /**
   * Generate image from text prompt
   */
  async generateImage(request: GenerationRequest): Promise<GenerationResponse> {
    const payload = {
      prompt: request.prompt,
      negative_prompt: request.negative_prompt || 'blurry, low quality, bad anatomy, distorted, ugly, cartoon, anime, digital art, vibrant colors, sharp edges, harsh contrast, modern, synthetic',
      model_name: request.checkpoint || 'stable-diffusion-v1-5.safetensors',
      steps: request.steps || 25,
      cfg: request.cfg || 6.5,
      width: request.width || 300,
      height: request.height || 300,
      batch_size: request.batch_size || 1,
      seed: request.seed || Math.floor(Math.random() * 1000000), // Random seed for variation
    };

    try {
      const response = await fetch(this.txt2imgURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data: GenerationResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }

  /**
   * Get full URL for a generated image
   */
  getImageURL(filename: string): string {
    return `${this.imagesURL}/${filename}`;
  }

  /**
   * Download image as blob
   */
  async downloadImage(filename: string): Promise<Blob> {
    try {
      const response = await fetch(this.getImageURL(filename));
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`);
      }
      return await response.blob();
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  /**
   * Generate Spotify playlist cover with specific parameters
   */
  async   generatePlaylistCover(
    style: 'gradients' | 'abstract' | 'nature',
    mood: string,
    playlistName?: string
  ): Promise<GenerationResponse> {
    // Add color variations based on mood
    const moodColors = {
      calm: 'soft blues, gentle purples, muted greens',
      energetic: 'vibrant oranges, bright yellows, electric blues',
      mysterious: 'deep purples, dark blues, midnight tones',
      warm: 'golden yellows, warm oranges, sunset colors',
      urban: 'cool grays, neon accents, metallic tones',
      natural: 'earth greens, sky blues, natural browns',
      melancholy: 'muted blues, soft grays, pastel purples',
      vibrant: 'rainbow spectrum, bright pinks, electric greens'
    };

    const colorPalette = moodColors[mood as keyof typeof moodColors] || 'soft pastel colors';

    const prompts = {
      gradients: `gradient background, smooth color transition, ${colorPalette}, flowing blend, ethereal, dreamy, gentle, seamless, continuous, organic, natural flow, watercolor effect, soft edges, muted tones, atmospheric, ${mood} mood, 300x300px, square, high quality, artistic`,
      abstract: `abstract geometric shapes, ${mood} mood, ${colorPalette}, modern art, 300x300px, square`,
      nature: `vintage film camera effect, scenic landscape, ${mood} mood, dense forest with towering trees, sun dappled leaves, winding river, mountain vista, golden hour lighting, film grain, sepia tones, faded colors, old photograph aesthetic, analog film, 300x300px, square, high quality, realistic`
    };

    const negativePrompts = {
      gradients: 'hard edges, sharp lines, geometric patterns, grid, squares, rectangles, structured, organized, systematic, harsh, bold, vibrant, neon, digital, pixelated, cartoon, anime, text, logos, shapes, borders, frames, blocks, tiles, mosaic, checkerboard, stripes, lines, sharp transitions, defined areas, sections, compartments, solid colors, flat colors, uniform colors',
      abstract: 'realistic, photographic, nature, landscapes, people, objects, text, logos',
      nature: 'abstract, geometric, digital art, cartoon, anime, modern architecture, people, text, logos, vibrant colors, sharp edges'
    };

    const prompt = prompts[style];
    const negativePrompt = negativePrompts[style];
    
    if (playlistName) {
      // Add playlist name influence to prompt
      const enhancedPrompt = `${prompt}, inspired by "${playlistName}"`;
      return this.generateImage({ 
        prompt: enhancedPrompt,
        negative_prompt: negativePrompt
      });
    }

    return this.generateImage({ 
      prompt,
      negative_prompt: negativePrompt
    });
  }
}

const dreamLayerAPI = new DreamLayerAPI();
export default dreamLayerAPI;
