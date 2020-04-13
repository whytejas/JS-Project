// Créer une classe Carte //

class Carte {

    constructor(idCarte) {

        // Récupérer les elements HTML //
        this.carteElt = document.getElementById(idCarte);
        this.panneauElt = this.carteElt.querySelector(".panneau");
        this.formElt = this.panneauElt.querySelector("form");
        this.reserverBtn = this.panneauElt.querySelector('input[type="button"]');
        this.signElt = this.carteElt.querySelector("canvas");
        this.signBtn = this.carteElt.querySelector(".signBtn");
        this.clearBtn = this.carteElt.querySelector(".clearBtn");
        this.reserveInfoElt = this.carteElt.querySelector(".reserveInfo");
        this.compteurElt = document.createElement("span");
        this.reserveInfoElt.appendChild(this.compteurElt);
        this.currentstation = null;


        // Gestion du localStorage //
        this.donnees = { nom: "", prenom: "" };

        if (localStorage.noms != undefined) {
            this.donnees = JSON.parse(localStorage.noms)
        }

        // Gestion du sessionStorage //
        this.temps = { reservation: "", expiration: "" };

        if (sessionStorage.temps != undefined) {
            this.temps = JSON.parse(sessionStorage.temps);
        }

        // L'heure actuelle en secondes //
        this.heureActuelle = Math.floor((new Date().getTime()) / 1000);

        // Si la dernière réservation n'est pas expiréé, montrer le temps qui reste //
        if (this.heureActuelle < this.temps.expiration) {
            this.newDelai = (Number(this.temps.expiration - this.heureActuelle) / 60);
            // Initier un nouvel instant de l'objet Compteur avec le temps qui reste // 
            this.compteur = new Compteur(this, this.newDelai);

            // Afficher le delai en minutes et secondes//
            this.compteurElt.textContent = "Temps restant avant la fin de votre dernière réservation : ";

        }

        // Construire une Carte avec l'API Leaflet //
        this.mymap = L.map(this.carteElt.querySelector("#mapid")).setView([45.764, 4.835], 15);
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
            maxZoom: 20,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoieXRlamFzIiwiYSI6ImNqeWVmbjRxaTBhaWozY3FxODBvYXE3NWwifQ.VmmZ3NTMf76gqysyPb_Y3g'
        }).addTo(this.mymap);


        // Récupérer les données de l'API JCDecaux pour Lyon //

        // Initier un nouvel instant de l'objet AjaxGet // 
        this.ajaxGet = new Ajax("https://api.jcdecaux.com/vls/v1/stations?contract=lyon&apiKey=ecf4abad642df082886596aff1b08855d8486b76", (reponse) => {

            this.stations = JSON.parse(reponse);
            this.stations.forEach((station) => {

                // Ajouter un marquer //
                this.marker = L.marker([station.position.lat, station.position.lng]).addTo(this.mymap);
                this.marker.station = station;

                // Ajouter un event lorsqu'on clique sur le marquer //
                this.marker.on('click', (e) => { this.onMarkerClick(e) });

            })

        });

        // Fin du Constructor //
    }

    // Gestion du marquer //
    onMarkerClick(e) {

        // Chercher la station associée à ce marquer //
        let station = e.target.station;
        this.currentstation = station;

        // Afficher un panneau contenant les détails de la station + un formulaire; masquer le reste //
        this.formElt.style.display = "";
        this.signElt.style.display = "none";
        this.afficherPanneau();
        this.panneauElt.style.opacity = "1";

        // Utiliser le localStorage pour pré-remplir les champs //
        this.nomPrecedent = this.panneauElt.querySelector(".nom");
        this.prenomPrecedent = this.panneauElt.querySelector(".prenom");
        this.nomPrecedent.value = this.donnees.nom;
        this.prenomPrecedent.value = this.donnees.prenom;

        // Ajouter un event lorsqu'on clique sur le bouton "Réserver" //
        this.reserverBtn.addEventListener("click", (e) => { this.gestionFormulaire(e) });

    }

    // Gestion de la soumission du formulaire //
    gestionFormulaire(e) {

        e.preventDefault();

        // Vérification des données du formulaire: nom et prénom sont remplis avec des lettres //
        this.regExp = /^[a-zA-Z\u00C0-\u024F\u1E00-\u1EFF]+$/;
        if (!this.regExp.test(this.panneauElt.querySelector(".nom").value) || !this.regExp.test(this.panneauElt.querySelector(".prenom").value)) {
            console.log(this.regExp.test(this.panneauElt.querySelector(".nom").value));
            console.log(this.regExp.test(this.panneauElt.querySelector(".prenom").value));
            alert("Attention : Le nom ET le prénom sont obligatoires et les deux doivent contenir des lettres * uniquement * !");
            return false;
        }

        else {
            // Récupération des champs du formulaire dans localStorage.noms//
            let nom = this.panneauElt.querySelector(".nom").value;
            let prenom = this.panneauElt.querySelector(".prenom").value;
            this.localDataElt = localStorage.setItem("noms", JSON.stringify({ nom: nom, prenom: prenom }));
            this.donnees = JSON.parse(localStorage.noms);

            // Diminuer les vélos et augmenter les places par un//
            this.currentstation.available_bikes = Number(this.currentstation.available_bikes) - 1;
            this.currentstation.available_bike_stands = Number(this.currentstation.available_bike_stands) + 1;

            // Initier un nouvel objet Canvas // 
            this.drawCanvas = new Canvas(this);
        }

    }

    // Création du panneau contenant les détails de la station choisie //
    afficherPanneau() {

        // Traduire le status en Français //
        switch (this.currentstation.status) {
            case "OPEN":
                this.currentstation.status = "Ouverte";
                break;

            case "CLOSED":
                this.currentstation.status = "Fermée";
                break;
        }


        // Afficher les détails en Français + un formulaire //

        if (this.currentstation.available_bikes != 0) {
            this.panneauElt.innerHTML = "<h2>Détails de la station</h2><p><b>Station:</b><br>" + this.currentstation.name + "<br><br><b>Adresse:</b><br>" + this.currentstation.address.toUpperCase() + "<br><br><b>Actuellement</b>: " + this.currentstation.status + "<br><br><b>Places disponibles</b>: " + Number(this.currentstation.available_bike_stands) + "<br><br><b>Vélos disponibles</b>: " + Number(this.currentstation.available_bikes) + "</p>";

            this.panneauElt.appendChild(this.formElt);
        }

        // Quand il n'y a plus de vélos : masquer le formulaire //
        else if (this.currentstation.available_bikes === 0) {
            this.panneauElt.innerHTML = "<br><br><b>Il n'y a plus de vélos...<br>Choisissez une autre station aux alentours !</b><br><br>";
            this.panneauElt.appendChild(this.formElt);
            this.formElt.style.display = "none";
        }

    }

}

// Initier un nouvel  instant de l'objet Carte //
var carteLyon = new Carte("carte1");