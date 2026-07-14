/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm page stock with crisp white card surfaces
        paper: '#F6F2EC',
        card: '#FFFFFF',
        mist: '#EFEAE1',
        linen: '#E8E1D6',
        // Pale sage watermark used for ferns
        fern: '#D4CDC1',
        bordersoft: '#E5DED2',
        // Muted sage-gray for secondary labels
        sage: '#8C9088',
        // Greens — deepened to match the HL monogram + business-card wordmark
        ink: '#44534A',
        inkdeep: '#33403A',
        forest: '#2A3832',
        // Body copy — crisper than before
        body: '#585F58',
        // Earthy terracotta — replaces the old dusty coral, used sparingly
        clay: '#B56A4C',
        claydeep: '#A15C41',
        // Phosphor-terminal green — hacker-chic accent for prompts/cursor
        terminal: '#2F855A',
        terminaldeep: '#256B48'
      },
      fontFamily: {
        // Bold geometric sans for the "HiTech Labs" wordmark/logo
        wordmark: ['"Archivo Black"', 'system-ui', 'sans-serif'],
        // Monospace display + body — the terminal direction
        heading: ['"Space Mono"', '"IBM Plex Mono"', 'monospace'],
        body: ['"IBM Plex Mono"', '"SFMono-Regular"', 'monospace'],
        mono: ['"IBM Plex Mono"', '"SFMono-Regular"', 'monospace']
      },
      boxShadow: {
        soft: '0 24px 60px rgba(42, 56, 50, 0.08)',
        card: '0 14px 40px rgba(42, 56, 50, 0.06)',
        lift: '0 30px 70px rgba(42, 56, 50, 0.12)'
      },
      letterSpacing: {
        tightest: '-0.045em'
      },
      borderRadius: {
        xl2: '28px'
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(0.19, 1, 0.22, 1)'
      }
    }
  },
  plugins: []
}
