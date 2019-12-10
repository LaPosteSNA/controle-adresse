(function($) {

  /**
   * Appelle le service DQE à partir du champ de saisie d'un téléphone
   * Options disponibles :
   *   - server: URL du serveur
   *   - country: code d'un pays précis (3 caractères) OU sélecteur jQuery pointant sur le champ pays
   *   - autocheck: lance la vérification du téléphone lorsqu'on quitte le champ téléphone (par défaut = true)
   *   - format: format de sortie du numéro de téléphone (0=chiffres, 1=avec séparateurs, 2=international basique, 3=international complet)
   *
   * Méthodes disponibles :
   *   - check(callback_function_name, [output_format]) : lance manuellement la validation du téléphone saisi et appelle callback_function_name avec les résultats de la validation
   *
   * Evènements disponibles :
   *   - checking: se lance juste avant la vérification d'un téléphone
   *   - checked(data): se lance dès qu'un téléphone est validé. Cet évènement doit obligatoirement être implémenté si autocheck est à true car c'est alors la seule façon de récupérer le résultat de la validation

   *
   * @param {object} options Tableau associatif des options
   * @returns {jQuery}
   */
  $.fn.dqephone_options = function() {

    var myDQE = {};


    var settings = {
      //Paramètres par défaut
      country: 'FRA',
      format: 0
    };


    //On récupère les champs à partir de leur selecteur
    myDQE.countryField = settings.country.length == 3 ? false : $(settings.country);
    myDQE.autocheck = settings.autocheck === undefined ? true : settings.autocheck;
    myDQE.country = settings.country;
    myDQE.format = settings.format;

    return myDQE;

  }

  $.fn.dqephone_check = function(data) {

    var ko = {
      status: 0,
      state: 'error'
    };


    data = data[1];
    var ok = parseInt(data['IdError'], 10);
    data = ok ? {
      location: data['Geolocation'],
      status: data['IdError'],
      state: 'success',
      OldOperator: data['OldOperator'],
      Operator: data['Operator'],
      Ported: data['Ported'],
      Tel: data['Tel'],
      TelOrigine: data['TelOrigine'],
      Type: data['Type']
    } : ko;


    return data;
  }

}(jQuery));
