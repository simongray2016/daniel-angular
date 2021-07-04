module.exports = {
    important: true,
    prefix: '',
    purge: {
      enabled: true,
      content: [
        './src/**/*.{html,ts}',
        './src/*.{html,ts}',
      ],
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      extend: {},
    },
    variants: {
      extend: {
        backgroundColor: ['hover', 'responsive', ' focus', 'dark'],
        textColor: ['hover', 'responsive', 'focus', 'dark'],
      },
    },
    plugins: [
      require('@tailwindcss/forms')({strategy: 'class',}),
      require('@tailwindcss/typography')
    ],
};