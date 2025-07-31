/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_layouts/**/*.html',
    './_includes/**/*.html',
    './_posts/**/*.md',
    './_essays/**/*.md',
    './_projects/**/*.md',
    './*.html',
    './*.md',
    './pages/**/*.html'
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            lineHeight: '1.7',
            h1: {
              color: '#111827',
              fontWeight: '700',
            },
            h2: {
              color: '#111827',
              fontWeight: '600',
            },
            h3: {
              color: '#111827',
              fontWeight: '600',
            },
            a: {
              color: '#2563eb',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },
            blockquote: {
              borderLeftColor: '#e5e7eb',
              borderLeftWidth: '4px',
              fontStyle: 'italic',
            },
            code: {
              backgroundColor: '#f3f4f6',
              padding: '0.2rem 0.4rem',
              borderRadius: '0.25rem',
              fontSize: '0.875em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}