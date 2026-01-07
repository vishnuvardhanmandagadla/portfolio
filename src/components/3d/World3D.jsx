import React, { Suspense } from 'react';
import './World3D.css';

// Lazy load 3D experiences for better performance
const SolarSystem = React.lazy(() => import('./SolarSystem'));

// Loading fallback for 3D components
const World3DLoader = () => (
  <div className="world3d-loader">
    <div className="world3d-loader-spinner" />
  </div>
);

/**
 * World3D - Container component for all 3D experiences
 *
 * This component serves as a wrapper for 3D content, making it easy to:
 * - Add new 3D experiences in the future
 * - Manage loading states for heavy 3D components
 * - Switch between different 3D scenes
 */
const World3D = () => {
  return (
    <div className="world3d-container">
      <Suspense fallback={<World3DLoader />}>
        <SolarSystem />
      </Suspense>

      {/* Future 3D experiences can be added here:
        * <Suspense fallback={<World3DLoader />}>
        *   <Galaxy />
        * </Suspense>
        *
        * <Suspense fallback={<World3DLoader />}>
        *   <SpaceStation />
        * </Suspense>
        */}
    </div>
  );
};

export default World3D;
