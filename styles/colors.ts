// Marcus Valley-inspired Miami Retro Color Palette

export const colors = {
  // Core palette inspired by the album cover
  miami: {
    sky: {
      light: '#B2E3FF',  // Morning sky
      DEFAULT: '#4FB5E6', // That perfect Miami blue
      dark: '#3A8CBF',   // Deep water
    },
    pink: {
      light: '#FFD4DC',  // Soft buildings
      DEFAULT: '#FF9EAE', // Miami pink
      dark: '#FF7A8E',   // Sunset pink
    },
    coral: {
      light: '#FFB199',  // Morning glow
      DEFAULT: '#FF6B4A', // His tank top
      dark: '#E65534',   // Warm accent
    },
    sand: {
      light: '#FFF1E6',  // Beach morning
      DEFAULT: '#F2D4B8', // The path
      dark: '#D4B69C',   // Shadows
    }
  },

  // Gradients that capture the album's energy
  gradients: {
    morning: 'from-[#4FB5E6] via-[#FF9EAE] to-[#FF6B4A]',
    sunset: 'from-[#FF6B4A] via-[#FF9EAE] to-[#4FB5E6]',
    sky: 'from-[#B2E3FF] to-[#4FB5E6]',
    sand: 'from-[#FFF1E6] to-[#F2D4B8]',
  },

  // Utility classes for common combinations
  utils: {
    // Buttons
    primaryButton: 'bg-gradient-to-r from-miami-coral-light to-miami-coral hover:opacity-90',
    secondaryButton: 'bg-gradient-to-r from-miami-sky to-miami-sky-light hover:opacity-90',
    
    // Cards & Panels
    glassCard: 'bg-white/10 backdrop-blur-md border border-white/20',
    glassPanel: 'bg-miami-sky/10 backdrop-blur-lg border-b border-white/10',
    
    // Text
    title: 'text-miami-coral font-light tracking-wide',
    subtitle: 'text-miami-pink-dark/80 font-light',
    body: 'text-miami-sand-dark/90',
    
    // Accents
    divider: 'border-miami-pink-light/20',
    highlight: 'text-miami-coral-light',
  },

  // Special effects
  effects: {
    glow: 'shadow-lg shadow-miami-coral/20',
    shimmer: 'animate-gradient bg-gradient-to-r from-transparent via-white/20 to-transparent bg-[length:200%_100%]',
  }
}
