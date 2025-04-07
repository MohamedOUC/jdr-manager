import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [monstres, setMonstres] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    console.log("API (env) :", process.env.REACT_APP_API_URL);

    axios.get('http://172.17.139.10:8000/monstres')
      .then(res => {
        console.log("Monstres chargés :", res.data);
        setMonstres(res.data);
      })
      .catch(err => {
        console.error("Erreur lors de la récupération :", err);
      });
  }, []);

  return (
    <div className="App">
      <h1>Carte de jeu</h1>
      <p>Nombre de monstres : {monstres.length}</p>

      <div className="carte">
        {monstres.map(monstre => (
          <div
            key={monstre.id}
            className="monstre"
            onClick={() => setSelected(monstre)}
            title={`Niveau ${monstre.niveau} - ${monstre.type}`}
          >
            <img
              src={`/images/${monstre.image}`}
              alt={monstre.nom}
              className="monstre-image"
            />
          </div>
        ))}
      </div>

      {selected && (
        <div className="fiche">
          <h2>{selected.nom} - Niveau {selected.niveau}</h2>

          <img 
            src={`/images/${selected.image}`} 
            alt={selected.nom} 
            style={{width: '100%', borderRadius: '12px', marginBottom: '1rem'}} 
          />

          <p>⚙️ <strong>Stats :</strong></p>
          <ul>
            <li>👁️ Vigilance : {selected.vigilance}</li>
            <li>⚡ Initiative : {selected.initiative}</li>
            {selected.initiative_bonus && (
              <li>🌀 {selected.initiative_bonus}</li>
            )}
          </ul>

          <p>❤️ PV Max : {selected.pv_max} | 🛡️ RES : {selected.res}</p>
          <p>🎖️ XP : {selected.xp} | 💰 Pièces : {selected.pieces}</p>

          <p>🗡️ <strong>Attaques :</strong></p>
          <ul>
            {selected.attaques.map((atk, index) => (
              <li key={index}>
                <strong>{atk.nom}</strong> - {atk.effet}
                {atk.fo && ` | FO: ${atk.fo}`}
                {atk.ad && ` | AD: ${atk.ad}`}
                {atk.limite && ` | Limite: ${atk.limite}`}
              </li>
            ))}
          </ul>

          <p>🎯 <strong>Capacités :</strong></p>
          <ul>
            {selected.capacites.map((cap, index) => (
              <li key={index}>
                <strong>{cap.nom}</strong> - {cap.effet}
                {cap.etat && ` | État: ${cap.etat}`}
              </li>
            ))}
          </ul>

          <p>{selected.description}</p>

          <button onClick={() => setSelected(null)}>Fermer</button>
        </div>
      )}
    </div>
  );
}

export default App;

