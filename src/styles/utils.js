export const rgba = (rgb, alpha) => `rgba(${(typeof rgb === 'number' ? [rgb, rgb, rgb] : rgb).join(',')}, ${alpha})`;

export const px = (x) => (typeof x === 'number' || x === `${x}` ? `${x}px` : x);

export const perc = (x) => (typeof x === 'number' || x === `${x}` ? `${x}%` : x);
