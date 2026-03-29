import React, { useState } from 'react';
import RecipeCard from './RecipeCard';

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;
const DIETS = ['Vegetarian', 'Vegan', 'Gluten Free', 'Ketogenic', 'Paleo'];
const INTOLERANCES = ['Dairy', 'Egg', 'Gluten', 'Peanut', 'Seafood', 'Soy', 'Tree Nut', 'Wheat'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const CUISINES = ['American', 'Chinese', 'French', 'Greek', 'Indian', 'Italian', 'Japanese', 'Korean', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Spanish', 'Thai'];

const VIBES = [
  { label: '🥦 eat clean',  params: { minProtein: 15, maxCalories: 600, maxSaturatedFat: 5 } },
  { label: '😇 balanced',   params: { maxCalories: 800 } },
  { label: '🍕 treat yourself', params: { minCalories: 500 } },
];

export default function App() {
  const [screen, setScreen] = useState('home');
  const [cookTime, setCookTime] = useState(30);
  const [diet, setDiet] = useState('');
  const [mealType, setMealType] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [vibe, setVibe] = useState(null);
  const [intolerances, setIntolerances] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function surpriseMe() {
    setCookTime([15, 20, 30, 45, 60][Math.floor(Math.random() * 5)]);
    setDiet(Math.random() > 0.5 ? DIETS[Math.floor(Math.random() * DIETS.length)] : '');
    setMealType(MEAL_TYPES[Math.floor(Math.random() * MEAL_TYPES.length)]);
    setCuisine(CUISINES[Math.floor(Math.random() * CUISINES.length)]);
    setVibe(VIBES[Math.floor(Math.random() * VIBES.length)]);
    setIntolerances([]);
  }

  function toggleIntolerance(item) {
    setIntolerances(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }

  async function handleSearch() {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({
        apiKey: API_KEY,
        maxReadyTime: cookTime,
        number: 3,
        addRecipeInformation: true,
        excludeIngredients: 'juice,smoothie,shake,soda,coffee,tea,milk,water',
        ...(diet && { diet: diet.toLowerCase() }),
        ...(mealType && { type: mealType.toLowerCase() }),
        ...(cuisine && { cuisine: cuisine.toLowerCase() }),
        ...(vibe && vibe.params),
        ...(intolerances.length && { intolerances: intolerances.map(i => i.toLowerCase()).join(',') }),
      });
      const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRecipes(data.results);
      setScreen('results');
    } catch {
      setError('Something went wrong. Check your API key or connection.');
    } finally {
      setLoading(false);
    }
  }

  if (screen === 'results') {
    return (
      <div className="container">
        <div className="floaties" aria-hidden="true">
          <span className="floatie f1">🍙</span>
          <span className="floatie f2">🌟</span>
          <span className="floatie f3">🍓</span>
          <span className="floatie f4">🌸</span>
        </div>
        <div className="kawaii-chef results-chef" aria-hidden="true">
          <div className="chef-face">
            <div className="chef-hat" />
            <div className="chef-eyes"><span /><span /></div>
            <div className="chef-blush"><span /><span /></div>
            <div className="chef-mouth happy" />
          </div>
          <p className="chef-speech">yummy picks for you! (˘▾˘)</p>
        </div>
        <button className="back" onClick={() => setScreen('home')}>← back</button>
        <h2>✨ here's what i found! ✨</h2>
        {recipes.length === 0
          ? <p className="status">no recipes found 🥺 try adjusting your filters!</p>
          : (
            <div className="cards">
              {recipes.map(r => <RecipeCard key={r.id} recipe={r} />)}
            </div>
          )
        }
      </div>
    );
  }

  return (
    <div className="container">
      <div className="floaties" aria-hidden="true">
        <span className="floatie f1">🍰</span>
        <span className="floatie f2">⭐</span>
        <span className="floatie f3">🍒</span>
        <span className="floatie f4">🌷</span>
        <span className="floatie f5">🍪</span>
        <span className="floatie f6">💫</span>
      </div>
      <div className="kawaii-chef" aria-hidden="true">
        <div className="chef-face">
          <div className="chef-hat" />
          <div className="chef-eyes"><span /><span /></div>
          <div className="chef-blush"><span /><span /></div>
          <div className="chef-mouth" />
        </div>
        <p className="chef-speech">what are we cooking? (｡♡‿♡｡)</p>
      </div>
      <h1>🌸 recipe finder 🌸</h1>
      <div className="card-container">

        <div className="field">
          <label>⏰ max cook time <span className="time-display">{cookTime} min</span></label>
          <input type="range" min={10} max={120} step={5}
            value={cookTime} onChange={e => setCookTime(Number(e.target.value))} />
        </div>

        <hr className="divider" />

        <div className="field">
          <label>✨ vibe check</label>
          <div className="chips">
            {VIBES.map(v => (
              <button key={v.label} className={`chip ${vibe?.label === v.label ? 'active' : ''}`}
                onClick={() => setVibe(prev => prev?.label === v.label ? null : v)}>
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <hr className="divider" />

        <div className="field">
          <label>🍜 cuisine</label>
          <div className="chips">
            {CUISINES.map(c => (
              <button key={c} className={`chip ${cuisine === c ? 'active' : ''}`}
                onClick={() => setCuisine(prev => prev === c ? '' : c)}>
                {c}
              </button>
            ))}
          </div>
        </div>

        <hr className="divider" />

        <div className="field">
          <label>🍳 meal type</label>
          <div className="chips">
            {MEAL_TYPES.map(m => (
              <button key={m} className={`chip ${mealType === m ? 'active' : ''}`}
                onClick={() => setMealType(prev => prev === m ? '' : m)}>
                {m}
              </button>
            ))}
          </div>
        </div>

        <hr className="divider" />

        <div className="field">
          <label>🥗 diet</label>
          <div className="chips">
            {DIETS.map(d => (
              <button key={d} className={`chip ${diet === d ? 'active' : ''}`}
                onClick={() => setDiet(prev => prev === d ? '' : d)}>
                {d}
              </button>
            ))}
          </div>
        </div>

        <hr className="divider" />

        <div className="field">
          <label>🚫 intolerances</label>
          <div className="chips">
            {INTOLERANCES.map(i => (
              <button key={i} className={`chip ${intolerances.includes(i) ? 'active' : ''}`}
                onClick={() => toggleIntolerance(i)}>
                {i}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="status error">{error}</p>}

        <button className="surprise" onClick={surpriseMe}>
          🎲 surprise me!
        </button>
        <button className="search" onClick={handleSearch} disabled={loading}>
          {loading ? 'searching... 🔍' : 'find recipes 🌟'}
        </button>
      </div>
    </div>
  );
}
