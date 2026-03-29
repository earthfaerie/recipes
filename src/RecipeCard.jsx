import React, { useState } from 'react';

export default function RecipeCard({ recipe }) {
  const [flipped, setFlipped] = useState(false);

  // Edamam recipe shape
  const title = recipe.label;
  const image = recipe.image;
  const time = recipe.totalTime;
  const url = recipe.url;
  const ingredients = recipe.ingredientLines ?? [];
  const source = recipe.source;

  return (
    <div className={`flip-card ${flipped ? 'is-flipped' : ''}`} onClick={() => setFlipped(f => !f)}>
      <div className="flip-inner">

        {/* FRONT */}
        <div className="flip-front">
          <img src={image} alt={title} />
          <div className="card-body">
            <h3>{title}</h3>
            <p className="time">
              {time ? `⏱ ${time} min` : `📖 ${source}`}
            </p>
            <span className="flip-hint">tap to see recipe ✨</span>
          </div>
        </div>

        {/* BACK */}
        <div className="flip-back">
          <div className="flip-back-inner">
            <h3>{title}</h3>
            <p className="section-title">🛒 ingredients</p>
            <ul className="ingredients">
              {ingredients.map((line, i) => <li key={i}>{line}</li>)}
            </ul>
            <p className="section-title">👩‍🍳 full recipe</p>
            <p style={{ fontSize: '0.82rem', color: '#666' }}>
              steps are on the original site —{' '}
              <a href={url} target="_blank" rel="noreferrer">view on {source} →</a>
            </p>
            <span className="flip-hint">tap to go back 🔄</span>
          </div>
        </div>

      </div>
    </div>
  );
}
