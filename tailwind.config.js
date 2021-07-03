module.exports = {
    important: true,
    prefix: '',
    purge: {
      enabled: true,
      content: ['./src/**/*.html'],
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/forms')({strategy: 'class',}),
      require('@tailwindcss/typography')
    ],
};