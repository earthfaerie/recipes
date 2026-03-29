import React, { useState } from 'react';
import RecipeCard from './RecipeCard';

const APP_ID = import.meta.env.VITE_EDAMAM_APP_ID;
const APP_KEY = import.meta.env.VITE_EDAMAM_APP_KEY;
const BASE = 'https://api.edamam.com/api/recipes/v2';
const DIETS = ['Balanced', 'High-Fiber', 'High-Protein', 'Low-Carb', 'Low-Fat', 'Low-Sodium'];
const INTOLERANCES = ['Dairy', 'Egg', 'Gluten', 'Peanut', 'Seafood', 'Soy', 'Tree-Nut', 'Wheat'];
const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
const CUISINES = ['American', 'Chinese', 'French', 'Greek', 'Indian', 'Italian', 'Japanese', 'Korean', 'Mediterranean', 'Mexican', 'Middle Eastern', 'Spanish', 'Thai'];

const VIBES = [
  { label: '🥦 eat clean',     params: { diet: 'high-protein', calories: '100-600' } },
  { label: '😇 balanced',      params: { diet: 'balanced' } },
  { label: '🍕 treat yourself', params: { calories: '500-9999' } },
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
        type: 'public',
        app_id: APP_ID,
        app_key: APP_KEY,
        random: true,
        time: `1-${cookTime}`,
        ...(mealType && { mealType: mealType.toLowerCase() }),
        ...(cuisine && { cuisineType: cuisine.toLowerCase() }),
        ...(diet && { diet: diet.toLowerCase() }),
        ...(vibe?.params?.diet && { diet: vibe.params.diet }),
        ...(vibe?.params?.calories && { calories: vibe.params.calories }),
      });
      intolerances.forEach(i => params.append('health', i.toLowerCase()));
      params.append('health', 'alcohol-free');

      const res = await fetch(`${BASE}?${params}`, {
        headers: { 'Edamam-Account-User': APP_ID },
      });
      // 400 means no results for this filter combo, not a real error
      if (res.status === 400) {
        setRecipes([]);
        setScreen('results');
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      const hits = data.hits ?? [];

      const EXCLUDE_KEYWORDS = [
        'drink', 'smoothie', 'juice', 'cocktail', 'sauce', 'dressing', 'spice mix',
        'spice blend', 'spice rub', 'marinade', 'syrup', 'lemonade', 'tea', 'coffee',
        'shake', 'milk', 'latte', 'frappe', 'punch', 'cider', 'brew', 'infusion',
        'tonic', 'soda', 'vinaigrette', 'glaze', 'dry rub', 'seasoning blend',
        'condiment', 'jam', 'jelly', 'preserve', 'pickle', 'brine', 'stock', 'broth',
      ];
      const EXCLUDE_DISH_TYPES = ['drinks', 'drink', 'cocktail', 'shot', 'smoothie'];
      const filtered = hits
        .map(h => h.recipe)
        .filter(r => {
          const label = r.label.toLowerCase();
          const dishTypes = (r.dishType ?? []).map(d => d.toLowerCase());
          const hasExcludedDishType = dishTypes.some(d => EXCLUDE_DISH_TYPES.includes(d));
          const hasExcludedKeyword = EXCLUDE_KEYWORDS.some(k => label.includes(k));
          const hasRecipesInTitle = label.endsWith('recipes') || label.includes(' recipes');
          return !hasExcludedDishType && !hasExcludedKeyword && !hasRecipesInTitle;
        })
        .slice(0, 3);

      setRecipes(filtered);
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
