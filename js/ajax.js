// Créer une classe Ajax //

class Ajax {
    constructor(url, callback) {

        // Récupérer l'URL et la fonction callback //
        this.url = url;
        this.callback = callback;

        this.ajaxGet(this.url, this.callback);

        // Fin du Constructor //
    }

    ajaxGet(url, callback) {
        let req = new XMLHttpRequest();
        req.open("GET", url);
        req.addEventListener("load", () => {
            if (req.status >= 200 && req.status < 400) {
                // Appeller la fonction callback en lui passant la réponse de la requête
                callback(req.responseText);
            } else {
                console.error(req.status + " " + req.statusText + " " + url);
            }
        });
        req.send(null);
    }
}