import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AjoutMonstreForm from './AjoutMonstreForm';
import './App.css';
import DiceD20 from './components/DiceD20';
import './components/DiceD20.css';

// -----------------------------------------------
//        GESTION DU LANCER DE DÉ MULTIPLE
// -----------------------------------------------

// Fonction pour remplacer les stats dans les formules
function remplacerStats(formule, stats) {
  return formule.replace(/\b[A-Z_]+\b/g, (token) => stats[token] ?? token);
}

// Fonction qui gère plusieurs jets (1d6 + 1d4 + FO)
function lancerDes(formule) {
  const parts = formule.split('+').map(p => p.trim());
  let total = 0;
  let details = [];

  for (let part of parts) {
    const match = part.match(/(\d+)d(\d+)/);
    if (match) {
      const [, countStr, facesStr] = match;
      const count = parseInt(countStr);
      const faces = parseInt(facesStr);
      let rolls = [];
      for (let i = 0; i < count; i++) {
        const roll = Math.floor(Math.random() * faces) + 1;
        total += roll;
        rolls.push(roll);
      }
      details.push(`${count}d${faces} = [${rolls.join(', ')}]`);
    } else if (!isNaN(parseInt(part))) {
      const bonus = parseInt(part);
      total += bonus;
      details.push(`${bonus}`);
    }
  }

  return { total, details };
}

// Composant popup pour afficher les résultats de jet
function DicePopup({ visible, onClose, resultat, formule }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="dice-popup"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
        >
          <DiceD20 rolledValue={resultat.total} />

          <h3>🎲 Jet de dé</h3>
          <p><strong>{formule}</strong></p>
          <p>Résultat : <strong>{resultat.total}</strong></p>
          <p>Détails : {resultat.details.join(' + ')}</p>

          <button onClick={onClose}>Fermer</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function App() {
  const [monstres, setMonstres] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [formuleUsed, setFormuleUsed] = useState('');

  const chargerMonstres = () => {
    axios
      .get('http://172.17.139.10:8000/monstres')
      .then((res) => setMonstres(res.data))
      .catch((err) => console.error('Erreur lors de la récupération :', err));
  };

  useEffect(() => {
    chargerMonstres();
  }, []);

  const handleJet = (formule, stats) => {
    const res = lancerDes(remplacerStats(formule, stats));
    setFormuleUsed(formule);
    setDiceResult(res);
    setPopupVisible(true);
  };
  const modifierStat = (key, delta) => {
    setSelected((prev) => ({ ...prev, [key]: prev[key] + delta }));
  };

  return (
    <div className="App">
      <h1>Carte de jeu</h1>
      <button onClick={() => setShowForm(true)}>➕ Ajouter un monstre</button>

      <div className="carte">
        {monstres.map((monstre) => (
          <div
            key={monstre.id}
            className="monstre"
            onClick={() => setSelected(monstre)}
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
        <motion.div className="fiche" drag dragMomentum={false}>
          <h2>🐀 {selected.nom} - Niveau {selected.niveau}</h2>
          <img
            src={`/images/${selected.image}`}
            alt={selected.nom}
          />

          <p>📊 <strong>Stats :</strong></p>
          <ul>
            <li>⚡ Initiative : {selected.initiative}
              <button onClick={() => modifierStat('initiative', -1)}>-</button>
              <button onClick={() => modifierStat('initiative', 1)}>+</button>
            </li>
            {selected.initiative_bonus && <li>🌀 {selected.initiative_bonus}</li>}
            <li>❤️ PV Max : {selected.pv_max}
              <button onClick={() => modifierStat('pv_max', -1)}>-</button>
              <button onClick={() => modifierStat('pv_max', 1)}>+</button>
            </li>
            <li>🛡️ Résistance : {selected.res}
              <button onClick={() => modifierStat('res', -1)}>-</button>
              <button onClick={() => modifierStat('res', 1)}>+</button>
            </li>
            <li>💪 FO : {selected.fo}
              <button onClick={() => modifierStat('fo', -1)}>-</button>
              <button onClick={() => modifierStat('fo', 1)}>+</button>
            </li>
            <li>🏃‍♂️ AD : {selected.ad}
              <button onClick={() => modifierStat('ad', -1)}>-</button>
              <button onClick={() => modifierStat('ad', 1)}>+</button>
            </li>
            <li>🔥 MAG : {selected.mag}
              <button onClick={() => modifierStat('mag', -1)}>-</button>
              <button onClick={() => modifierStat('mag', 1)}>+</button>
            </li>
            <li>🎖️ XP : {selected.xp}
              <button onClick={() => modifierStat('xp', -1)}>-</button>
              <button onClick={() => modifierStat('xp', 1)}>+</button>
            </li>
            <li>💰 Pièces : {selected.pieces}
              <button onClick={() => modifierStat('pieces', -1)}>-</button>
              <button onClick={() => modifierStat('pieces', 1)}>+</button>
            </li>

            {selected.stats_flexibles &&
              Object.entries(selected.stats_flexibles).map(([key, val]) => (
                <li key={key}>🧩 {key} : {val}
                  <button onClick={() =>
                    setSelected((prev) => ({
                      ...prev,
                      stats_flexibles: {
                        ...prev.stats_flexibles,
                        [key]: val - 1
                      }
                    }))
                  }>-</button>
                  <button onClick={() =>
                    setSelected((prev) => ({
                      ...prev,
                      stats_flexibles: {
                        ...prev.stats_flexibles,
                        [key]: val + 1
                      }
                    }))
                  }>+</button>
                </li>
              ))}
          </ul>

          <p>⚔️ <strong>Attaques :</strong></p>
          <ul>
            {selected.attaques.map((atk, index) => {
              const allStats = {
                FO: selected.fo,
                AD: selected.ad,
                MAG: selected.mag,
                ...(selected.stats_flexibles || {})
              };
              const formuleAffichee = remplacerStats(atk.degats, allStats);
              return (
                <li key={index}>
                  <strong>🗡️ {atk.nom}</strong> – Dégâts : <code>{formuleAffichee}</code>
                  {atk.effet && <> | 🌀 Effet : {atk.effet}</>}
                  {atk.limite && <> | ⏳ Limite : {atk.limite}</>}
                  <button
                    onClick={() => {
                      const stats = {
                        FO: selected.fo,
                        AD: selected.ad,
                        MAG: selected.mag,
                        ...(selected.stats_flexibles || {})
                      };
                      handleJet(atk.degats, stats)
                    }}
                  >🎲</button>
                </li>
              );
            })}
          </ul>

          <p>🎯 <strong>Capacités :</strong></p>
          <ul>
            {selected.capacites.map((cap, index) => (
              <li key={index}>
                <strong>✅ {cap.nom}</strong> – {cap.effet}
                {cap.limite && <> | ⏳ Limite : {cap.limite}</>}
              </li>
            ))}
          </ul>

          <button onClick={() => setSelected(null)}>Fermer</button>
        </motion.div>
      )}

      {/* Popup intégrée ici */}
      <DicePopup
        visible={popupVisible}
        resultat={diceResult}
        formule={formuleUsed}
        onClose={() => setPopupVisible(false)}
      />

      {showForm && (
        <div className="form-container">
          <AjoutMonstreForm
            onClose={() => setShowForm(false)}
            onMonstreAjoute={chargerMonstres}
          />
        </div>
      )}
    </div>
  );
}

export default App;