import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import AjoutMonstreForm from './AjoutMonstreForm';
import './App.css';
import DiceD20 from './components/DiceD20';
import './components/DiceD20.css';
import ConfirmationModal from './ConfirmationModal';

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
  const [MonstresPlateau, setMonstresPlateau] = useState([]);
  const [monstresStockes, setMonstresStockes] = useState([]);
  const [selectedMonstres, setSelectedMonstres] = useState([])
  const [showForm, setShowForm] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [diceResult, setDiceResult] = useState(null);
  const [formuleUsed, setFormuleUsed] = useState('');
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [monstreToDeleteIndex, setMonstreToDeleteIndex] = useState(null);
  const [monstreOptionsId, setMonstreOptionsId] = useState(null);
  const [monstreEnEdition, setMonstreEnEdition] = useState(null);

  // Chargement des monstres du plateau au démarrage
  useEffect(() => {
    axios.get("http://localhost:8000/monstres-plateau/board-monstres")
      .then(res => setMonstresPlateau(res.data))
      .catch(err => console.error("Erreur board :", err));
  }, []);

 // Monstres stockés (base)
  useEffect(() => {
    axios.get("http://localhost:8000/monstres-stockes")
      .then(res => setMonstresStockes(res.data))
      .catch(err => console.error("Erreur stock :", err));
  }, []);

  const handleJet = (formule, stats) => {
    const res = lancerDes(remplacerStats(formule, stats));
    setFormuleUsed(formule);
    setDiceResult(res);
    setPopupVisible(true);
  };

  // Ouvrir une fiche
  const handleOpenFiche = (monstre, index) => {
    const idTemp = `${monstre.id}-${index}`; // Pour distinguer les duplicatas
    if (!selectedMonstres.some(m => m._uid === idTemp)) {
      setSelectedMonstres(prev => [
        ...prev, 
        { ...monstre, _uid: idTemp, _index: index}]);
    }
  };

  // Fermer une fiche
  const handleCloseFiche = (uid) => {
    setSelectedMonstres(prev => prev.filter(m => m._uid !== uid));
  };

  // Modifier les stats d'un monstre spécifique
  const modifierStat = (uid, key, delta) => {
    setSelectedMonstres(prev => 
      prev.map(m => 
        m._uid === uid ? { ...m, [key]: m[key] + delta} : m
      )
    );

    setMonstresPlateau(prev =>
      prev.map((m, i) => {
        const fiche = selectedMonstres.find(f => f._uid === uid);
        if (!fiche || fiche._index !== i) return m;
        return { ...m, [key]: m[key] + delta};
      })
    );
};

  // Pour les stats flexibles => Meilleure agencement pour plus tard
  const modifierFlexibleStat = (uid, key, delta) => {
    setSelectedMonstres(prev =>
      prev.map(monstre => {
        if (monstre._uid !== uid) return monstre;
        return {
          ...monstre,
          stats_flexibles: {
            ...monstre.stats_flexibles,
            [key]: monstre.stats_flexibles[key] + delta
          }
        };
      })
    );

    setMonstresPlateau(prev => 
      prev.map((m, i) => {
        const fiche = selectedMonstres.find(f => f._uid === uid);
        if (!fiche || fiche._index !== i) return m;
        return {
          ...m,
          stats_flexibles: {
            ...m.stats_flexibles,
            [key]: m.stats_flexibles[key] + delta
          }
        };
      })
    );
  };

  // Handlers pour les monstres stockés (edit, supprimer, etc...)
  const handleEditMonstre = (monstre) => {
      setMonstreEnEdition(monstre);
      setShowForm(true);
  };
  
  const handleDuplicateMonstre =(monstre) => {
    const copie = { ...monstre, id: Date.now() };
    setMonstresStockes(prev => [...prev, copie]);
    setMonstreOptionsId(null);
  };

  const handleDeleteMonstre = async (id) => {
    try {
      await axios.delete (`http://localhost:8000/monstres-stockes/${id}`);
      setMonstresStockes(prev => prev.filter(m => m.id !== id));
      setMonstreOptionsId(null);
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
      alert("❌ La suppression a échoué !")
    }
  };

  return (
    <div className="App">
      <h1>Carte de jeu</h1>
      <button onClick={() => setShowForm(true)}>➕ Ajouter un monstre</button>

      <div className="console">
        {monstresStockes.map((m) => (
          <div key={m.id} className="monstre-stocke" draggable onDragStart={(e) => e.dataTransfer.setData("monstre", JSON.stringify(m))}>
            <img src={`/images/${m.image}`} alt={m.nom} />
            <p>{m.nom}</p>

            <button 
              className="monstre-options-button"
              onClick={(e) => {
                e.stopPropagation();
                setMonstreOptionsId(m.id);
              }}
            >
              ⋮ 
            </button>

            {monstreOptionsId === m.id && (
              <div className='monstre-options-menu'>
                <div onClick={() => handleEditMonstre(m)}>✏️ Modifier</div>
                <div onClick={() => handleDuplicateMonstre(m)}>📋 Dupliquer</div>
                <div onClick={() => handleDeleteMonstre(m.id)}>❌ Supprimer</div>
                <div onClick={() => alert(JSON.stringidy(m, null,2))}>🧠 Voir JSON</div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div
        className="carte"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          const monstre = JSON.parse(e.dataTransfer.getData("monstre"));
          setMonstresPlateau(prev => [...prev, monstre]);
        }}
      >
        {MonstresPlateau.map((monstre, index) => (
          <div key={index} className="monstre" style={{ position: 'relative'}}>
            <img
              src={`/images/${monstre.image}`}
              alt={monstre.nom}
              className='monstre-image'
              onClick={() => handleOpenFiche(monstre, index)}
            />
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setMonstreToDeleteIndex(index);
                setConfirmVisible(true);
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                background: 'red',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                cursor: 'pointer',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                lineHeight: '20px',
                padding: 0
              }}
            >
              x
            </button>
          </div>
        ))}
      </div>

      {selectedMonstres.map((monstre) => (
        <motion.div key={monstre._uid} className="fiche" drag dragMomentum={false}>
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <img src={`/images/${monstre.image}`} alt={monstre.nom} style={{ width: '80px', marginRight: '1rem' }} />
            
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <h2 style={{ margin: 0}}> {monstre.nom} – Niveau {monstre.niveau}</h2>
              </div>
              <div className="stats-grid"> 
                {[
                  { key: 'initiative', label: '⚡', name: 'INIT' },
                  { key: 'pv_max', label: '❤️', name: 'PV' },
                  { key: 'res', label: '🛡️', name: 'RES' },
                  { key: 'fo', label: '💪', name: 'FO' },
                  { key: 'ad', label: '🏃‍♂️', name: 'AD' },
                  { key: 'mag', label: '🔥', name: 'MAG' },
                  { key: 'xp', label: '🎖️', name: 'XP' },
                  { key: 'pieces', label: '💰', name: 'PO' }
                ].map(stat => (
                  <div key={stat.key} className="stat-item">
                    <span>{stat.label} {stat.name} : {monstre[stat.key]}</span>
                    <button onClick={() => modifierStat(monstre._uid, stat.key, -1)}>-</button>
                    <button onClick={() => modifierStat(monstre._uid, stat.key, 1)}>+</button>
                  </div>
                ))}
              </div>

              {monstre.initiative_bonus && <p>🌀 {monstre.initiative_bonus}</p>}
            </div>
          </div>

          {monstre.stats_flexibles && Object.entries(monstre.stats_flexibles).length > 0 && (
            <>
              <p style={{ margin: '0.5rem 0 0.2rem' }}>🧩 Flexibles :</p>
              <div className="stats-compact">
                {Object.entries(monstre.stats_flexibles).map(([key, val]) => (
                  <div key={key} className="stat-block">
                    <span>{key} : {val}</span>
                    <div>
                      <button onClick={() => modifierFlexibleStat(monstre._uid, key, -1)}>-</button>
                      <button onClick={() => modifierFlexibleStat(monstre._uid, key, 1)}>+</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          <p><strong>⚔️ Attaques :</strong></p>
          <ul>
            {monstre.attaques.map((atk, index) => {
              const stats = {
                FO: monstre.fo,
                AD: monstre.ad,
                MAG: monstre.mag,
                ...(monstre.stats_flexibles || {})
              };
              const formuleAffichee = remplacerStats(atk.degats, stats);
              return (
                <li key={index}>
                   {atk.nom} – <code>{formuleAffichee}</code>
                  {atk.effet && <> | 🌀 {atk.effet}</>}
                  {atk.limite && <> | ⏳ {atk.limite}</>}
                  <button onClick={() => handleJet(atk.degats, stats)}>🎲</button>
                </li>
              );
            })}
          </ul>

          <p><strong>🎯 Capacités :</strong></p>
          <ul>
            {monstre.capacites.map((cap, index) => (
              <li key={index}>
                ✅ {cap.nom} – {cap.effet}
                {cap.limite && <> | ⏳ {cap.limite}</>}
              </li>
            ))}
          </ul>

          <button onClick={() => handleCloseFiche(monstre._uid)}>Fermer</button>
        </motion.div>
      ))}

      <DicePopup
        visible={popupVisible}
        resultat={diceResult}
        formule={formuleUsed}
        onClose={() => setPopupVisible(false)}
      />

      {showForm && (
        <div className="form-container">
          <AjoutMonstreForm
            monstre={monstreEnEdition} // pré-remplissage si édition
            onClose={() => {
              setShowForm(false);
              setMonstreEnEdition(null);
            }}
            onMonstreAjoute={(monstreRecu) => {
              setMonstresStockes(prev => {
                const exists = prev.some(m => m.id === monstreRecu.id);
                return exists
                  ? prev.map(m => m.id === monstreRecu.id ? monstreRecu: m)
                  : [...prev, monstreRecu];
              });
            }}
          />
        </div>
      )}

      <ConfirmationModal
        visible={confirmVisible}
        message="❌ Supprimer ce monstre du plateau ?"
        onConfirm={() => {
          setMonstresPlateau(prev => prev.filter((_, i) => i !== monstreToDeleteIndex));
          setConfirmVisible(false);
          setMonstreToDeleteIndex(null);
        }}
        onCancel={() => {
          setConfirmVisible(false);
          setMonstreToDeleteIndex(null);
        }}
      />
    </div>
  );
}

export default App;