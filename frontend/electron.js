const { app, BrowserWindow } = require ('electron'); // Import des 2 modules principaux d'Electron => App gère lancement, fermeture,etc et BrowserWindow qui crée une fenêtre qui affichera mon contenu HTML
const path = require('path'); // Import du module path de Node.js pour gérer les chemins proprement  

const createWindow = () => {  // Fonction createWindow => A appeler au démarrage => Fenêtre principale
    const win = new BrowserWindow({   // Instance de BrowserWindow => A ajuster selon ce que ça donne 
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false, // Pas essentiel mais bonne pratique sécurité => Désactive accès à Node.js depuis le front 
            contextIsolation: true, // Idem sécurité pour isoler mon contexte JS entre React et Electron 
        },
    });

win.loadURL('http://localhost:3000');  // Charge l'app React ici 

win.webContents.openDevTools();  // ouvre les devtools automatiquement 
};

app.whenReady().then(() => {   // Attends que Electron soit complètement prêt + exécute le code derrière
    createWindow();            // J'appelle ma fonction défini plus haut
    // Version MacOS, recrée une fenêtre si l'app est actif mais aucune fenêtre n'est ouverte
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();  // Permet de quitter l'appli + version MacOS intégré au cas oû 
});