import React, { useEffect, useState } from 'react';
import PlaylistCoverGenerator from './components/PlaylistCoverGenerator';
import ParallaxOnboarding from './components/ParallaxOnboarding';
import SpotifyUrlInput from './components/SpotifyUrlInput';
import VibeRecommendation from './components/VibeRecommendation';
import VibeCheckLoading from './components/VibeCheckLoading';
import CoverGenerationLoading from './components/CoverGenerationLoading';
import GeneratedCoverScreen from './components/GeneratedCoverScreen';
import dreamLayerAPI from './services/dreamLayerAPI';
import spotifyAPI from './services/spotifyAPI';
import imageCompositor from './services/imageCompositor';
import './App.css';

type AppStep = 'onboarding' | 'url-input' | 'vibe-loading' | 'vibe-recommendation' | 'cover-loading' | 'cover-result' | 'generator';

function App() {
  const [currentStep, setCurrentStep] = useState<AppStep>('onboarding');
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [playlistAnalysis, setPlaylistAnalysis] = useState<any>(null);
  const [loadingStep, setLoadingStep] = useState<string>('Vibe detected. Cover assembling…');
  const [playlistMicrocopy, setPlaylistMicrocopy] = useState<string>('');

  // Debug: Log current step changes
  useEffect(() => {
    console.log('🎯 App: Current step changed to:', currentStep);
  }, [currentStep]);

  // Set dark mode as default on app load
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  }, []);


  const handleGetStarted = () => {
    setCurrentStep('url-input');
  };

  const handleUrlSubmit = async (url: string) => {
    setPlaylistUrl(url);
    setCurrentStep('vibe-loading');
    
    try {
      console.log('🔍 Analyzing playlist URL:', url);
      
      // Always use basic playlist analysis
      setLoadingStep('Analyzing playlist mood...');
      console.log('🔍 Using basic playlist analysis');
      const basicAnalysis = await spotifyAPI.getBasicPlaylistAnalysis(url);
      console.log('📊 Basic analysis complete:', basicAnalysis);
      
      // Generate cheeky microcopy based on playlist data
      const microcopy = spotifyAPI.generateMicrocopy(basicAnalysis);
      setPlaylistMicrocopy(microcopy);
      console.log('💬 Generated microcopy:', microcopy);
      
      // Convert basic analysis to the expected format
      const analysisResult = {
        playlist: {
          name: basicAnalysis.name,
          tracks: [], // Basic analysis doesn't provide track details
          genres: []
        },
        moodAnalysis: {
          primaryMood: basicAnalysis.estimatedMood || 'calm',
          confidence: 0.5,
          keywords: basicAnalysis.basicSubjects,
          colorPalette: ['neutral colors']
        },
        promptVariance: basicAnalysis.basicSubjects.join(', ')
      };
      setPlaylistAnalysis(analysisResult);
      
      // Move to recommendations after analysis
      setTimeout(() => {
        setCurrentStep('vibe-recommendation');
      }, 3000);
      
    } catch (error) {
      console.error('❌ Error analyzing playlist:', error);
      // Fallback to basic flow
      setTimeout(() => {
        setCurrentStep('vibe-recommendation');
      }, 3000);
    }
  };

  const handleVibeSelect = async (vibe: string) => {
    console.log('🚀 handleVibeSelect called with vibe:', vibe);
    setSelectedVibe(vibe);
    setCurrentStep('cover-loading');
    setLoadingStep('Analyzing playlist...');
    
    try {
      console.log('🎯 Selected vibe:', vibe);
      
      // Use the analysis result we already have from handleUrlSubmit
      const analysisResult = playlistAnalysis;
      if (!analysisResult) {
        throw new Error('No playlist analysis available');
      }
      
      // Generate the disc image using new disc generation method
      setLoadingStep('Generating disc artwork...');
      console.log('🚀 Calling DreamLayer API for disc generation:', {
        vibe,
        mood: analysisResult.moodAnalysis.primaryMood || 'calm',
        playlistName: analysisResult.playlist.name
      });
      
      // Add debug logging to verify prompts are being used
      console.log('🎯 Using updated prompts for vibe:', vibe);
      if (vibe === 'Main Character') {
        console.log('🎨 Main Character prompt includes: "Abstract symmetrical composition, fluid art, biomorphic forms"');
      } else if (vibe === 'Healing Arc') {
        console.log('🎨 Healing Arc prompt includes: "An ethereal seascape, moody landscape, silhouetted coastline"');
      }
      
      const generationResponse = await dreamLayerAPI.generateDiscCover(
        vibe as 'Main Character' | 'Healing Arc',
        analysisResult.moodAnalysis.primaryMood || 'calm',
        analysisResult.playlist.name,
        {
          tracks: analysisResult.playlist.tracks,
          genres: analysisResult.playlist.genres
        }
      );
      
      console.log('🎨 DreamLayer API Response:', generationResponse);
      
      // Check if generation was successful
      if (generationResponse.status !== 'success' || !generationResponse.generated_images?.length) {
        throw new Error(generationResponse.message || 'Failed to generate disc image');
      }
      
      // Get the generated image filename and create full URL
      const generatedImageFilename = generationResponse.generated_images[0].filename;
      const generatedImageUrl = dreamLayerAPI.getImageURL(generatedImageFilename);
      console.log('🖼️ Generated disc image filename:', generatedImageFilename);
      console.log('🔗 Generated disc image URL:', generatedImageUrl);
      
      // Composite the disc image with NewCDbackground
      setLoadingStep('Compositing disc with NewCDbackground...');
      console.log('🔄 Starting compositing with generatedImageUrl:', generatedImageUrl);
      const finalImageUrl = await imageCompositor.compositeDiscCover(
        generatedImageUrl,
        {
          playlistName: analysisResult.playlist.name,
          vibe: vibe as 'Main Character' | 'Healing Arc'
        }
      );
      console.log('✅ Compositing complete, finalImageUrl:', finalImageUrl);
      
      console.log('✨ Final disc image URL:', finalImageUrl);
      console.log('🎯 Setting generated disc image for display:', finalImageUrl);
      setGeneratedImage(finalImageUrl);
      setCurrentStep('cover-result');
    } catch (error) {
      console.error('❌ Error generating disc:', error);
      // Fallback to static image on error
      setGeneratedImage('/images/landingpagedisc-1.png');
      setPlaylistAnalysis({
        playlist: { name: 'Playlist' },
        moodAnalysis: { primaryMood: 'calm' }
      });
      setCurrentStep('cover-result');
    }
  };

  const handleBackToOnboarding = () => {
    setCurrentStep('onboarding');
  };

  const handleBackToUrlInput = () => {
    setCurrentStep('url-input');
  };

  const handleBackToVibeRecommendation = () => {
    setCurrentStep('vibe-recommendation');
  };

  const handleGenerateNew = () => {
    // Go back to vibe recommendation to generate a new cover
    setCurrentStep('vibe-recommendation');
  };

  // Map vibe names to image generation themes
  const getImageTheme = (vibe: string): 'gradients' | 'nature' => {
    if (vibe === 'Main Character') return 'gradients';
    if (vibe === 'Healing Arc') return 'nature';
    return 'gradients'; // default fallback
  };

  return (
    <div className="App">
      
      {currentStep === 'onboarding' && (
        <ParallaxOnboarding onGetStarted={handleGetStarted} />
      )}
      {currentStep === 'url-input' && (
        <SpotifyUrlInput 
          onUrlSubmit={handleUrlSubmit}
          onBack={handleBackToOnboarding}
        />
      )}
      {currentStep === 'vibe-loading' && (
        <VibeCheckLoading onBack={handleBackToUrlInput} />
      )}
      {currentStep === 'vibe-recommendation' && (
        <VibeRecommendation 
          onVibeSelect={handleVibeSelect}
          onBack={handleBackToUrlInput}
          microcopy={playlistMicrocopy}
        />
      )}
      {currentStep === 'cover-loading' && (
        <CoverGenerationLoading 
          vibe={selectedVibe}
          onBack={handleBackToVibeRecommendation}
          loadingStep={loadingStep}
        />
      )}
      {currentStep === 'cover-result' && (
        <GeneratedCoverScreen 
          coverImage={generatedImage}
          vibe={selectedVibe}
          playlistAnalysis={playlistAnalysis}
          microcopy={playlistMicrocopy}
          onDownload={() => {
            // Create download functionality
            const downloadImage = () => {
              try {
                // Create a temporary anchor element
                const link = document.createElement('a');
                link.href = generatedImage;
                
                // Generate filename based on playlist name and vibe
                const playlistName = playlistAnalysis?.playlist?.name || 'playlist';
                const safePlaylistName = playlistName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
                const vibeName = selectedVibe.toLowerCase().replace(' ', '_');
                const filename = `${safePlaylistName}_${vibeName}_cover.png`;
                
                link.download = filename;
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log('✅ Download initiated:', filename);
              } catch (error) {
                console.error('❌ Download failed:', error);
                // Fallback: open image in new tab
                window.open(generatedImage, '_blank');
              }
            };
            
            downloadImage();
          }}
          onBack={handleBackToVibeRecommendation}
          onGenerateNew={handleGenerateNew}
        />
      )}
      {currentStep === 'generator' && (
        <PlaylistCoverGenerator 
          onBackToOnboarding={handleBackToOnboarding}
          playlistUrl={playlistUrl}
          selectedStyle={getImageTheme(selectedVibe)}
        />
      )}
    </div>
  );
}

export default App;
