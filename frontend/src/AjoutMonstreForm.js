import React, { useState } from 'react';
import axios from 'axios';
import './AjoutMonstreForm.css';

function AjoutMonstreForm({ onClose, onMonstreAjoute }) {
  // État initial du monstre avec les champs de base
  const [monstre, setMonstre] = useState({
    nom: '',
    niveau: 1,
    pv_max: 10,
    res: 0,
    initiative: 0,
    initiative_bonus: '',
    fo: 0,
    ad: 0,
    mag: 0,
    xp: 0,
    pieces: 0,
    image: '',
    attaques: [],
    capacites: [],
    stats_flexibles: {}
  });

  // Ajouter une nouvelle stat flexible(
  const [newStatName, setNewStatName] = useState('');
  const [newStatValue, setNewStatValue] = useState('');

  const handleAddFlexibleStat = () => {
    if (newStatName) {
        setMonstre(prev => ({
            ...prev,
            stats_flexibles: {
                ...prev.stats_flexibles,
                [newStatName]: parseInt(newStatValue || "0", 10)
            }
        }));
        setNewStatName('');
        setNewStatValue('');
    }
  };

  const handleRemoveFlexibleStat = (stat) => {
    setMonstre(prev => {
        const copy = { ...prev.stats_flexibles };
        delete copy[stat];
        return { ...prev, stats_flexibles: copy};
    });
  };


  // -------------------------
  //  GESTION DES ATTAQUES
  // -------------------------
  const handleAddAttaque = () => {
    setMonstre((prev) => ({
      ...prev,
      attaques: [
        ...prev.attaques,
        { nom: '', degats: '', effet: '', limite: '' }
      ]
    }));
  };

  const handleChangeAttaque = (index, field, value) => {
    setMonstre((prev) => {
      const newAttaques = [...prev.attaques];
      newAttaques[index] = {
        ...newAttaques[index],
        [field]: value
      };
      return { ...prev, attaques: newAttaques };
    });
  };

  const handleRemoveAttaque = (index) => {
    setMonstre((prev) => {
      const newAttaques = [...prev.attaques];
      newAttaques.splice(index, 1);
      return { ...prev, attaques: newAttaques };
    });
  };

  // -------------------------
  //  GESTION DES CAPACITÉS
  // -------------------------
  const handleAddCapacite = () => {
    setMonstre((prev) => ({
      ...prev,
      capacites: [
        ...prev.capacites,
        { nom: '', effet: '', limite: '' }
      ]
    }));
  };

  const handleChangeCapacite = (index, field, value) => {
    setMonstre((prev) => {
      const newCaps = [...prev.capacites];
      newCaps[index] = {
        ...newCaps[index],
        [field]: value
      };
      return { ...prev, capacites: newCaps };
    });
  };

  const handleRemoveCapacite = (index) => {
    setMonstre((prev) => {
      const newCaps = [...prev.capacites];
      newCaps.splice(index, 1);
      return { ...prev, capacites: newCaps };
    });
  };

  // -------------------------
  //  GESTION DES CHAMPS SIMPLES
  // -------------------------
  const handleChange = (e) => {
    setMonstre({
      ...monstre,
      [e.target.name]: e.target.value
    });
  };

  // -------------------------
  //  ENVOI DU FORMULAIRE
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clone de l'objet
    const monstreAEnvoyer = { ...monstre};

    // Si le champ est vide, on l'enlève ou on le met à null
    if (!monstreAEnvoyer.initiative_bonus) {
        monstreAEnvoyer.initiative_bonus = null;  // ou monstreAEnvoyer.initiative_bonus = null ;
    }

    try {
      // Envoie de l'objet monstre au backend
      await axios.post('http://172.17.139.10:8000/monstres', monstreAEnvoyer);
      alert("✅ Monstre ajouté !");
      onMonstreAjoute(); // Rafraîchit la liste dans l'UI parent
      onClose();         
    } catch (err) {
      console.error("Erreur d'ajout :", err);
      alert("❌ Erreur lors de l'ajout.");
    }
  };

  return (
    <div className="console-form">
      <h2>➕ Ajouter un Monstre</h2>
      <form onSubmit={handleSubmit}>
        {/* Champs de base */}
        <input name="nom" placeholder="Nom" onChange={handleChange} required />
        <input name="niveau" type="number" placeholder="Niveau" onChange={handleChange} required />
        <input name="pv_max" type="number" placeholder="PV Max" onChange={handleChange} required />
        <input name="res" type="number" placeholder="Résistance" onChange={handleChange} required />
        <input name="initiative" type="number" placeholder="Initiative" onChange={handleChange} required />
        <input name="initiative_bonus" type="string" placeholder="Bonus d'Initiative (laissé vide si aucun)" onChange={handleChange} required />
        <input name="fo" type="number" placeholder="Force (FO)" onChange={handleChange} required />
        <input name="ad" type="number" placeholder="Adresse (AD)" onChange={handleChange} required />
        <input name="mag" type="number" placeholder="Magie (MAG)" onChange={handleChange} required />
        <input name="xp" type="number" placeholder="XP" onChange={handleChange} required />
        <input name="pieces" type="number" placeholder="Pièces" onChange={handleChange} required />
        <input name="image" placeholder="Nom de l'image (ex: ratmolech.png)" onChange={handleChange} />

        {/* ----------------- ATTAQUES ----------------- */}
        <h3>Attaques</h3>
        {monstre.attaques.map((atk, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', margin: '0.5rem 0' }}>
            <input
              placeholder="Nom"
              value={atk.nom}
              onChange={(e) => handleChangeAttaque(idx, 'nom', e.target.value)}
            />
            <input
              placeholder="Dégâts"
              value={atk.degats}
              onChange={(e) => handleChangeAttaque(idx, 'degats', e.target.value)}
            />
            <input
              placeholder="Effet"
              value={atk.effet}
              onChange={(e) => handleChangeAttaque(idx, 'effet', e.target.value)}
            />
            <input
              placeholder="Limite"
              value={atk.limite}
              onChange={(e) => handleChangeAttaque(idx, 'limite', e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveAttaque(idx)}>Suppr</button>
          </div>
        ))}
        <button type="button" onClick={handleAddAttaque}>+ Ajouter une Attaque</button>

        {/* ----------------- CAPACITÉS ----------------- */}
        <h3>Capacités</h3>
        {monstre.capacites.map((cap, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', margin: '0.5rem 0' }}>
            <input
              placeholder="Nom"
              value={cap.nom}
              onChange={(e) => handleChangeCapacite(idx, 'nom', e.target.value)}
            />
            <input
              placeholder="Effet"
              value={cap.effet}
              onChange={(e) => handleChangeCapacite(idx, 'effet', e.target.value)}
            />
            <input
              placeholder="Limite"
              value={cap.limite}
              onChange={(e) => handleChangeCapacite(idx, 'limite', e.target.value)}
            />
            <button type="button" onClick={() => handleRemoveCapacite(idx)}>Suppr</button>
          </div>
        ))}
        <button type="button" onClick={handleAddCapacite}>+ Ajouter une Capacité</button>

        {/* ----------------- STATS FLEXIBLES ----------------- */}
        <h3>Stats Flexibles (optionnelles)</h3>
        {Object.entries(monstre.stats_flexibles).map(([key, value]) => (
            <div key={key}>
                <strong>{key}</strong>: {value}
                <button type='button' onClick={() => handleRemoveFlexibleStat(key)}>Suppr</button>
            </div>
        ))}

        <div style={{ display: 'flex', gap: '0.5rem', marginBottom:'1rem'}}>
            <input
                type='text'
                placeholder='Nom de la stat (ex: chance)'
                value={newStatName}
                onChange={(e) => setNewStatName(e.target.value)}
            />
            <input
                type='number'
                placeholder='Valeur'
                value={newStatValue}
                onChange={(e) => setNewStatValue(e.target.value)}
            />
            <button type='button' onClick={handleAddFlexibleStat}>+ Ajouter</button>
        </div>

        {/* ----------------- BOUTONS ENVOI ----------------- */}
        <div style={{ marginTop: '1rem' }}>
          <button type="submit">Ajouter</button>
          <button type="button" onClick={onClose}>Annuler</button>
        </div>
      </form>
    </div>
  );
}

export default AjoutMonstreForm;