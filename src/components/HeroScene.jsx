import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei/core/Environment';
import RobotCat from './Robot_cat';

class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.warn("3D Canvas failed to load (likely due to WebGL issues on this device):", error);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '20px' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Interactive 3D model unavailable on this device.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function HeroScene({ isMobile }) {
  return (
    <CanvasErrorBoundary>
      <Canvas
        camera={{ position: [0, 1.5, 9.5], fov: 42 }}
        dpr={Math.min(window.devicePixelRatio, 2)}
        performance={{ min: 0.5 }}
        style={{ width: '100%', height: '100%', cursor: 'grab', overflow: 'visible' }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <spotLight position={[-5, 5, -5]} intensity={4} color="#ffffff" />
        <spotLight position={[0, -5, 2]} intensity={3} color="#00C896" angle={0.5} penumbra={1} />
        <Environment files="/potsdamer_platz_1k.hdr" />
        <Suspense fallback={null}>
          <RobotCat 
            position={isMobile ? [0, -3.5, 0] : [0.2, -4.5, 0]} 
            scale={isMobile ? 2.8 : 3.8} 
            rotation={[0, -Math.PI / 2.2, 0]} 
          />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
