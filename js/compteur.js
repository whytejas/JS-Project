// Créer une classe Compteur //
class Compteur {

    constructor(carte, delai) {

        this.carte = carte;
        this.delai = delai;

        // Récupérer les elements HTML //
        this.reserveInfoElt = document.querySelector(".reserveInfo");
        this.compteurElt = document.createElement("span");
        this.reserveInfoElt.appendChild(this.compteurElt);

        // Récupérer l'heure actuelle et calculer l'heure d'expiration//
        let timeStamp = new Date().getTime();
        this.timeStampNow = Math.floor(timeStamp / 1000);
        this.timeStampExpiration = this.timeStampNow + (this.delai * 60);

        // Enregistrer l'heure de la réservation et l'heure d'expiration//
        this.tempsDataElt = sessionStorage.setItem("temps", JSON.stringify({ reservation: this.timeStampNow, expiration: this.timeStampExpiration }));

        // Lancer le décompteur//
        this.animationDecompteur();

        // Fin du Constructor //

    }

    animationDecompteur() {
        setInterval(this.decompteur.bind(this), 1000)
    }


    decompteur() {

        // Augmenter l'heure actuelle par une seconde et calculer le delai//
        this.timeStampNow = this.timeStampNow + 1;
        this.timeRemaining = Number(this.timeStampExpiration - this.timeStampNow);

        // Afficher le delai en minutes et secondes//
        this.compteurElt.textContent = Math.floor(this.timeRemaining / 60) + " minute(s) et " + Math.floor(this.timeRemaining % 60) + " seconde(s)";

        // Session Terminée//
        if (this.timeRemaining <= 0) {
            clearInterval(this.decompteur);
            this.reserveInfoElt.textContent = "Votre dernière session a expirée !";
        }


    }

}