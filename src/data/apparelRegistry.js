export const CATEGORIES = [
  { id: 'all', name: 'Overview', icon: 'User', cameraTarget: [0, 0.9, 0], cameraPos: [0, 1.1, 3.2] },
  { id: 'headwear', name: 'Headwear', icon: 'HatGlasses', cameraTarget: [0, 1.7, 0], cameraPos: [0, 1.75, 1.1] },
  { id: 'outerwear', name: 'Top', icon: 'Shirt', cameraTarget: [0, 1.3, 0], cameraPos: [0, 1.35, 1.6] },
  { id: 'bottom', name: 'Bottom', icon: 'Shirt', cameraTarget: [0, 0.7, 0], cameraPos: [0, 0.75, 1.7] },
  { id: 'footwear', name: 'Footwear', icon: 'SportShoe', cameraTarget: [0, 0.15, 0], cameraPos: [0, 0.25, 0.95] },
];

export const FABRICS = [
  { id: 'cotton', name: 'Cotton Twill', roughness: 0.85, metalness: 0.05 },
  { id: 'denim', name: 'Denim Fabric', roughness: 0.75, metalness: 0.08 },
  { id: 'leather', name: 'Smooth Leather', roughness: 0.35, metalness: 0.2 },
  { id: 'nylon', name: 'Matte Nylon', roughness: 0.5, metalness: 0.1 },
  { id: 'velvet', name: 'Plush Velvet', roughness: 0.95, metalness: 0.0 },
  { id: 'metallic', name: 'Metallic Chrome', roughness: 0.2, metalness: 0.9 },
];

export const SKIN_TONES = [
  { id: 'fair', name: 'Fair Ivory', hex: '#F3DFC8', roughness: 0.55 },
  { id: 'warm_beige', name: 'Warm Beige', hex: '#E5C298', roughness: 0.52 },
  { id: 'tan', name: 'Honey Tan', hex: '#C68B59', roughness: 0.50 },
  { id: 'chestnut', name: 'Rich Chestnut', hex: '#8D5524', roughness: 0.48 },
  { id: 'espresso', name: 'Deep Espresso', hex: '#4A2E1B', roughness: 0.45 },
];

export const SHOE_VARIANTS = [
  { id: 'shoes1', name: 'Sneakers', modelPath: '/models/shoes1.glb' },
  { id: 'shoes2', name: 'Formal Shoes', modelPath: '/models/shoes2-double.glb' },
];

export const COLOR_PALETTES = [
  { name: 'Pure White', hex: '#FFFFFF' },
  { name: 'Jet Black', hex: '#18181B' },
  { name: 'Cool Slate', hex: '#475569' },
  { name: 'Crimson Red', hex: '#E11D48' },
  { name: 'Electric Pink', hex: '#EC4899' },
  { name: 'Royal Violet', hex: '#8B5CF6' },
  { name: 'Deep Indigo', hex: '#4338CA' },
  { name: 'Sky Cyan', hex: '#06B6D4' },
  { name: 'Emerald Green', hex: '#10B981' },
  { name: 'Neon Lime', hex: '#84CC16' },
  { name: 'Warm Amber', hex: '#F59E0B' },
  { name: 'Sunset Orange', hex: '#F97316' },
  { name: 'Sand Khaki', hex: '#D4B996' },
  { name: 'Olive Green', hex: '#556B2F' },
  { name: 'Midnight Navy', hex: '#1E293B' },
  { name: 'Burgundy', hex: '#701A75' },
];

export const DEFAULT_SLOTS = {
  cap: {
    id: 'baseball_cap',
    name: 'Classic Baseball Cap',
    category: 'headwear',
    enabled: true,
    activePart: 'crown',
    fabric: 'cotton',
    parts: {
      crown: { label: 'Crown', color: '#FAFAFA' },
      brim: { label: 'Visor / Brim', color: '#E11D48' },
      topButton: { label: 'Top Button', color: '#10B981' },
      backStrip: { label: 'Snapback Strap', color: '#F59E0B' },
      underwire: { label: 'Under Visor', color: '#06B6D4' },
    },
  },
  tshirt: {
    id: 'polo_tshirt',
    name: 'Crew Polo Tee',
    category: 'outerwear',
    enabled: true,
    activePart: 'body',
    fabric: 'cotton',
    parts: {
      body: { label: 'Shirt Body', color: '#FFFFFF', material: 'Polo_Shirt' },
      button: { label: 'Collar Buttons', color: '#18181B', material: 'Button' },
    },
  },
  bottom: {
    id: 'cargo_trousers',
    name: 'Tailored Cargo Trousers',
    category: 'bottom',
    enabled: true,
    activePart: 'main',
    fabric: 'denim',
    parts: {
      main: { label: 'Main Legs', color: '#1E293B', material: 'pants' },
    },
  },
  shoes: {
    id: 'retro_sneakers',
    name: 'Boots',
    category: 'footwear',
    enabled: true,
    activePart: 'base',
    fabric: 'leather',
    variant: 'shoes1',
    parts: {
      base: { label: 'Shoe', color: '#FFFFFF' },
    },
  },
};
