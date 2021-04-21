export const rgba = (rgb, alpha) => `rgba(${(typeof rgb === 'number' ? [rgb, rgb, rgb] : rgb).join(',')}, ${alpha})`;
