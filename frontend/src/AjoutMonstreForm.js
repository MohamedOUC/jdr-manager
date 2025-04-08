import React, { useState } from 'react';
import axios from 'axios';
import './AjoutMonstreForm.css'; // Fichier CSS pour ce formulaire

function AjoutMonstreForm({ onClose, onMonstreAjoute }) {
    // Définir les champs avec certaines valeurs par défaut
    const [monstre, setMonstre] = useState({
        nom: '',
        niveau: 1,
        vigilance: 0,
        initiative: 0,
        initiative_bonus: '',
        pv_max: 10,
        res: 0,
        xp: 0,
        pieces: 0,
        // Pour l'instant les attaques et capacités sont laissée vide => ajout d'une gestion dynamique plus tard
        attaques: [],
        capacites: [],
        description: '',
        image: ''
    });

    const handleChange = (e) => {
        setMonstre({
            ...monstre,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Envoie la donnée vers le backend
            await axios.post('http://172.17.139.10:8000/monstres', {
                ...monstre,
                attaques: [],
                capacites: []
            });
            alert("✅ Monstre ajouté !");
            onMonstreAjoute(); // Refresh la liste des monstres
            onclose(); // Ferme le formulaire
        }   catch(err) {
            console.error("Erreur d'ajout :", err)
            alert("❌ Erreur lors de l'ajout.");
        }
    };

    return (
        <div className='console-form'>
            <h2>➕ Ajouter un Monstre</h2>
            <form onSubmit={handleSubmit}>
                <input
                    name='nom'
                    placeholder='Nom'
                    onChange={handleChange}
                    required
                />
                <input 
                    name='niveau'
                    type='number'
                    placeholder='Niveau'
                    onChange={handleChange}
                    required            
                />
                <input 
                    name='vigilance'
                    type='number'
                    placeholder='Vigilance'
                    onChange={handleChange}
                />
                <input 
                    name="initiative" 
                    type="number" 
                    placeholder="Initiative" 
                    onChange={handleChange}
                />
                <input 
                    name="initiative_bonus" 
                    placeholder="Bonus Initiative" 
                    onChange={handleChange} 
                />
                <input 
                    name="pv_max" 
                    type="number" 
                    placeholder="PV max" 
                    onChange={handleChange} 
                />
                <input 
                    name="res" 
                    type="number" 
                    placeholder="Résistance" 
                    onChange={handleChange} 
                />
                <input 
                    name="xp" 
                    type="number" 
                    placeholder="XP" 
                    onChange={handleChange} 
                />
                <input 
                    name="pieces" 
                    type="number" 
                    placeholder="Pièces" 
                    onChange={handleChange} 
                />
                <textarea 
                    name="description" 
                    placeholder="Description" 
                    onChange={handleChange}
                ></textarea>
                <input 
                    name="image" 
                    placeholder="Nom de l'image (ex: ratmolech.png)" 
                    onChange={handleChange}
                />
                <div className='form-buttons'>
                    <button type='submit'>Ajouter</button>
                    <button type='button' onClick={onClose}>Annuler</button>
                </div>
            </form>
        </div>
    );
}

export default AjoutMonstreForm;