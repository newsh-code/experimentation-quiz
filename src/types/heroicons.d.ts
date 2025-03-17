declare module '@heroicons/react/solid' {
  import { ComponentType, SVGProps } from 'react';
  
  export const ChevronDownIcon: ComponentType<SVGProps<SVGSVGElement>>;
  // Add other icons as needed
  
  // Catch-all for any other icons
  const icons: Record<string, ComponentType<SVGProps<SVGSVGElement>>>;
  export default icons;
} 