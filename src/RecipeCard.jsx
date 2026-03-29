import React, { useState } from 'react';

const API_KEY = import.meta.env.VITE_SPOONACULAR_KEY;

export default function RecipeCard({ recipe }) {
  const [flipped, setFlipped] = useState(false);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleFlip() {
    if (!flipped && !details) {
      setLoading(true);
      try {
        const res = await fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${API_KEY}&includeNutrition=false`
        );
        const data = await res.json();
        setDetails(data);
      } catch {
        setDetails({ error: true });
      } finally {
        setLoading(false);
      }
    }
    setFlipped(f => !f);
  }

  const steps = details?.analyzedInstructions?.[0]?.steps ?? [];
  const ingredients = details?.extendedIngredients ?? [];

  return (
    <div className={`flip-card ${flipped ? 'is-flipped' : ''}`} onClick={handleFlip}>
      <div className="flip-inner">

        {/* FRONT */}
        <div className="flip-front">
          <img src={recipe.image} alt={recipe.title} />
          <div className="card-body">
            <h3>{recipe.title}</h3>
            <p className="time">⏱ {recipe.readyInMinutes} min</p>
            <span className="flip-hint">tap to see recipe ✨</span>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-back">
          <div className="flip-back-inner">
            <h3>{recipe.title}</h3>
            {loading && <p className="loading-text">loading... 🌸</p>}
            {details?.error && <p className="loading-text">couldn't load details 🥺</p>}
            {!loading && details && !details.error && (
              <>
                <p className="section-title">🛒 ingredients</p>
                <ul className="ingredients">
                  {ingredients.map(ing => (
                    <li key={ing.id}>{ing.original}</li>
                  ))}
                </ul>
                <p className="section-title">👩‍🍳 steps</p>
                <ol className="steps">
                  {steps.length > 0
                    ? steps.map(s => <li key={s.number}>{s.step}</li>)
                    : <li><a href={recipe.sourceUrl} target="_blank" rel="noreferrer">view full recipe →</a></li>
                  }
                </ol>
              </>
            )}
            <span className="flip-hint">tap to go back 🔄</span>
          </div>
        </div>

      </div>
    </div>
  );
}
