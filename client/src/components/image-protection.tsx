import { ReactNode, useEffect } from 'react';

interface ImageProtectionProps {
  children: ReactNode;
  className?: string;
}

export function ImageProtection({ children, className = '' }: ImageProtectionProps) {
  useEffect(() => {
    // Disable right-click context menu on images
    const handleContextMenu = (e: MouseEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // Disable drag and drop on images
    const handleDragStart = (e: DragEvent) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // Disable text selection on image containers
    const handleSelectStart = (e: Event) => {
      if ((e.target as HTMLElement).tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  return (
    <div 
      className={`relative select-none ${className}`}
      style={{ userSelect: 'none' }}
    >
      {children}
      {/* Invisible overlay to prevent easy image access */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ 
          background: 'transparent',
          userSelect: 'none'
        }}
      />
    </div>
  );
}

interface ProtectedImageProps {
  src: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  watermarkText?: string;
}

export function ProtectedImage({ 
  src, 
  alt, 
  className = '', 
  loading = 'lazy',
  watermarkText = '© Pool Design Consultant'
}: ProtectedImageProps) {
  return (
    <ImageProtection className="overflow-hidden">
      <div className="relative">
        <img
          src={src}
          alt={alt}
          className={`${className} select-none`}
          loading={loading}
          draggable={false}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
          style={{ 
            userSelect: 'none',
            pointerEvents: 'none',
            // Prevent printing at high quality
            filter: 'contrast(1.1) saturate(1.1)'
          }}
        />
        {/* Subtle watermark overlay */}
        <div className="absolute bottom-2 right-2 bg-black/20 text-white text-xs px-2 py-1 rounded backdrop-blur-sm pointer-events-none select-none">
          {watermarkText}
        </div>
        {/* Invisible protection layer */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'transparent',
            userSelect: 'none',
            pointerEvents: 'all'
          }}
          onContextMenu={(e) => e.preventDefault()}
          onDragStart={(e) => e.preventDefault()}
        />
      </div>
    </ImageProtection>
  );
}