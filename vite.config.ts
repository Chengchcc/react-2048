import react from '@vitejs/plugin-react'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import transformerDirective from '@unocss/transformer-directives'
import presetAttributify from '@unocss/preset-attributify'
import presetUno from '@unocss/preset-uno'

const range = (start: number, end: number, step: number)=>{
  const arr = [];
  for(let i = start; i< end; i+=step){
    arr.push(i)
  }
  return arr
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    UnoCSS({
      theme: {
        colors: {
          primary: '#776e65',
          secondary: '#bbada0',
          tertiary: '#eee4da',
          foreground: '#ffffff',
          background: '#ffffff',
          backdrop: '#edc22e',
          tile2: '#eeeeee',
          tile: {
            50: '#eeeeee',
            100: '#eeeecc',
            150: '#ffbb88',
            200: '#ff9966',
            250: '#ff7755',
            300: '#ff5533',
            350: '#eecc77',
            450: '#eecc66',
            500: '#eecc55',
            550: '#eecc33',
            600: '#eecc11'
          }

        },
      },
      safelist: [
        'animate-merge',
        'animate-new',
        'pop',
        'scaleUp',
        ...range(50, 600, 50).map(i=> `bg-tile-${i}`)
      ],
      presets: [presetUno(), presetAttributify()],
      transformers: [
        transformerDirective(),
      ]
    }),
    react()
  ]
})
