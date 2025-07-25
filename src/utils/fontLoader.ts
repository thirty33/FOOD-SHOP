import { configuration } from '../config/config';

interface FontFace {
  family: string;
  url: string;
  weight: number;
  style: string;
}

const ceraFonts: FontFace[] = [
  {
    family: 'CERA Black',
    url: configuration.fonts.cera.black,
    weight: 500,
    style: 'normal'
  },
  {
    family: 'CERA Thin', 
    url: configuration.fonts.cera.thin,
    weight: 700,
    style: 'normal'
  },
  {
    family: 'CERA Light',
    url: configuration.fonts.cera.light,
    weight: 300,
    style: 'normal'
  },
  {
    family: 'CERA Regular',
    url: configuration.fonts.cera.regular,
    weight: 400,
    style: 'normal'
  },
  {
    family: 'CERA Medium',
    url: configuration.fonts.cera.medium,
    weight: 500,
    style: 'normal'
  },
  {
    family: 'CERA Bold',
    url: configuration.fonts.cera.bold,
    weight: 700,
    style: 'normal'
  }
];

export function generateFontCSS(): string {
  return ceraFonts
    .filter(font => font.url) // Only include fonts with valid URLs
    .map(font => `
@font-face {
  font-family: '${font.family}';
  src: url('${font.url}') format('woff2'),
       url('${font.url}') format('woff');
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: swap;
}`)
    .join('\n');
}

export function loadFonts(): void {
  const css = generateFontCSS();
  
  if (!css.trim()) {
    console.warn('No font URLs found in environment variables');
    return;
  }

  // Create style element
  const styleElement = document.createElement('style');
  styleElement.id = 'cera-fonts-dynamic';
  styleElement.textContent = css;
  
  // Remove existing dynamic fonts if any
  const existing = document.getElementById('cera-fonts-dynamic');
  if (existing) {
    existing.remove();
  }
  
  // Inject into document head
  document.head.appendChild(styleElement);
  
  console.log('✅ CERA fonts loaded dynamically from CloudFront');
}