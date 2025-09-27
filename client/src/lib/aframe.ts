// Check WebGL availability before attempting to create contexts
export function webglAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const canvas = document.createElement('canvas');
    const contexts = ['webgl2', 'webgl', 'experimental-webgl'];
    
    for (const contextType of contexts) {
      const gl = canvas.getContext(contextType);
      if (gl) {
        // Clean up test context
        const extension = gl.getExtension('WEBGL_lose_context');
        if (extension) extension.loseContext();
        return true;
      }
    }
    return false;
  } catch (e) {
    return false;
  }
}

// Idempotent A-Frame initialization to prevent double loading
export async function ensureAFrame(): Promise<void> {
  // Check if already loaded
  if (typeof window !== 'undefined' && window.AFRAME && (window as any).__AFRAME_PLUGINS_LOADED) {
    console.log('A-Frame already initialized');
    return;
  }

  // Dynamically import A-Frame and plugins once
  if (typeof window !== 'undefined' && !window.AFRAME) {
    console.log('Loading A-Frame...');
    await import('aframe');
  }

  // Wait for A-Frame to be ready
  if (typeof window !== 'undefined' && window.AFRAME) {
    // Load plugins only if not already registered
    if (!window.AFRAME.components['environment']) {
      console.log('Loading environment component...');
      await import('aframe-environment-component');
    }
    
    // Teleport controls not needed for 360° panoramic viewing
    // if (!window.AFRAME.components['teleport-controls']) {
    //   console.log('Loading teleport controls...');
    //   await import('aframe-teleport-controls');
    // }

    // Mark as loaded to prevent reloading
    (window as any).__AFRAME_PLUGINS_LOADED = true;
    console.log('A-Frame initialization complete');
  }
}