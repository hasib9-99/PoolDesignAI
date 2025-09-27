// A-Frame type declarations for React/TypeScript
declare global {
  interface Window {
    AFRAME: any;
  }
}

declare namespace JSX {
  interface IntrinsicElements {
    'a-scene': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      embedded?: boolean;
      'vr-mode-ui'?: string;
      'device-orientation-permission-ui'?: string;
      background?: string;
      style?: React.CSSProperties;
    };
    'a-sky': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      src?: string;
      radius?: string | number;
      color?: string;
    };
    'a-light': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      type?: string;
      color?: string;
      intensity?: string | number;
    };
    'a-plane': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      rotation?: string;
      scale?: string;
      width?: string | number;
      height?: string | number;
      color?: string;
      material?: string;
    };
    'a-box': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      rotation?: string;
      scale?: string;
      width?: string | number;
      height?: string | number;
      depth?: string | number;
      color?: string;
      material?: string;
    };
    'a-sphere': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      rotation?: string;
      scale?: string;
      radius?: string | number;
      color?: string;
      material?: string;
    };
    'a-cylinder': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      rotation?: string;
      scale?: string;
      radius?: string | number;
      height?: string | number;
      color?: string;
      material?: string;
    };
    'a-cone': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      rotation?: string;
      scale?: string;
      radius?: string | number;
      height?: string | number;
      color?: string;
      material?: string;
    };
    'a-torus': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      rotation?: string;
      scale?: string;
      radius?: string | number;
      'radius-tubular'?: string | number;
      color?: string;
      material?: string;
    };
    'a-dodecahedron': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      rotation?: string;
      scale?: string;
      radius?: string | number;
      color?: string;
      material?: string;
    };
    'a-entity': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      id?: string;
      position?: string;
      rotation?: string;
      scale?: string;
      geometry?: string;
      material?: string;
      animation?: string;
      'animation__hover'?: string;
      'animation__leave'?: string;
      'animation__click'?: string;
      hotspot?: string;
      'look-controls'?: string;
      'wasd-controls'?: string;
      cursor?: string;
      camera?: string;
      raycaster?: string;
    };
    'a-camera': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      'look-controls'?: string;
      'wasd-controls'?: string;
      cursor?: string;
      camera?: string;
    };
    'a-text': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      value?: string;
      position?: string;
      rotation?: string;
      scale?: string;
      color?: string;
      align?: string;
    };
    'a-cursor': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      position?: string;
      geometry?: string;
      material?: string;
      animation?: string;
      'animation__click'?: string;
      'animation__hover'?: string;
      'animation__leave'?: string;
      raycaster?: string;
    };
  }
}

export {};