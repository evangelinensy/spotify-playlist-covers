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
  public baseURL: string;
  public txt2imgURL: string;
  public modelsURL: string;
  public imagesURL: string;

  constructor(baseURL?: string) {
    // Use environment variable or fallback to localhost for development
    this.baseURL = baseURL || process.env.REACT_APP_API_BASE_URL || 'http://localhost';
    this.txt2imgURL = `${this.baseURL}:5001/api/txt2img`;
    this.modelsURL = `${this.baseURL}:5002/api/models`;
    this.imagesURL = `${this.baseURL}:5001/api/images`;
    
    console.log('🔧 DreamLayer API initialized with URLs:', {
      baseURL: this.baseURL,
      txt2imgURL: this.txt2imgURL,
      imagesURL: this.imagesURL,
      envVar: process.env.REACT_APP_API_BASE_URL
    });
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
      negative_prompt: request.negative_prompt || 'blurry, low quality, bad anatomy, distorted, ugly, cartoon, anime, simple gradients, basic colors, flat design, UI elements, buttons, icons, clean design, hard edges, sharp lines, geometric patterns, text, words, letters, typography, writing, captions, labels, logos, borders, frames, solid colors, flat colors, uniform colors, square composition, rectangular, vintage, film grain, old, worn, NO WORDS, NO TEXT, NO LETTERS, NO TYPOGRAPHY, NO WRITING, NO CAPTIONS, NO LABELS, NO LOGOS, NO BRANDING, NO SIGNS, NO SYMBOLS, NO MARKS, NO INSCRIPTIONS, NO ENGRAVINGS, NO EMBOSSING, NO PRINT, NO FONT, NO TYPE, NO CHARACTERS, NO ALPHABET, NO NUMBERS, NO DIGITS, NO PUNCTUATION, NO SYMBOLS, NO MARKS, NO INSCRIPTIONS, NO ENGRAVINGS, NO EMBOSSING, NO PRINT, NO FONT, NO TYPE, NO CHARACTERS, NO ALPHABET, NO NUMBERS, NO DIGITS, NO PUNCTUATION',
      model_name: request.checkpoint || 'stable-diffusion-v1-5.safetensors',
      steps: request.steps || 25,
      cfg: request.cfg || 6.5,
      width: request.width || 300,
      height: request.height || 300,
      batch_size: request.batch_size || 1,
      seed: request.seed || Math.floor(Math.random() * 1000000), // Random seed for variation
    };

    try {
      console.log('🌐 Making API call to:', this.txt2imgURL);
      console.log('📦 Payload being sent:', payload);
      
      const response = await fetch(this.txt2imgURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('📡 API Response status:', response.status);
      const data: GenerationResponse = await response.json();
      console.log('📄 API Response data:', data);
      
      return data;
    } catch (error) {
      console.error('❌ Error generating image:', error);
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
   * Generate disc cover image specifically for NewCDbackground compositing
   */
  async generateDiscCover(
    vibe: 'Main Character' | 'Healing Arc',
    mood: string,
    playlistName?: string,
    playlistData?: {
      tracks: Array<{ name: string; artists: string[]; album: string }>;
      genres: string[];
    }
  ): Promise<GenerationResponse> {
    // Vibe-specific prompts for disc generation - updated with new detailed prompts
    const prompts = {
      'Main Character': `Fluid art kaleidoscope symmetry, exemplifies acrylic pouring technique with digital mirroring, perfect vertical symmetry creating Rorschach test-like composition, organic flowing forms suggesting biological structures (neural networks, cellular tissue, coral formations), wispy paint edges flowing out from the center, at the edges have blurred low opacity subtle glow, baby blue, baby pink, baby yellow, soft pastel colors, subtle gentle tones, delicate color palette, muted soft pastels, gentle color transitions, negative space black holes creating visual interest, layered depth with translucent and opaque areas, dimensional illusion, subtle color transitions, biomimetic patterns resembling microscopic organisms, sacred geometry with mandala-like spiritual quality, abstract expressionism, cell formation with silicone additives creating characteristic cellular hole-filled texture, fluid acrylic paint mixed with pouring medium, digital mirroring for perfect bilateral symmetry, 300x300px, circular vinyl disc, centered, high detail, artstation quality, 8k resolution`,
      'Healing Arc': `vintage film camera style, 35mm film photography, film grain effect, noise texture, low light photography, moody atmosphere, desaturated, monochromatic, dramatic black volcanic sand beach, powerful crashing waves, white sea foam, towering dark sea stacks, misty atmospheric haze, overcast sky, rugged coastline, Iceland landscape, wet reflective black sand, turbulent ocean, foamy white waves receding, cool tones, soft diffused lighting, vintage photography style, film grain, grain texture, film noise, analog film look, hazy mountain ridges, atmospheric perspective, muted earth tones, rolling hills, gentle slopes, layered depth, desaturated landscape, soft morning light, warm overcast lighting, golden brown vegetation, misty mountains, layered mountain ranges, atmospheric haze, earthy tones, hazy atmosphere, vintage film camera aesthetic, soft focus, film camera bokeh, vintage film stock look, nostalgic atmosphere, low light, dim lighting, shadowy, mysterious lighting, film photography grain, analog texture, 35mm film grain, film emulsion, vintage camera aesthetic, 300x300px, circular vinyl disc, centered, high quality, artstation`
    };

    // Extract subjects from playlist data for Healing Arc
    let healingArcSubject = '';
    if (vibe === 'Healing Arc' && playlistData) {
      const subjects = this.extractSubjectsFromPlaylist(playlistData);
      if (subjects.length > 0) {
        healingArcSubject = `, featuring ${subjects.join(', ')}`;
        console.log('🎨 Healing Arc subjects extracted:', subjects);
      } else {
        healingArcSubject = ', nature scene, trees, mountains, water';
        console.log('🎨 No subjects found, using default nature scene');
      }
      
      // Update Healing Arc prompt with extracted subjects
      prompts['Healing Arc'] += healingArcSubject;
    }

    const negativePrompts = {
      'Main Character': 'hard edges, sharp lines, geometric patterns, text, words, letters, typography, writing, captions, labels, logos, borders, frames, blocks, tiles, mosaic, checkerboard, stripes, lines, sharp transitions, defined areas, sections, compartments, solid colors, flat colors, uniform colors, square composition, rectangular, vintage, film grain, old, worn, simple gradients, basic colors, low contrast, flat design, UI elements, buttons, icons, clean design, bright neon colors, light sabre looking art, vibrant electric colors, laser beam effects, futuristic glowing edges, cyberpunk aesthetics, synthetic bright colors, cell looking, human looking, human face, flesh color, skin color, organic human features, facial features, body parts, bright stark colors, harsh colors, intense colors, saturated colors, vivid colors, electric blue, neon pink, bright yellow, harsh tones, stark contrasts, bold colors, electric colors, fluorescent colors, acid colors, toxic colors, radioactive colors, synthetic colors, artificial colors, chemical colors, metallic colors, chrome colors, steel colors, iron colors, copper patina, rust colors, oxidation colors, industrial colors, urban colors, city colors, modern colors, contemporary colors, NO WORDS, NO TEXT, NO LETTERS, NO TYPOGRAPHY, NO WRITING, NO CAPTIONS, NO LABELS, NO LOGOS, NO BRANDING, NO SIGNS, NO SYMBOLS, NO MARKS, NO INSCRIPTIONS, NO ENGRAVINGS, NO EMBOSSING, NO PRINT, NO FONT, NO TYPE, NO CHARACTERS, NO ALPHABET, NO NUMBERS, NO DIGITS, NO PUNCTUATION, NO SYMBOLS, NO MARKS, NO INSCRIPTIONS, NO ENGRAVINGS, NO EMBOSSING, NO PRINT, NO FONT, NO TYPE, NO CHARACTERS, NO ALPHABET, NO NUMBERS, NO DIGITS, NO PUNCTUATION',
      'Healing Arc': 'text, words, letters, typography, writing, captions, labels, logos, bright colors, vibrant colors, neon colors, electric colors, harsh lighting, stark contrasts, bold colors, digital art, cartoon, anime, modern architecture, people, buildings, urban, city, industrial, contemporary, futuristic, cyberpunk, glowing, luminous, bright lights, sunshine, golden hour, sunset, sunrise, warm colors, hot colors, fire colors, orange, red, yellow, bright green, bright blue, bright purple, saturated colors, vivid colors, intense colors, sharp focus, crisp details, high definition, 4k, 8k, ultra sharp, perfect focus, clear, bright, sunny, cheerful, happy colors, joyful, energetic, dynamic, fast, speed, motion blur, action, movement, sports, cars, technology, digital, computer generated, artificial, fake, unreal, fantasy, sci-fi, space, alien, futuristic, modern, contemporary, clean, minimalist, simple, basic, plain, boring, dull, lifeless, dead, static, still, frozen, cold, ice, snow, winter, bright white, pure white, stark white, clean white, clinical, sterile, hospital, medical, scientific, technical, mechanical, robotic, artificial intelligence, AI, machine, computer, digital, pixelated, low resolution, blurry, out of focus, motion blur, camera shake, noise, grain, artifacts, compression, jpeg artifacts, low quality, bad quality, amateur, beginner, student, practice, test, experimental, unfinished, incomplete, broken, damaged, corrupted, error, glitch, bug, malfunction, wrong, incorrect, inappropriate, offensive, disturbing, scary, horror, dark, evil, demonic, satanic, occult, supernatural, paranormal, ghost, spirit, haunted, cursed, evil, bad, negative, destructive, harmful, dangerous, toxic, poisonous, deadly, fatal, lethal, murder, death, dying, dead, corpse, skeleton, bone, blood, gore, violence, war, battle, fight, conflict, struggle, pain, suffering, agony, torture, torment, misery, despair, depression, sadness, grief, loss, mourning, funeral, cemetery, grave, tomb, death, dying, dead, corpse, skeleton, bone, blood, gore, violence, war, battle, fight, conflict, struggle, pain, suffering, agony, torture, torment, misery, despair, depression, sadness, grief, loss, mourning, funeral, cemetery, grave, tomb, NO WORDS, NO TEXT, NO LETTERS, NO TYPOGRAPHY, NO WRITING, NO CAPTIONS, NO LABELS, NO LOGOS, NO BRANDING, NO SIGNS, NO SYMBOLS, NO MARKS, NO INSCRIPTIONS, NO ENGRAVINGS, NO EMBOSSING, NO PRINT, NO FONT, NO TYPE, NO CHARACTERS, NO ALPHABET, NO NUMBERS, NO DIGITS, NO PUNCTUATION, ABSOLUTELY NO TEXT, ABSOLUTELY NO WORDS, ABSOLUTELY NO LETTERS, ABSOLUTELY NO TYPOGRAPHY, ABSOLUTELY NO WRITING, ABSOLUTELY NO CAPTIONS, ABSOLUTELY NO LABELS, ABSOLUTELY NO LOGOS, ABSOLUTELY NO BRANDING, ABSOLUTELY NO SIGNS, ABSOLUTELY NO SYMBOLS, ABSOLUTELY NO MARKS, ABSOLUTELY NO INSCRIPTIONS, ABSOLUTELY NO ENGRAVINGS, ABSOLUTELY NO EMBOSSING, ABSOLUTELY NO PRINT, ABSOLUTELY NO FONT, ABSOLUTELY NO TYPE, ABSOLUTELY NO CHARACTERS, ABSOLUTELY NO ALPHABET, ABSOLUTELY NO NUMBERS, ABSOLUTELY NO DIGITS, ABSOLUTELY NO PUNCTUATION, high contrast, flat design, UI elements, buttons, icons, clean design, synthetic colors, artificial colors'
    };

    // Add mood-based color variations
    const moodColors = {
      calm: 'soft blues, gentle purples, muted greens, peaceful tones',
      energetic: 'electric blues, neon purples, bright highlights, vibrant energy',
      mysterious: 'deep purples, dark blues, luminous accents, mysterious atmosphere',
      warm: 'golden yellows, warm oranges, sunset colors, cozy tones',
      urban: 'cool grays, neon accents, metallic tones, city vibes',
      natural: 'earth greens, sky blues, natural browns, organic colors',
      melancholy: 'muted blues, soft grays, pastel purples, introspective mood',
      vibrant: 'rainbow spectrum, bright pinks, electric greens, high energy'
    };

    const colorPalette = moodColors[mood as keyof typeof moodColors] || 'soft pastel colors';
    
    let prompt = prompts[vibe];
    let negativePrompt = negativePrompts[vibe];
    
    // Enhance prompt with mood-specific colors and playlist inspiration
    if (playlistName) {
      prompt = `${prompt}, ${colorPalette}, inspired by "${playlistName}"`;
    } else {
      prompt = `${prompt}, ${colorPalette}`;
    }

    console.log('🎯 FINAL PROMPT being sent to API:');
    console.log('📝 Prompt:', prompt);
    console.log('🚫 Negative Prompt:', negativePrompt);
    console.log('🎨 Vibe:', vibe);
    console.log('🎭 Mood:', mood);
    console.log('📀 Playlist Name:', playlistName);
    
    // Verify the prompt contains expected keywords
    if (vibe === 'Main Character') {
      console.log('✅ Main Character prompt contains biomorphic forms:', prompt.includes('biomorphic forms'));
      console.log('✅ Main Character prompt contains abstract symmetrical:', prompt.includes('Abstract symmetrical composition'));
    } else if (vibe === 'Healing Arc') {
      console.log('✅ Healing Arc prompt contains seascape:', prompt.includes('seascape'));
      console.log('✅ Healing Arc prompt contains coastline:', prompt.includes('coastline'));
    }

    return this.generateImage({ 
      prompt,
      negative_prompt: negativePrompt,
      width: 300,
      height: 300
    });
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
      gradients: 'hard edges, sharp lines, geometric patterns, grid, squares, rectangles, structured, organized, systematic, harsh, bold, vibrant, neon, digital, pixelated, cartoon, anime, text, words, letters, typography, writing, captions, labels, logos, shapes, borders, frames, blocks, tiles, mosaic, checkerboard, stripes, lines, sharp transitions, defined areas, sections, compartments, solid colors, flat colors, uniform colors',
      abstract: 'realistic, photographic, nature, landscapes, people, objects, text, words, letters, typography, writing, captions, labels, logos',
      nature: 'abstract, geometric, digital art, cartoon, anime, modern architecture, people, text, words, letters, typography, writing, captions, labels, logos, vibrant colors, sharp edges'
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

  /**
   * Extract subjects/objects from playlist data for Healing Arc
   */
  private extractSubjectsFromPlaylist(playlistData: {
    tracks: Array<{ name: string; artists: string[]; album: string }>;
    genres: string[];
  }): string[] {
    const subjects: string[] = [];
    
    // Common subject keywords to look for in track names, artists, and albums
    const subjectKeywords = [
      // Nature
      'forest', 'tree', 'mountain', 'river', 'ocean', 'sea', 'lake', 'beach', 'sunset', 'sunrise', 'moon', 'star', 'sky', 'cloud', 'rain', 'snow', 'flower', 'garden', 'valley', 'hill', 'desert', 'canyon',
      // Urban/City
      'city', 'street', 'building', 'bridge', 'tower', 'neon', 'lights', 'night', 'downtown', 'urban', 'metro', 'subway', 'train', 'car', 'road', 'highway',
      // Objects/Things
      'book', 'paper', 'candle', 'mirror', 'window', 'door', 'chair', 'table', 'bed', 'clock', 'camera', 'phone', 'guitar', 'piano', 'violin', 'drum',
      // Abstract concepts that can be visualized
      'dream', 'memory', 'shadow', 'light', 'dark', 'silence', 'echo', 'whisper', 'breeze', 'wind', 'fire', 'ice', 'crystal', 'diamond', 'gold', 'silver'
    ];

    // Extract from track names
    playlistData.tracks.forEach(track => {
      const trackText = track.name.toLowerCase();
      subjectKeywords.forEach(keyword => {
        if (trackText.includes(keyword) && !subjects.includes(keyword)) {
          subjects.push(keyword);
        }
      });
    });

    // Extract from artist names
    playlistData.tracks.forEach(track => {
      track.artists.forEach(artist => {
        const artistText = artist.toLowerCase();
        subjectKeywords.forEach(keyword => {
          if (artistText.includes(keyword) && !subjects.includes(keyword)) {
            subjects.push(keyword);
          }
        });
      });
    });

    // Extract from album names
    playlistData.tracks.forEach(track => {
      const albumText = track.album.toLowerCase();
      subjectKeywords.forEach(keyword => {
        if (albumText.includes(keyword) && !subjects.includes(keyword)) {
          subjects.push(keyword);
        }
      });
    });

    // Extract from genres
    playlistData.genres.forEach(genre => {
      const genreText = genre.toLowerCase();
      subjectKeywords.forEach(keyword => {
        if (genreText.includes(keyword) && !subjects.includes(keyword)) {
          subjects.push(keyword);
        }
      });
    });

    // Return top 3 most relevant subjects
    return subjects.slice(0, 3);
  }
}

const dreamLayerAPI = new DreamLayerAPI();
export default dreamLayerAPI;
