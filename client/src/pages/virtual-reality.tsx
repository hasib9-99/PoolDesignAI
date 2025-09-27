import { useState, useEffect, useRef } from "react";
import { ensureAFrame, webglAvailable } from '@/lib/aframe';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Smartphone, Eye, Play, Upload, RotateCcw, CheckCircle, AlertCircle } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

// Pool design configuration - easily update images here
const poolDesigns = [
  {
    id: "sample-pool-360",
    title: "Professional Pool Design",
    description: "Custom pool design featuring modern architecture and premium finishes",
    thumbnail: "/attached_assets/backup-justin-hill.jpg",
    image360: "/attached_assets/backup-justin-hill.jpg",
    features: ["Custom Design", "Modern Architecture", "Premium Finishes", "Professional Rendering"]
  },
  // Add your Structure Studios/Vip3D exports here:
  // {
  //   id: "luxury-pool-design",
  //   title: "Luxury Pool Design", 
  //   description: "Custom luxury pool with spa and waterfall",
  //   thumbnail: "thumbnail-url-here",
  //   image360: "/attached_assets/360-designs/luxury-pool-design.jpg",
  //   features: ["Spa", "Waterfall", "Premium Materials"]
  // }
];

export default function VirtualReality() {
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [vrMode, setVrMode] = useState(false);
  const [aframeReady, setAframeReady] = useState(false);
  const [webglSupported, setWebglSupported] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedDesigns, setUploadedDesigns] = useState<any[]>([]);
  const sceneRef = useRef<Element>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleViewDesign = (designId: string) => {
    setSelectedDesign(designId);
    setVrMode(true);
  };

  const handleExitVR = () => {
    setVrMode(false);
    setSelectedDesign(null);
  };

  // Fetch existing uploaded designs
  const { data: existingDesigns = [], isLoading: loadingDesigns } = useQuery({
    queryKey: ['/api/360-designs'],
    select: (data: any) => {
      return data.designs.map((file: any) => ({
        id: file.id,
        title: file.filename.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        description: "Uploaded 360° pool design",
        thumbnail: file.path,
        image360: file.path,
        features: ["Custom Design", "360° View"]
      }));
    }
  });

  const allDesigns = [...poolDesigns, ...existingDesigns, ...uploadedDesigns];
  const selectedDesignData = allDesigns.find(design => design.id === selectedDesign);

  // File upload handlers
  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setUploading(true);

    // Validate images before upload
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} (not an image)`);
        continue;
      }

      // Check if it's a valid image (accept both regular photos and 360° panoramic images)
      const isValid = await new Promise<boolean>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          const is360 = Math.abs(aspectRatio - 2) < 0.1; // 2:1 ratio for 360° images
          const isRegularPhoto = aspectRatio > 0.5 && aspectRatio < 4; // Accept regular photos
          const hasMinResolution = img.naturalWidth >= 800; // Minimum resolution for any image
          
          resolve((is360 || isRegularPhoto) && hasMinResolution);
          URL.revokeObjectURL(img.src); // Clean up
        };
        img.onerror = () => {
          URL.revokeObjectURL(img.src);
          resolve(false);
        };
        img.src = URL.createObjectURL(file);
      });

      if (isValid) {
        validFiles.push(file);
      } else {
        invalidFiles.push(`${file.name} (needs to be a valid image, min 800px wide)`);
      }
    }

    // Show validation results
    if (invalidFiles.length > 0) {
      toast({
        title: "Some files rejected",
        description: `Invalid: ${invalidFiles.join(', ')}`,
        variant: "destructive",
      });
    }

    if (validFiles.length === 0) {
      toast({
        title: "No valid images",
        description: "Upload images with minimum 800px width. Supports both regular photos and 360° panoramic images.",
        variant: "destructive",
      });
      setUploading(false);
      return;
    }

    // Upload valid files
    const formData = new FormData();
    validFiles.forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch('/api/upload-360-images', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      // Add uploaded files to the designs list
      const newDesigns = result.files.map((file: any) => ({
        id: file.filename.replace(/\.[^/.]+$/, ""), // Remove file extension
        title: file.originalName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' '),
        description: "Custom 360° pool design",
        thumbnail: file.path, // Use the 360° image as thumbnail for now
        image360: file.path,
        features: ["Custom Design", "360° View"]
      }));

      setUploadedDesigns(prev => [...newDesigns, ...prev]);
      
      // Invalidate and refetch existing designs
      queryClient.invalidateQueries({ queryKey: ['/api/360-designs'] });
      
      toast({
        title: "Upload Successful!",
        description: `${validFiles.length} valid 360° design(s) uploaded successfully`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // A-Frame initialization effect
  useEffect(() => {
    const initializeAFrame = async () => {
      // Check WebGL support first
      const webglIsSupported = webglAvailable();
      console.log('WebGL supported:', webglIsSupported);
      setWebglSupported(webglIsSupported);
      
      if (!webglIsSupported) {
        console.warn('WebGL not available - VR experience will be disabled');
        return;
      }
      
      await ensureAFrame();
      setAframeReady(true);
      
      // Register hotspot component for future interactivity
      if (window.AFRAME && !window.AFRAME.components['hotspot']) {
        window.AFRAME.registerComponent('hotspot', {
          schema: {
            title: {type: 'string'},
            description: {type: 'string'}
          },
          init: function () {
            this.el.addEventListener('click', () => {
              const title = this.data.title;
              const description = this.data.description;
              console.log('Hotspot clicked:', title, description);
              // Future: Show info panel or navigate to different 360° view
            });
          }
        });
      }
    };

    initializeAFrame();
    
    // WebGL cleanup on unmount
    return () => {
      if (sceneRef.current) {
        const sceneEl = sceneRef.current as any;
        if (sceneEl.renderer) {
          sceneEl.renderer.forceContextLoss?.();
          sceneEl.renderer.dispose?.();
        }
        // Remove canvas to prevent accumulation
        const canvas = sceneEl.querySelector('canvas');
        if (canvas) {
          canvas.remove();
        }
      }
    };
  }, []);

  // Proper equirectangular 360° fallback viewer
  const CSSPanoramicViewer = ({ designData }: { designData: any }) => {
    const [yaw, setYaw] = useState(0); // horizontal rotation (0-360)
    const [pitch, setPitch] = useState(0); // vertical rotation (-90 to 90)
    const [zoom, setZoom] = useState(1);
    const [isDragging, setIsDragging] = useState(false);
    const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: any) => {
      setIsDragging(true);
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: any) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMousePos.x;
      const deltaY = e.clientY - lastMousePos.y;
      
      // Convert mouse movement to spherical coordinates
      const sensitivity = 0.2;
      setYaw(prev => (prev + deltaX * sensitivity) % 360);
      setPitch(prev => Math.max(-90, Math.min(90, prev - deltaY * sensitivity)));
      
      setLastMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleWheel = (e: WheelEvent) => {
      // Don't call preventDefault() to avoid passive listener issues
      const delta = e.deltaY * -0.001;
      setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
    };

    // Convert spherical coordinates to CSS background position
    const getBackgroundPosition = () => {
      // Equirectangular mapping: yaw maps to X, pitch maps to Y
      const xPercent = ((yaw % 360) / 360) * 100;
      const yPercent = ((pitch + 90) / 180) * 100;
      return `${xPercent}% ${yPercent}%`;
    };

    return (
      <div 
        className="w-full h-screen bg-black overflow-hidden cursor-grab active:cursor-grabbing relative"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => handleWheel(e.nativeEvent)}
        data-testid="css-360-viewer"
      >
        <div
          className="w-full h-full transition-all duration-100 ease-out"
          style={{
            backgroundImage: `url(${designData.image360})`,
            backgroundSize: `${200 * zoom}% ${100 * zoom}%`, // 2:1 ratio for equirectangular
            backgroundPosition: getBackgroundPosition(),
            backgroundRepeat: 'repeat-x', // Seamless horizontal wrap
            filter: 'brightness(1.1) contrast(1.05)' // Enhance image quality
          }}
        />
        
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <Button
            size="sm"
            variant="secondary"
            className="bg-black/80 text-white hover:bg-black/60 w-10 h-10 p-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setZoom(prev => {
                const newZoom = Math.min(3, prev + 0.2);
                console.log('Zoom in:', prev, '->', newZoom);
                return newZoom;
              });
            }}
            data-testid="button-zoom-in"
          >
            +
          </Button>
          <Button
            size="sm"
            variant="secondary" 
            className="bg-black/80 text-white hover:bg-black/60 w-10 h-10 p-0"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setZoom(prev => {
                const newZoom = Math.max(0.5, prev - 0.2);
                console.log('Zoom out:', prev, '->', newZoom);
                return newZoom;
              });
            }}
            data-testid="button-zoom-out"
          >
            -
          </Button>
        </div>
        
        {/* Enhanced overlay instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-center">
          <div className="bg-black/70 px-4 py-2 rounded-lg border border-white/20">
            <p className="text-sm font-medium">
              Drag to explore • Scroll to zoom • Equirectangular 360° view
            </p>
            <p className="text-xs text-gray-300 mt-1">
              Yaw: {Math.round(yaw)}° • Pitch: {Math.round(pitch)}° • Zoom: {zoom.toFixed(1)}x
            </p>
          </div>
        </div>
      </div>
    );
  };

  // A-Frame 360° Panoramic Image Viewer Component  
  const PanoramicViewer = ({ designData }: { designData: any }) => {
    // Show CSS fallback if WebGL is not supported
    if (!webglSupported) {
      return <CSSPanoramicViewer designData={designData} />;
    }

    // Show loading if A-Frame isn't ready yet
    if (!aframeReady) {
      return (
        <div className="flex items-center justify-center h-screen bg-black text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading 360° Viewer...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative">
        <a-scene 
          ref={sceneRef}
          embedded 
          style={{ width: '100%', height: '100vh' }}
          vr-mode-ui="enabled: true"
          device-orientation-permission-ui="enabled: true"
          background="color: #000000"
        >
          {/* 360° Panoramic Image */}
          <a-sky 
            src={designData.image360}
            radius="100"
          />
          
          {/* Camera with enhanced controls */}
          <a-entity id="cameraRig" position="0 1.6 0">
            <a-camera 
              look-controls="enabled: true; touchEnabled: true; reverseMouseDrag: false"
              wasd-controls="enabled: true; acceleration: 100"
              cursor="fuse: false; rayOrigin: mouse"
              camera="fov: 80; zoom: 1"
            >
              {/* Cursor for interactions */}
              <a-cursor 
                position="0 0 -1"
                geometry="primitive: ring; radiusInner: 0.01; radiusOuter: 0.02"
                material="color: white; shader: flat; opacity: 0.7"
                animation__click="property: scale; startEvents: click; from: 0.8 0.8 0.8; to: 1.2 1.2 1.2; dur: 150"
                raycaster="objects: .hotspot"
              />
            </a-camera>
          </a-entity>

          {/* Sample hotspots - you can add these to your 360° images */}
          <a-entity 
            class="hotspot"
            position="8 2 -5"
            geometry="primitive: sphere; radius: 0.15"
            material="color: #FF6B35; emissive: #FF6B35; emissiveIntensity: 0.4; transparent: true; opacity: 0.8"
            animation="property: rotation; to: 0 360 0; dur: 4000; loop: true"
            animation__hover="property: scale; to: 1.3 1.3 1.3; dur: 200; startEvents: mouseenter"
            animation__leave="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
            hotspot="title: Pool Features; description: Click to explore pool design details"
          />
          
          <a-entity 
            class="hotspot"
            position="-6 1 -8"
            geometry="primitive: sphere; radius: 0.15"
            material="color: #4ECDC4; emissive: #4ECDC4; emissiveIntensity: 0.4; transparent: true; opacity: 0.8"
            animation="property: rotation; to: 0 360 0; dur: 5000; loop: true"
            animation__hover="property: scale; to: 1.3 1.3 1.3; dur: 200; startEvents: mouseenter"
            animation__leave="property: scale; to: 1 1 1; dur: 200; startEvents: mouseleave"
            hotspot="title: Landscape Design; description: View surrounding landscape elements"
          />

          {/* Subtle lighting */}
          <a-light type="ambient" color="#ffffff" intensity="0.3"/>
        </a-scene>

        {/* VR Zoom Controls Overlay */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
          <Button
            size="sm"
            variant="secondary"
            className="bg-black/80 text-white hover:bg-black/60 w-10 h-10 p-0"
            onClick={() => {
              const camera = sceneRef.current?.querySelector('a-camera');
              if (camera) {
                const currentFov = camera.getAttribute('camera')?.fov || 80;
                camera.setAttribute('camera', { fov: Math.max(30, currentFov - 10) });
              }
            }}
            data-testid="button-zoom-in-vr"
          >
            +
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-black/80 text-white hover:bg-black/60 w-10 h-10 p-0"
            onClick={() => {
              const camera = sceneRef.current?.querySelector('a-camera');
              if (camera) {
                const currentFov = camera.getAttribute('camera')?.fov || 80;
                camera.setAttribute('camera', { fov: Math.min(120, currentFov + 10) });
              }
            }}
            data-testid="button-zoom-out-vr"
          >
            -
          </Button>
        </div>
      </div>
    );
  };

  if (vrMode && selectedDesignData) {
    return (
      <div className="relative">
        {/* VR Exit Button */}
        <div className="absolute top-4 left-4 z-50">
          <Button 
            onClick={handleExitVR}
            variant="secondary"
            className="bg-black/80 text-white hover:bg-black/60"
            data-testid="button-exit-vr"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Exit 360°
          </Button>
        </div>
        
        {/* VR Controls Instructions */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <Smartphone className="w-4 h-4 mr-1" />
                Drag to look around
              </span>
              <span className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                Click "Enter VR" for headsets
              </span>
            </div>
          </div>
        </div>

        <PanoramicViewer designData={selectedDesignData} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              360° Pool Design Viewer
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience your pool designs in immersive 360° panoramic views. 
              Perfect for desktop, mobile, and VR headsets.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Smartphone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mobile & Desktop</h3>
              <p className="text-gray-600">Drag to look around on desktop, or tilt your mobile device</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <Eye className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">VR Headset Ready</h3>
              <p className="text-gray-600">Full WebXR support for Meta Quest and other VR headsets</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <RotateCcw className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Easy Updates</h3>
              <p className="text-gray-600">Simply upload new 360° images to update designs</p>
            </div>
          </div>

          {/* Pool Designs Gallery */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Available Pool Designs</h2>
            
            {loadingDesigns && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-600">Loading your designs...</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allDesigns.map((design, index) => (
                <Card key={`${design.id}-${index}`} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={design.thumbnail} 
                      alt={design.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-blue-600 text-white">
                        360°
                      </Badge>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="text-lg">{design.title}</CardTitle>
                    <p className="text-sm text-gray-600">{design.description}</p>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {design.features.map((feature: string, featureIndex: number) => (
                        <Badge key={featureIndex} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                    
                    <Button 
                      onClick={() => handleViewDesign(design.id)}
                      className="w-full"
                      data-testid={`button-view-360-${design.id}`}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      View in 360°
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* File Upload Interface */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <div className="flex items-start">
              <Upload className="w-6 h-6 text-blue-600 mt-1 mr-3" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  Upload Your Design Images
                </h3>
                
                {/* Drag and Drop Upload Area */}
                <div 
                  className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-25 hover:bg-blue-100 transition-colors cursor-pointer"
                  data-testid="upload-area-360-images"
                  onClick={handleFileSelect}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-blue-800 font-medium">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                      <p className="text-blue-800 font-medium mb-2">
                        Drag & drop your pool designs or backyard photos here
                      </p>
                      <p className="text-blue-600 text-sm mb-4">
                        or click to browse files
                      </p>
                      <Button variant="outline" className="border-blue-300 text-blue-700">
                        Choose Files
                      </Button>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                    data-testid="input-file-360-images"
                    onChange={(e) => handleFileUpload(e.target.files)}
                  />
                </div>

                <div className="text-blue-700 text-sm mt-4 space-y-1">
                  <p>• Supported formats: JPG, PNG</p>
                  <p>• Minimum resolution: 800px wide</p>
                  <p>• Accepts both regular photos and 360° panoramic images</p>
                  <p>• Upload backyard photos, pool designs, or 360° views</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}