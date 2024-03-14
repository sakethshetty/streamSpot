/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // ...
    'node_modules/flowbite-react/lib/esm/**/*.js',
	  './src/**/*.{js,jsx,ts,tsx}'
  ],
  plugins: [
    // ...
    require('flowbite/plugin'),
  ],
};

