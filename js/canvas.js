// Créer une classe Canvas //

class Canvas {

    constructor(carte) {

        this.carte = carte;

        // Afficher le Canvas et le bouton "Signer" //
        this.carte.formElt.style.display = "none";
        this.carte.signElt.style.display = "block";
        this.carte.signBtn.style.display = "block";
        this.carte.clearBtn.style.display = "block";

        this.ctx = this.carte.signElt.getContext('2d');

        window.addEventListener('resize', () => { this.resizeCanvas() });
        window.addEventListener('orientationchange', () => { this.resizeCanvas() })

        this.carte.clearBtn.addEventListener("click", () => { this.effacer() });
        this.signer();

        // Fin du Constructor //

    }

    resizeCanvas() {

        this.carte.signElt.width = window.innerWidth;
        this.carte.signElt.height = window.innerHeight;

    }

    // Effacer le contenu existant du canvas //
    effacer() {

        this.isSigned = false;
        this.ctx.clearRect(0, 0, this.carte.signElt.width, this.carte.signElt.height);

    }


    signer() {

        this.effacer();
        // Ajouter les events //
        this.carte.signElt.addEventListener('mousedown', (e) => { this.setPosition(e) });
        this.carte.signElt.addEventListener('mouseup', () => { this.stop() });
        this.carte.signBtn.addEventListener("click", () => { this.gestionSignature() });

    }


    // Annuler la fonction //
    stop() {

        this.mouseIsDown = false;

    }

    // Chercher la position de la souris //
    setPosition(e) {

        this.mouseIsDown = true;
        this.ctx.beginPath();
        this.ctx.moveTo(e.offsetX, e.offsetY);

        // Ajouter un event pour commencer à dessiner lorsq'on deplace la souris //
        this.carte.signElt.addEventListener('mousemove', (e) => { this.draw(e) });

    }


    // Dessiner avec la souris //
    draw(e) {

        if (this.mouseIsDown) {
            this.ctx.lineWidth = 3;
            this.ctx.lineCap = 'round';
            this.ctx.strokeStyle = 'yellow';
            this.ctx.lineTo(e.offsetX, e.offsetY);
            this.ctx.stroke();
            this.isSigned = true;

        }

    }


    // Gestion du bouton après la signature //
    gestionSignature() {

        if (this.isSigned) {
            // Afficher un panneau contenant les nouveaux détails //
            this.carte.afficherPanneau();

            // Masquer le canvas //
            this.carte.signElt.style.display = "none";
            this.carte.signBtn.style.display = "none";
            this.carte.clearBtn.style.display = "none";

            // Afficher un nouveau div contenant les infos de la réservation actuelle //
            this.carte.reserveInfoElt.innerHTML = "Vélo réservé à la station:<br> " + this.carte.currentstation.name.toUpperCase() + "  <br><br> par  " + this.carte.donnees.prenom + "  " + this.carte.donnees.nom.toUpperCase() + "<br><br> Temps restant : ";

            // Initier un nouvel instant de  l'objet Compteur avec delai de 20 minutes//
            this.compteur = new Compteur(this, 20);
        }

        else {
            alert("Vous devez signer afin de compléter votre réservation !");
        }
    }

}