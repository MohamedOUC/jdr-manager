// components/ConsoleMonstre.jsx
import React from 'react';
import './ConsoleMonstre.css';

function ConsoleMonstre({ monstres, onDragStart }) {
  return (
    <div className="console-monstre">
      <h3>🎮 Console des Monstres</h3>
      <div className="liste-monstres">
        {monstres.map((monstre) => (
          <div
            key={monstre.id}
            className="carte-console"
            draggable
            onDragStart={() => onDragStart(monstre)}
            title={`Glisser ${monstre.nom} sur le plateau`}
          >
            <img src={`/images/${monstre.image}`} alt={monstre.nom} />
            <p>{monstre.nom}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConsoleMonstre;