import React, { useState } from 'react';
import Spline from '@splinetool/react-spline';
import './OnboardingPage.css';

interface OnboardingPageProps {
  onComplete: () => void;
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [splineLoaded, setSplineLoaded] = useState(false);

  const steps = [
    {
      title: "Welcome to Spotify Cover Generator",
      subtitle: "Create stunning playlist covers with AI",
      description: "Transform your Spotify playlists into beautiful, custom cover art using the power of artificial intelligence.",
      icon: "🎵"
    },
    {
      title: "Choose Your Style",
      subtitle: "Three unique artistic styles",
      description: "Pick from gradient, abstract, or nature styles. Each creates a different mood for your playlist cover.",
      icon: "🎨"
    },
    {
      title: "AI-Powered Generation",
      subtitle: "Smart playlist analysis",
      description: "Our AI analyzes your playlist mood and song titles to create the perfect cover that matches your music's vibe.",
      icon: "🤖"
    },
    {
      title: "Ready to Create?",
      subtitle: "Let's make some magic",
      description: "You're all set! Start by pasting a Spotify playlist URL and watch the AI create your custom cover art.",
      icon: "✨"
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSplineLoad = () => {
    setSplineLoaded(true);
  };

  return (
    <div className="onboarding-container">
      {/* Background with disco ball */}
      <div className="onboarding-background">
        <div className="spline-container">
          <Spline
            scene="https://prod.spline.design/6WZ8R2jR6mQy7r2y/scene.splinecode"
            onLoad={handleSplineLoad}
            style={{
              width: '100%',
              height: '100%',
              opacity: splineLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          />
          {!splineLoaded && (
            <div className="spline-loading">
              <div className="loading-spinner"></div>
              <p>Loading disco ball...</p>
            </div>
          )}
        </div>
        
        {/* Gradient overlay */}
        <div className="gradient-overlay"></div>
      </div>

      {/* Content */}
      <div className="onboarding-content">
        <div className="onboarding-card">
          {/* Progress indicator */}
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              {currentStep + 1} of {steps.length}
            </span>
          </div>

          {/* Step content */}
          <div className="step-content">
            <div className="step-icon">{steps[currentStep].icon}</div>
            <h1 className="step-title">{steps[currentStep].title}</h1>
            <h2 className="step-subtitle">{steps[currentStep].subtitle}</h2>
            <p className="step-description">{steps[currentStep].description}</p>
          </div>

          {/* Navigation */}
          <div className="navigation-buttons">
            {currentStep > 0 && (
              <button 
                className="btn-secondary"
                onClick={handlePrevious}
              >
                ← Back
              </button>
            )}
            
            <button 
              className="btn-primary"
              onClick={handleNext}
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next →'}
            </button>
          </div>

          {/* Skip button */}
          {currentStep < steps.length - 1 && (
            <button 
              className="skip-button"
              onClick={onComplete}
            >
              Skip intro
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
