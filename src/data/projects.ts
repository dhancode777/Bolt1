export interface Project {
  id: string;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  accent: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'aura',
    title: 'AURA',
    category: 'Luxury Fashion Experience',
    year: '2026',
    description:
      'A sensorial digital atelier for a Parisian fashion house — reactive lookbooks, garment-level interaction, and a cinematic e-commerce journey.',
    image:
      'https://images.pexels.com/photos/20177238/pexels-photo-20177238.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
    accent: '#D7FF3F',
  },
  {
    id: 'mono',
    title: 'MONO',
    category: 'Digital Architecture',
    year: '2026',
    description:
      'An immersive portfolio for an architecture practice — spatial scrolling, parametric form studies, and a monochrome editorial system.',
    image:
      'https://images.pexels.com/photos/40028546/pexels-photo-40028546.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
    accent: '#F4F4F0',
  },
  {
    id: 'velocity',
    title: 'VELOCITY',
    category: 'Automotive Campaign',
    year: '2026',
    description:
      'A launch experience for an electric hypercar — real-time 3D configurator, scroll-driven cinema, and a sound-reactive hero reveal.',
    image:
      'https://images.pexels.com/photos/9028761/pexels-photo-9028761.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
    accent: '#D7FF3F',
  },
  {
    id: 'form',
    title: 'FORM',
    category: 'Creative E-commerce',
    year: '2026',
    description:
      'A sculptural commerce platform for a design-object label — playful interactions, generative product imagery, and a frictionless checkout.',
    image:
      'https://images.pexels.com/photos/7828031/pexels-photo-7828031.jpeg?auto=compress&cs=tinysrgb&h=900&w=1400',
    accent: '#F4F4F0',
  },
];
