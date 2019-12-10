(function($) {

  /**
   * Appelle le service DQE à partir du champ de saisie de l'adresse e-mail
   * Options disponibles :
   *   - server: URL du serveur
   *   - country: code d'un pays précis (3 caractères) OU sélecteur jQuery pointant sur le champ pays
   *   - autocheck: lance la vérification de l'adresse e-mail lorsqu'on quitte le champ e-mail (par défaut = true)
   *   - suggest: Propose des adresses e-mail en autocomplétion lors de la saisie (par défaut = false)
   *   - last_name: sélecteur jquery qui pointe sur le champ nom
   *   - first_name: sélecteur jquery qui pointe sur le champ prénom
   *
   *   Méthodes disponibles :
   *   - check(): lance manuellement le contrôle de l'adresse e-mail
   *
   * Evènements disponibles :
   *   - checking: se lance juste avant la vérification d'une adresse e-mail
   *   - checked(data): se lance dès qu'une adresse e-mail est validée

   *
   * @param {object} options Tableau associatif des options
   * @returns {jQuery}
   */
  $.fn.dqemail = function() {

    //On initialise le conteneur du champ et l'icône de statut s'il y en a (uniquement pour des champs Bootstrap)
    var myDQE = {};
    var settings = {
      //Paramètres par défaut
      country: 'FRA',
      suggest: false,
      autocheck: true,
      extendedsyntax: 'n',
      checkuser: 'y',
      rectify: 0,
      extended: 'y'
    };

    //On récupère les champs à partir de leur selecteur
    myDQE.suggest = settings.suggest;
    myDQE.autocheck = settings.autocheck ? settings.autocheck : false;
    myDQE.rectify = !!settings.rectify;
    myDQE.extended = settings.extendedsyntax === 'y' ? 'y' : 'n';
    myDQE.checkuser = !settings.checkuser || settings.checkuser === 'y' ? 'y' : 'n';

    myDQE.country = settings.country;
    return myDQE;

  }


  $.fn.removeAccents = function removeAccents(s) {
    s = s.trim();
    var ko = 'ÀÁÂÃÄÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÇçàáâãèéêëîïòôõöùúûüñ';
    var ok = 'AAAAAEEEEIIIIOOOOOUUUUCcaaaaeeeeiioooouuuun';
    var len = s.length;
    var p;
    var c;
    var result = "";
    for (var i = 0; i < len; i++) {
      c = s.trim().charAt(i);
      p = ko.indexOf(c);
      result += p === -1 ? c : ok.charAt(p);
    }
    return result;
  };

  $.fn.analyse_reponse = function(data) {

    var code = data[1]['IdError'];
    var parts = data[1].eMailOrigine.split('@');
    var messages = {
      '91': "Erreur de syntaxe",
      '92': "Domaine " + parts[1] + " inconnu",
      '93': "Domaine " + parts[1] + " en blacklist",
      '94': "Nom d'utilisateur non autorisé (nom réservé ou interdit)",
      '95': "Adresse e-mail temporaire jetable",
      '99': 'Le domaine ne répond pas',
      '04': "E-mail non fourni",
      '03': "Boîte de réception pleine",
      '02': "Adresse e-mail non trouvée sur le domaine " + parts[1],
      '01': "E-mail correct mais le nom " + parts[0] + " n'a pas pu être contrôlé",
      '00': "E-mail valide"
    };

    var activity = {
      100: 'email utilisé au moins une fois',
      201: 'email actif le mois dernier',
      202: 'email actif dans les 2 derniers mois',
      203: 'email actif dans les 3 derniers mois',
      204: 'email actif dans les 4 derniers mois',
      206: 'email actif dans les 6 derniers mois',
      209: 'email actif dans les 9 derniers mois',
      212: 'email actif dans les 12 derniers mois',
      300: 'email actif il y a plus de 12 mois'
    };

    var states = {
      '91': 'error',
      '92': 'error',
      '93': 'error',
      '94': 'error',
      '99': 'error',
      '04': 'error',
      '03': 'error',
      '02': 'error',
      '01': 'warning',
      '00': 'success',
      '95': 'error'
    };
    if (!states[code]) code = '01';
    var response = {
      code: code,
      msg: messages[code],
      state: states[code],
      activity: ""
    };
    if ((code === '00' || code === '01')) {
      response['input'] = data[1].eMail;
    }

    data = data[1];
    if (data['Redressement'] && data['eMail'] !== data['eMailOrigine']) {
      response['suggestion'] = data['eMail'];
      if ($.fn.dqemail().rectify && (code === '01' || code === '02' || code === '91' || code === '92')) response['rectified'] = true;
    }

    if (code === '00' || code === '01') {
      response['activity'] = data['CodeActivite'] in activity ? activity[data['CodeActivite']] : '';
    }
    return response;
  }
}(jQuery));
