import React from 'react';

export default function LoadingScreen({ isFadingOut }) {
  return (
    <div className={`gpm-loader ${isFadingOut ? 'gpm-fade-out' : ''}`} aria-hidden="true">
      {/* Ambient background glow */}
      <div className="gpm-bg-glow" />

      {/* Centre morphing mark */}
      <div className="gpm-mark-wrap">
        <div className="gpm-mark">
          {/* Inner gradient orb */}
          <div className="gpm-orb" />
          {/* Rotating ring */}
          <div className="gpm-ring" />
        </div>

        {/* Brand name */}
        <p className="gpm-brand">NEXTAL ACADEMY</p>

        {/* Traveling progress line */}
        <div className="gpm-line-track">
          <div className="gpm-line-traveler" />
        </div>

        {/* Status text */}
        <p className="gpm-status">Preparing experience</p>
      </div>
    </div>
  );
}
