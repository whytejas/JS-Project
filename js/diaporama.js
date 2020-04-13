// Créer une classe Diaporama //

class Diaporama {
	constructor(idDiaporama, delai) {

		// Récupérer les elements HTML //
		this.diapoElt = document.getElementById(idDiaporama);
		this.btnGauche = this.diapoElt.querySelector(".gauche");
		this.btnPause = this.diapoElt.querySelector(".pause");
		this.btnDroite = this.diapoElt.querySelector(".droite");
		this.slides = this.diapoElt.querySelectorAll("figure");

		// Créer un diaporama avec index et delai //
		this.index = 0;
		this.delai = delai;
		this.animation = null;
		this.afficher();
		this.autoplay();

		// Ajouter un event lorsqu'on clique sur le clavier ou les boutons //
		document.addEventListener("keydown", (e) => { this.clavier(e) });
		this.btnGauche.addEventListener("click", this.versGauche.bind(this));
		this.btnDroite.addEventListener("click", this.versDroite.bind(this));

		// Gestion du bouton Pause/Play //
		this.btnPause.addEventListener("click", () => {
			if (this.animation != null) {
				clearInterval(this.animation);
				this.animation = null;
				this.btnPause.textContent = "Play";
			}
			else {
				this.btnPause.textContent = "Pause";
				this.autoplay()
			}
		});

		// Fin du Constructor //
	}

	// Afficher une seule image du diaporama à la fois  //
	afficher() {
		for (let i = 0; i < this.slides.length; i++) {
			this.slides[i].style.display = "none";
		}

		this.slides[this.index].style.display = "block";
	}

	// Gestion du diaporama vers le gauche //
	versGauche() {
		if (this.index <= 0) {
			this.index = this.slides.length - 1;
		}

		else {
			this.index = this.index - 1;
		}

		this.afficher();
	}

	// Gestion du diaporama vers le droite //
	versDroite() {
		this.index = this.index + 1;
		if (this.index >= this.slides.length) {
			this.index = 0;
		}
		this.afficher();
	}

	// Animation pour changer le diaporama toutes les 5s //
	autoplay() {
		this.animation = setInterval(this.versDroite.bind(this), this.delai)
	}

	// Gestion du clavier //
	clavier(e) {
		switch (e.keyCode) {
			case 37:
				return this.versGauche();
				break;

			case 39:
				return this.versDroite();
				break;
		}
	}
}

// Initier un nouvel instant de l'objet Diaporama avec un delai de 5 secondes // 
var diaporama = new Diaporama("diaporama", 5000);