# 🌸 recipe finder

a kawaii recipe finder app built with react + vite. enter your cook time, cuisine, dietary preferences and get 3 recipe suggestions powered by the spoonacular api. tap a card to flip it and see ingredients + steps!

## setup

1. clone the repo
2. install dependencies
   ```bash
   npm install
   ```
3. copy `.env.example` to `.env` and add your spoonacular api key
   ```bash
   cp .env.example .env
   ```
   get a free key at [spoonacular.com/food-api](https://spoonacular.com/food-api)

4. run the dev server
   ```bash
   npm run dev
   ```

## deploy

this app is ready to deploy on [vercel](https://vercel.com) or [netlify](https://netlify.com). just add `VITE_SPOONACULAR_KEY` as an environment variable in your hosting dashboard.

## built with

- [react](https://react.dev)
- [vite](https://vitejs.dev)
- [spoonacular api](https://spoonacular.com/food-api)
