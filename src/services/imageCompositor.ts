// Image Compositor Service
// Handles overlaying generated images onto the disc base

export interface CompositorOptions {
  discBaseImage?: HTMLImageElement;
  generatedImage?: HTMLImageElement;
  outputSize?: number;
}

class ImageCompositor {
  private defaultDiscBase: string = '/disc-bg-new.png'; // Disc base image in public folder
  private defaultOutputSize: number = 300;

  /**
   * Load image from URL or file
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  /**
   * Create canvas and get context
   */
  private createCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    return { canvas, ctx };
  }

  /**
   * Draw circular mask on canvas
   */
  private drawCircularMask(
    ctx: CanvasRenderingContext2D, 
    image: HTMLImageElement, 
    size: number, 
    centerX: number, 
    centerY: number, 
    radius: number
  ): void {
    // Save context state
    ctx.save();
    
    // Create circular clipping path
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.clip();
    
    // Draw the image
    ctx.drawImage(image, 0, 0, size, size);
    
    // Restore context state
    ctx.restore();
  }

  /**
   * Composite generated image onto disc base
   */
  async compositeDiscCover(
    generatedImageUrl: string,
    options: CompositorOptions = {}
  ): Promise<string> {
    const outputSize = options.outputSize || this.defaultOutputSize;
    const { canvas, ctx } = this.createCanvas(outputSize);

    try {
      // Load the generated image
      const generatedImage = await this.loadImage(generatedImageUrl);
      
      // Load disc base image (fallback to solid disc if not available)
      let discBaseImage: HTMLImageElement;
      
      try {
        console.log('🔄 Attempting to load disc base from:', this.defaultDiscBase);
        discBaseImage = await this.loadImage(this.defaultDiscBase);
        console.log('✅ Disc base image loaded successfully, dimensions:', discBaseImage.width, 'x', discBaseImage.height);
      } catch (error) {
        console.warn('❌ Disc base image not found, creating solid disc:', error);
        discBaseImage = this.createSolidDisc(outputSize);
      }

      // Draw disc base as the background layer (this should be visible around the edges)
      console.log('🔄 Drawing disc base as background layer');
      ctx.drawImage(discBaseImage, 0, 0, outputSize, outputSize);
      console.log('✅ Disc base drawn as background');

      // Calculate disc area (excluding center hole) for the generated image
      const centerX = (outputSize / 2) - 6; // Move 6px to the left (10px left - 4px right = 6px left from center)
      const centerY = outputSize / 2;
      const outerRadius = (outputSize * 0.42); // 84% of half size (larger to fill more of the disc)
      const innerRadius = (outputSize * 0.08); // 16% of half size (center hole)

      // Create circular mask for the generated image to sit on top of the disc
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI, true); // Inner hole (counter-clockwise)
      ctx.clip();

      // Draw the generated image ON TOP of the disc base
      ctx.drawImage(generatedImage, 0, 0, outputSize, outputSize);

      ctx.restore();

      // Add a subtle border to make the disc more visible
      ctx.strokeStyle = '#666666';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
      ctx.stroke();

      // Return the composite image as data URL
      return canvas.toDataURL('image/png');

    } catch (error) {
      console.error('Error compositing disc cover:', error);
      throw error;
    }
  }

  /**
   * Create a solid disc as fallback when disc base image is not available
   */
  private createSolidDisc(size: number): HTMLImageElement {
    const { canvas, ctx } = this.createCanvas(size);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size * 0.4;
    const innerRadius = size * 0.08;

    // Draw disc background (light gray)
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, size, size);

    // Draw disc (darker gray)
    ctx.fillStyle = '#888888';
    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw center hole (white)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
    ctx.fill();

    // Add some disc texture
    ctx.fillStyle = '#666666';
    for (let i = 0; i < 20; i++) {
      const angle = (i / 20) * 2 * Math.PI;
      const x = centerX + Math.cos(angle) * (outerRadius * 0.7);
      const y = centerY + Math.sin(angle) * (outerRadius * 0.7);
      ctx.fillRect(x, y, 1, 1);
    }

    // Convert canvas to image
    const img = new Image();
    img.src = canvas.toDataURL('image/png');
    return img;
  }

  /**
   * Download the composite image
   */
  downloadImage(dataUrl: string, filename: string = 'playlist-cover.png'): void {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  /**
   * Get image as blob for further processing
   */
  async getImageBlob(dataUrl: string): Promise<Blob> {
    const response = await fetch(dataUrl);
    return response.blob();
  }
}

export default new ImageCompositor();
