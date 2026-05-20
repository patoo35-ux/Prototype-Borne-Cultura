//alert();

// Fonction pour charger les rayons automatiquement au démarrage
fetch('data/listeRayons.html') // 1. Va chercher le fichier externe
    .then(reponse => reponse.text()) // 2. Extrait le texte HTML qu'il contient
    .then(htmlOptions => {
        // 3. Injecte ce texte directement dans la datalist
        document.getElementById('suggestionsRayons').innerHTML = htmlOptions;
    })
    .catch(erreur => console.error("Erreur lors du chargement des rayons :", erreur));

// FONCTION RECHERCHER UN PRODUIT ----------------------------------------------------
function lancerRecherche() {
    const champSaisie = document.getElementById("saisieUtilisateur");
    const messageInfo = document.getElementById("messageInfo");
    
    // 1. Vérification si le champ est vide
    if (champSaisie.value === "") {
        messageInfo.textContent = "Quel rayon recherchez-vous ? ✍️";
        messageInfo.style.color = "orange";
        return; 
    }

    // 2. Nettoyage du texte (minuscules, espaces, accents)
    let texteTape = champSaisie.value
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

// 3. L'inspecteur part à la recherche dans la base de données 🔍
    
    // PRIORITÉ 1 : On cherche d'abord dans les noms de RAYONS
    let produitTrouve = produitsCultura.find(produit => {
        let nomRayon = produit.rayon.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return nomRayon.includes(texteTape);
    });

    // PRIORITÉ 2 : Si on n'a trouvé aucun rayon, on cherche dans les noms de PRODUITS
    if (!produitTrouve) {
        produitTrouve = produitsCultura.find(produit => {
            let nomProduit = produit.nom.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return nomProduit.includes(texteTape);
        });
    }

    // 4. Affichage et allumage
    if (produitTrouve) {
        fermerPopup(); // Ferme la fenêtre pour laisser voir le chemin !
        messageInfo.textContent = "Suivez le guide ! Direction le rayon : " + produitTrouve.rayon;
        messageInfo.style.color = "chocolate"; 

        // A. On nettoie l'ancienne recherche (on éteint tout) 🧽
        document.querySelectorAll(".trajetAllume").forEach(caseAllumee => {
            caseAllumee.classList.remove("trajetAllume");
        });

        // B. On allume la/les case(s) du produit 🎯
        let listeDesCasesProduit = produitTrouve.cases.split(",");
        listeDesCasesProduit.forEach(idDeLaCase => {
            let idPropre = idDeLaCase.trim(); 
            let caseSurLePlan = document.getElementById(idPropre);
            if (caseSurLePlan) {
                caseSurLePlan.classList.add("trajetAllume");
            }
        });

// On fait parler l'ordinateur dans la console (F12) :
console.log("Nom du rayon cherché :", produitTrouve.rayon);
console.log("Chemin trouvé dans le dictionnaire :", cheminsDuMagasin[produitTrouve.rayon]);


        // C. On allume le chemin pour y aller 🛣️
        let cheminAffiche = cheminsDuMagasin[produitTrouve.rayon];
        if (cheminAffiche) { // Si on a bien configuré un chemin pour ce rayon
            cheminAffiche.forEach(idCaseChemin => {
                let idPropreChemin = idCaseChemin.trim();
                let caseCouloir = document.getElementById(idPropreChemin);
                if (caseCouloir) {
                    caseCouloir.classList.add("trajetAllume");
                }
            });
        }

    } else {
        // Produit non trouvé
        messageInfo.textContent = "Produit non trouvé. Essayez un autre mot ! 🤷‍♂️";
        messageInfo.style.color = "chocolate"; 
    }
}


//Validation de la recherche avec la touche "Entrée
// 1. On cible le champ de texte
const champSaisieClavier = document.getElementById("saisieUtilisateur");

// 2. On ajoute un écouteur d'événement pour le clavier
champSaisieClavier.addEventListener("keydown", (event) => {
    // 3. On vérifie si la touche appuyée est bien "Entrée"
    if (event.key === "Enter") {
        lancerRecherche(); // On déclenche la recherche !
    }
});

// Fonction pour ouvrir la pop-up
function ouvrirPopup() {
    document.getElementById("popupRecherche").style.display = "flex";
}

// Fonction pour fermer la pop-up
function fermerPopup() {
    document.getElementById("popupRecherche").style.display = "none";
}

// Enregistrement du Service Worker pour rendre l'application installable
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
        .then(() => console.log("Application mobile prête à être installée !"))
        .catch((err) => console.error("Erreur application mobile :", err));
}
