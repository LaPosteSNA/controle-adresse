if (typeof jQuery === 'undefined') {
  throw new Error('Le plugin "sercaForm" nécessite jQuery!');
}

(function($) {
  'use strict';
  var options;

  var hlWordsMatch = "&hlDebut=<strong>&hlFin=</strong>";
  var hlWordsNoFound = "&hlDebutRestruct=<p class='color_red'>&hlFinRestruct=</p>";


  $.fn.setOptionTitle = function setOptionTitle(title) {
    var html = "";
    if (typeof title !== 'undefined' && title.length > 0) {
      html = '<h1>' + title + '</h1>';
    }
    return html;
  };

  var villesMultiCP;
  $.fn.retrieveAddressFromSerca = function retrieveAddressFromSerca(data, typeOfReturn, options) {

    var dataLimitedToNbDisplayedResults;

    if (typeOfReturn == "address_row8") {

      dataLimitedToNbDisplayedResults = data.suggest.slice(0, options.nbDisplayedResults);

    } else {

      dataLimitedToNbDisplayedResults = data.reponse.adresse.slice(0, options.nbDisplayedResults);

    }
    var addressResult;

    if (typeOfReturn == "address_row6") {

      addressResult = dataLimitedToNbDisplayedResults.map(function(item) {
        return {
          value: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
          highlightedResult: $.fn.getHighlightedResult(item.cea, typeOfReturn, item, options),
          address_row1: "",
          address_row2: "",
          address_row3: "",
          address_row4: "",
          address_row5: item.ligne5.libelle !== "" ? item.ligne5.libelle : "",
          address_row6: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
          address_row7: "",
          insee_code: item.ligne6.codeInsee,
          libelle_acheminement: item.ligne6.libelleAcheminement
        };
      });
    }
    if (typeOfReturn == "address_row5") {

      addressResult = dataLimitedToNbDisplayedResults.map(function(item) {
        return {
          value: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
          highlightedResult: $.fn.getHighlightedResult(item.cea, typeOfReturn, item, options),
          address_row1: "",
          address_row2: "",
          address_row3: "",
          address_row4: "",
          address_row5: item.ligne6.libelle !== "" ? item.ligne6.libelle : "",
          address_row6: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
          address_row7: "",
          insee_code: item.ligne6.codeInsee,
          libelle_acheminement: item.ligne6.libelleAcheminement
        };
      });
    }
    if (typeOfReturn == "address_row4") {
      villesMultiCP = $.fn.analyseIsMultiCP(dataLimitedToNbDisplayedResults);
      addressResult = dataLimitedToNbDisplayedResults.map(function(item) {
        return {
          value: item.ligne4.libelle,
          highlightedResult: $.fn.getHighlightedResult(item.cea, typeOfReturn, item, options),
          address_row1: "",
          address_row2: "",
          address_row3: "",
          address_row4: item.ligne4.libelle,
          address_row5: item.ligne5.libelle !== "" ? item.ligne5.libelle : "",
          address_row6: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
          address_row7: "",
          numext: item.ligne4.numero + (item.ligne4.extLongue !== "" ? " " + item.ligne4.extLongue : ""),
          justVoieaddress_row4: item.ligne4.libelleVoie
        };
      });
    }
    if (typeOfReturn == "address_row3") {

      addressResult = dataLimitedToNbDisplayedResults.map(function(item) {
        if (item.ligne3 !== undefined) {
          return {
            value: item.ligne3.libelle,
            highlightedResult: $.fn.getHighlightedResult(item.cea, typeOfReturn, item, options),
            address_row1: "",
            address_row2: "",
            address_row3: item.ligne3.libelle !== "" ? item.ligne3.libelle : "",
            address_row4: item.ligne4.libelle,
            address_row5: item.ligne5.libelle !== "" ? item.ligne5.libelle : "",
            address_row6: item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement,
            address_row7: "",
            insee_code: item.ligne3.codeInsee
          };
        } else {
          return {
            value: "",
            highlightedResult: '<li><div class="address-autocomplete-result-list address-autocomplete-result-list-style-' + options.autocompleteListStyle + '" + address-autocomplete-result-list-style-empty" id="9999">Aucune Proposition...</div></li>',
            address_row1: "",
            address_row2: "",
            address_row3: "",
            address_row4: "",
            address_row5: "",
            address_row6: "",
            address_row7: "",
            insee_code: "-1"
          };
        }
      });
    }
    if (typeOfReturn == "address_row8") {

      addressResult = dataLimitedToNbDisplayedResults.map(function(item) {
        return {
          value: item,
          highlightedResult: $.fn.getHighlightedResult(item.cea, typeOfReturn, item, options),
          address_row8: item

        };
      });

    }
    return addressResult;
  };

  $.fn.compareVilles = function compareVilles(ville1, ville2) {
    return (ville1.libelleAcheminement == ville2.libelleAcheminement &&
      ville1.codeInsee == ville2.codeInsee &&
      ville1.codePostal != ville2.codePostal);
  };
  $.fn.analyseIsMultiCP = function analyseIsMultiCP(array) {
    var multiCP = [];
    for (var i = 0; i < array.length; i++) {
      var villes1Ligne6 = array[i].ligne6;
      for (var j = 0; j < array.length; j++) {
        var villes2Lignes6 = array[j].ligne6;
        if (i != j) {
          if ($.fn.compareVilles(villes1Ligne6, villes2Lignes6)) {
            if (multiCP.indexOf(villes1Ligne6.libelleAcheminement) == -1) {
              multiCP.push(villes1Ligne6.libelleAcheminement);
            }
          }
        }
      }
    }
    return multiCP;
  };

  $.fn.retrieveAddressFromSercaMascadia = function retrieveAddressFromSercaMascadia(data, typeOfReturn, options) {

    var dataLimitedToNbDisplayedResults;
    var response;

    switch (typeOfReturn) {

      case "address_row8":

        dataLimitedToNbDisplayedResults = data;

        $("#row8_message").hide();
        $("#address_row8").removeClass("is-valid");
        $("#address_row8").removeClass("is-invalid");
        $("#address_row8").removeClass("is-warning");

        var row8 = $("#address_row8");
        response = $.fn.analyse_reponse(data);
        if (response.state == 'error') {
          row8.addClass('is-invalid');
          $("#row8_message").css("color", "red");
          $("#row8_message").text(response.msg);
          $("#row8_message").show();
        } else if (response.state == 'warning') {
          row8.addClass('is-warning');
          $("#row8_message").css("color", "orange");
          $("#row8_message").text(response.msg);
          $("#row8_message").show();
        } else if (response.state == 'success') {
          row8.addClass('is-valid');
        }

        break;

      case "address_row9":

        $("#address_row9").removeClass("is-valid");
        $("#address_row9").removeClass("is-invalid");
        var row9 = $("#address_row9");
        response = $.fn.dqephone_check(data);
        if (response.status == 0) {
          row9.addClass('is-invalid');
        } else if (response.status == 1) {
          row9.addClass('is-valid');
          $("#address_row9").val(response.Tel);
        }

        break;

      case "controler_votre_adresse":

        dataLimitedToNbDisplayedResults = data.retour.blocAdresse.adresse.slice(0, options.nbDisplayedResults);

        var dataFilterToNbFeu = data.retour.codesEtMessages;

        if (dataLimitedToNbDisplayedResults.length > 0) {

          $("#address_row2").val(dataLimitedToNbDisplayedResults[0].ligne2.value).change();
          $("#address_row3").val(dataLimitedToNbDisplayedResults[0].ligne3.value).change();
          $("#address_row4").val(dataLimitedToNbDisplayedResults[0].ligne4.value).change();
          $("#address_row5").val(dataLimitedToNbDisplayedResults[0].ligne5.value !== "" ? dataLimitedToNbDisplayedResults[0].ligne5.value : "").change();
          $("#address_row6").val(dataLimitedToNbDisplayedResults[0].ligne6.codePostal + " " + dataLimitedToNbDisplayedResults[0].ligne6.libelleAcheminement).change();
          $("#address_row7").val(dataLimitedToNbDisplayedResults[0].ligne7.value).change();

          $("#address_row6").removeClass("is-valid");
          $("#address_row5").removeClass("is-valid");
          $("#address_row4").removeClass("is-valid");
          $("#address_row3").removeClass("is-valid");
          $("#address_row2").removeClass("is-valid");

          $("#address_row6").removeClass("is-invalid");
          $("#address_row5").removeClass("is-invalid");
          $("#address_row4").removeClass("is-invalid");
          $("#address_row3").removeClass("is-invalid");
          $("#address_row2").removeClass("is-invalid");

          $("#address_row6").removeClass("is-warning");
          $("#address_row5").removeClass("is-warning");
          $("#address_row4").removeClass("is-warning");
          $("#address_row3").removeClass("is-warning");
          $("#address_row2").removeClass("is-warning");


          var row6 = $("#address_row6");
          var row5 = $("#address_row5");
          var row4 = $("#address_row4");
          var row3 = $("#address_row3");
          var row2 = $("#address_row2");

          var retourDesFeux = [{
              feu: dataFilterToNbFeu.ligne6.feu,
              row: row6
            },
            {
              feu: dataFilterToNbFeu.ligne5.feu,
              row: row5
            },
            {
              feu: dataFilterToNbFeu.ligne4.feu,
              row: row4
            },
            {
              feu: dataFilterToNbFeu.ligne3.feu,
              row: row3
            },
            {
              feu: dataFilterToNbFeu.ligne2.feu,
              row: row2
            }
          ];

          retourDesFeux.forEach(function(retourDuFeu) {
            if(retourDuFeu.row.val() !== ""){
            switch (retourDuFeu.feu) {

              case "-2":
                retourDuFeu.row.addClass('is-invalid');
                break;

              case "-1":
                retourDuFeu.row.addClass('is-warning');
                break;

              case "0":
                retourDuFeu.row.addClass('is-valid');
                break;

            }
          }
          });

        }
    }
    $.fn.updateFinal();
  };




  $.fn.getSercaURL = function getSercaURL(searchedAddress, typeOfReturn, options) {
    var url = "";
    var distantServiceUrls = {
      address_row5: "?chaineRecherche=%strSearch%&typeRecherche=commune&nbItems=" + options.nbDisplayedResults + "&optionMot=CommencePar&optionRecherche=AND_OR&typeResultat=json",
      address_row6: "?chaineRecherche=%strSearch%&typeRecherche=commune&nbItems=" + options.nbDisplayedResults + "&optionMot=CommencePar&optionRecherche=AND_OR&typeResultat=json",
      address_row4_insee_code: "?chaineRecherche=%strSearch%&nbItems=" + options.nbDisplayedResults + "&optionFiltre=code_insee=%strCodeInsee%&typeRecherche=voie;pdi&optionMot=CommencePar&optionRecherche=AND_OR&typeResultat=json",
      address_row4_acheminement_label: "?chaineRecherche=%strSearch%&nbItems=" + options.nbDisplayedResults + "&optionFiltre=libelle_acheminement=%strLibAch%&typeRecherche=voie;pdi&optionMot=CommencePar&optionRecherche=AND_OR&typeResultat=json",
      address_row3: "?chaineRecherche=%strSearch%&nbItems=" + options.nbDisplayedResults + "&optionFiltre=libelle_voie=%strlibVoie%&optionFiltre=numero_ext=%strNumExt%&optionFiltre=libelle_acheminement=%strLibAch%&typeRecherche=ligne3&optionMot=CommencePar&optionRecherche=AND_OR&typeResultat=json",
      controler_votre_adresse: "?prenom=&civilite=&nom=&ligne2=" + $("#address_row2").val() + "&ligne3=" + $("#address_row3").val() + "&ligne4=" + $("#address_row4").val() + "&ligne5=" + $("#address_row5").val() + "&ligne6=" + $("#address_row6").val() + "&ligne7=&typeResultat=json",
      address_row8_autocompletion: "?Email=%email%&Nom=%nom%&Prenom=%prenom%&Pays=%country%&Instance=0",
      controler_votre_mail: "?Email=%email%&checkuser=%checkuser%&extendedsyntax=%syntax%&Rectify=%rectify%",
      controler_votre_telephone: "?Tel=%telephone%&Pays=%pays%&Format=%format%"
    };

    switch (typeOfReturn) {
      case "address_row6":
        url = (options.corpsProxy || '') + options.distantDNSSolr + distantServiceUrls.address_row6;
        url = url.replace("%strSearch%", searchedAddress);

        return url;

      case "address_row5":
        url = (options.corpsProxy || '') + options.distantDNSSolr + distantServiceUrls.address_row5;
        url = url.replace("%strSearch%", searchedAddress);

        return url;

      case "address_row4_insee_code":
        url = (options.corpsProxy || '') + options.distantDNSSolr + distantServiceUrls.address_row4_insee_code;
        url = url.replace("%strSearch%", searchedAddress);
        url = url.replace("%strCodeInsee%", $("#address_row6").attr("insee_code"));

        return url;

      case "address_row4_acheminement_label":
        url = (options.corpsProxy || '') + options.distantDNSSolr + distantServiceUrls.address_row4_acheminement_label;
        url = url.replace("%strSearch%", searchedAddress);
        url = url.replace("%strLibAch%", $("#address_row6").attr("libelle_acheminement"));

        return url;

      case "address_row3":
        url = (options.corpsProxy || '') + options.distantDNSSolr + distantServiceUrls.address_row3;
        if (searchedAddress == "")
          searchedAddress = $("#address_row4").attr("numext") + " " + $("#address_row4").attr("voie");
        url = url.replace("%strSearch%", searchedAddress);
        url = url.replace("%strlibVoie%", $("#address_row4").attr("voie"));
        url = url.replace("%strNumExt%", $("#address_row4").attr("numext"));
        url = url.replace("%strLibAch%", $("#address_row6").attr("libelle_acheminement"));

        return url;

      case "controler_votre_adresse":
        url = (options.corpsProxy || '') + options.distantDNSMascadia +
          distantServiceUrls.controler_votre_adresse;
        url = url.replace("%strSearch%", searchedAddress);

        return url;

      case "address_row8_autocompletion":
        url = (options.corpsProxy || '') + options.distantDQEAutocompletionMail + distantServiceUrls.address_row8_autocompletion;
        url = url.replace("%email%", $.fn.removeAccents($("#address_row8").val()));
        url = url.replace("%nom%", $("#address_row1_last_name").val());
        url = url.replace("%prenom%", $("#address_row1_first_name").val());
        url = url.replace("%country%", $.fn.dqemail().country);

        return url;

      case "controler_votre_mail":
        url = (options.corpsProxy || '') + options.distantDQEMail +
          distantServiceUrls.controler_votre_mail;
        url = url.replace("%strSearch%", searchedAddress);
        url = url.replace("%email%", $.fn.removeAccents($("#address_row8").val()));
        url = url.replace("%rectify%", $.fn.dqemail().rectify);
        url = url.replace("%syntax%", $.fn.dqemail().extended);
        url = url.replace("%checkuser%", $.fn.dqemail().checkuser);

        return url;

      case "controler_votre_telephone":
        url = (options.corpsProxy || '') + options.distantDQETelephone +
          distantServiceUrls.controler_votre_telephone;
        url = url.replace("%telephone%", $("#address_row9").val());
        url = url.replace("%format%", $.fn.dqephone_options().format);
        url = url.replace("%pays%", $.fn.dqephone_options().country);

        return url;

    }

  };

  $.fn.getHighlightedResult = function getHighlightedResult(id, field, item, options) {

    var htmlHighlightedResult = '';
    htmlHighlightedResult = htmlHighlightedResult + '<li><div class="address-autocomplete-result-list address-autocomplete-result-list-style-' + options.autocompleteListStyle + '" id="' + id + '">';

    if (field == "address_row6") {
      htmlHighlightedResult += item.ligne6.highlight;
      if (item.ligne5.libelle !== "") {
        htmlHighlightedResult += '<br/><span class="text-muted">' + item.ligne5.libelle + "</span>";
      }
    }
    if (field == "address_row4") {
      htmlHighlightedResult += item.ligne4.highlight;
      if (item.ligne5.libelle !== "") {
        htmlHighlightedResult += '<br/><span class="text-muted">' + item.ligne5.libelle + "</span>";
        if (item.ligne4.numero === "") {
          htmlHighlightedResult += ', <span class="text-muted">' + item.ligne6.codePostal + " " + item.ligne6.libelleAcheminement + "</span>";
        }
      } else if ((item.ligne6.libelleAcheminement === "PARIS" ||
          item.ligne6.libelleAcheminement === "LYON" ||
          item.ligne6.libelleAcheminement === "MARSEILLE") || (villesMultiCP.indexOf(item.ligne6.libelleAcheminement) != -1)) {
        htmlHighlightedResult += '<br/><span class="text-muted">' +
          item.ligne6.codePostal +
          " " +
          item.ligne6.libelleAcheminement +
          "</span>";
      }
    }
    if (field == "address_row3") {
      htmlHighlightedResult += item.ligne3.libelle + '<br />' + '<span class="text-muted">' + (item.ligne4.numero + ' ' + item.ligne4.extLongue + ' ' + item.ligne4.libelleVoie).trim() + ', ' + item.ligne6.codePostal + ' ' + item.ligne6.libelleAcheminement + '</span>';
    }
    if (field == "address_row8") {

      htmlHighlightedResult += item;
    }
    htmlHighlightedResult += '</div></li>';
    return htmlHighlightedResult;
  };

  $.fn.getHtmlForm = function getHtmlForm(options) {

    var html = '';
    var htmlCodeAddressRow1 = '';
    if ("bootstrap4" === options.ihmModelAndVersion) {
      html = '<form id="address-autocomplete-form" class="containerca p-5" autocomplete="off" action="" method="POST">\n' +
        $.fn.setOptionTitle(options.title);

      var htmlCodeGender =
        '	<div class="text-right mb-5" id="information"><font color="red">*</font> Champs obligatoires</div>\n' +
        '<div class="form-group row">\n' +
        '    <label id="address_row0_label" class="col-md-4 col-form-label" for="address_row1_gender">Civilité :</label>\n' +
        '    <div class="col-md-8 d-inline-flex align-items-center">\n' +
        '    <div class="form-check col-md-4 pl-0">\n' +
        '            <input class="form-check-input" type="checkbox" name="address_row1_gender" id="address_row1_male" value="M" autocomplete="off"> \n' +
        '        <label class="form-check-label ml-4" id="gender" for="address_row1_male">Monsieur</label>\n' +
        '     </div>\n' +
        '    <div class="form-check col-md-4 pl-0">\n' +
        '            <input class="form-check-input" type="checkbox" name="address_row1_gender" id="address_row1_female" value="MME" autocomplete="off"> \n' +
        '        <label class="form-check-label ml-4" for="address_row1_female">Madame</label>\n' +
        '     </div>\n' +
        '    </div>\n' +
        '</div>\n';

      if (options.oneFieldAddressRow1) {
        htmlCodeAddressRow1 =
          '<div class="form-group row form-space">\n' +
          '    <label id="address_row1_label" for="address_row1" class="col-md-4 col-form-label">Prénom Nom</label>\n' +
          '    <div class="col-md-8"><div class="input-group-btn">\n' +
          '        <input type="input" tabindex="1" class="form-control" id="address_row1" name="address_row1" maxlength="38" aria-describedby="Prénom Nom" placeholder="Ex: Jean Dupond" autocomplete="off">\n' +
          '    </div></div>\n' +
          '</div>\n';
      } else {
        var labelAddressRow1 = "";
        if (options.orderFieldAddressRow1 == "first_name;last_name")
          labelAddressRow1 = '<label id="address_row1_firstname_label" for="address_row1_first_name" class=" col-form-label">Prénom</label>' +
          ' - ' +
          '<label id="address_row1_lastname_name_label" for="address_row1_last_name" class="col-form-label">Nom</label> :';

        else
          labelAddressRow1 =
          '<label id="address_row1_lastname_name_label" for="address_row1_last_name">Nom </label>' +
          ' - ' +
          '<label id="address_row1_firstname_label" for="address_row1_first_name">Prénom <font color="red">*</font></label> :';

        htmlCodeAddressRow1 =
          '<div class="form-group row form-space">\n' +
          '    <div class="col-md-4  col-form-label">' + labelAddressRow1 + '</div>\n' +
          '    <div class="col-md-8" id="address_row1"><div class="input-group">\n';
        if (options.orderFieldAddressRow1 == "first_name;last_name") {
          htmlCodeAddressRow1 = htmlCodeAddressRow1 + '        <input type="input" tabindex="1" class="form-control" xwidth="50%" id="address_row1_first_name" name="address_row1_first_name" maxlength="38" aria-describedby="Prénom" placeholder="Ex : Dupont" autocomplete="off">\n';
          htmlCodeAddressRow1 = htmlCodeAddressRow1 + '        <input type="input" tabindex="2" class="form-control" xwidth="50%" id="address_row1_last_name" name="address_row1_last_name" maxlength="38" aria-describedby="Nom" placeholder="Ex : Dominique" autocomplete="off">\n';
        } else {
          htmlCodeAddressRow1 = htmlCodeAddressRow1 + '        <input type="input" tabindex="1" class="form-control" xwidth="50%" id="address_row1_last_name" name="address_row1_first_name" maxlength="38" aria-describedby="Nom" placeholder="Ex : Dupont" autocomplete="off"><span style="width:5%"></span>\n';
          htmlCodeAddressRow1 = htmlCodeAddressRow1 + '        <input type="input" tabindex="2" class="form-control" xwidth="50%" id="address_row1_first_name" name="address_row1_last_name" maxlength="38" aria-describedby="Prénom" placeholder="Ex : Dominique" autocomplete="off">\n';
        }
        htmlCodeAddressRow1 = htmlCodeAddressRow1 + '    </div></div>\n' +
          '</div>\n';
      }


      var htmlCodeAddress =
        '<div class="form-group row form-space">\n' +
        '    <label id="address_row6_label" for="address_row6" class="col-md-4 col-form-label">Code Postal - Localité <font color="red">*</font> :</label>\n' +
        '    <div class="col-md-8">\n' +
        '        <input type="input" tabindex="2" class="form-control" id="address_row6" name="address_row6" maxlength="38"  aria-describedby="Code Postal - ville" placeholder="Ex : 33500 Libourne" autocomplete="off"><i class="fa fa-circle-o-notch fa-spin text-primary hide loading" aria-hidden="true"></i>\n' +
        '        <div id="address_row6Help" class="invalid-feedback"></i></div>\n' +
        '        <div class="valid-feedback feedback-icon" id="address_row6-valid">\n' +
        '        <i class="fa fa-check"></i>\n' +
        '        </div>\n' +
        '        <div class="invalid-feedback feedback-icon" id="address_row6-invalid">\n' +
        '        <i class="fa fa-minus-circle"></i>\n' +
        '        </div>\n' +
        '        <div class="warning-feedback feedback-icon" id="address_row6-warning">\n' +
        '        <i class="fa fa-exclamation-circle"></i>\n' +
        '		</div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="form-group row form-space">\n' +
        '    <label id="address_row5_label" for="address_row5" class="col-md-4 col-form-label">Lieu dit ou Ancienne Commune :</label>\n' +
        '    <div class="col-md-8">\n' +
        '        <input type="input" tabindex="3" class="form-control" id="address_row5" name="address_row5" maxlength="38" aria-describedby="Lieu dit ou ancienne commune" placeholder="" autocomplete="off"><i class="fa fa-circle-o-notch fa-spin text-primary hide loading" aria-hidden="true"></i>\n' +
        '        <div id="address_row5Help" class="invalid-feedback"></i></div>\n' +
        '        <div class="valid-feedback feedback-icon" id="address_row5-valid">\n' +
        '        <i class="fa fa-check"></i>\n' +
        '        </div>\n' +
        '        <div class="invalid-feedback feedback-icon" id="address_row5-invalid">\n' +
        '        <i class="fa fa-minus-circle"></i>\n' +
        '		</div>\n' +
        '        <div class="warning-feedback feedback-icon" id="address_row5-warning">\n' +
        '        <i class="fa fa-exclamation-circle"></i>\n' +
        '		</div>\n' +
        '   </div>\n' +
        '</div>\n' +
        '<div class="form-group row form-space has-feedback">\n' +
        '    <label id="address_row4_label" for="address_row4" class="col-md-4 col-form-label">Numéro et Nom de la voie <font color="red">*</font> :</label>\n' +
        '    <div class="col-md-8">\n' +
        '        <input type="input" tabindex="4" class="form-control" id="address_row4" name="address_row4" maxlength="38" aria-describedby="Numéro et nom de la voie" placeholder="Ex : 3 rue des lilas" autocomplete="off"><i class="fa fa-circle-o-notch fa-spin text-primary hide loading" aria-hidden="true"></i>\n' +
        '        <div id="address_row4Help" class="invalid-feedback"></div>\n' +
        '        <div class="valid-feedback feedback-icon" id="address_row4-valid">\n' +
        '        <i class="fa fa-check"></i>\n' +
        '        </div>\n' +
        '        <div class="invalid-feedback feedback-icon" id="address_row4-invalid">\n' +
        '        <i class="fa fa-minus-circle"></i>\n' +
        '		</div>\n' +
        '        <div class="warning-feedback feedback-icon" id="address_row4-warning">\n' +
        '        <i class="fa fa-exclamation-circle"></i>\n' +
        '		</div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="form-group row form-space has-feedback">\n' +
        '    <label id="address_row3_label" for="address_row3" class="col-md-4 col-form-label">Bâtiment, résidence :</label>\n' +
        '    <div class="col-md-8">\n' +
        '        <input type="input" tabindex="5" class="form-control" id="address_row3" name="address_row3" maxlength="38" aria-describedby="Bâtiment, résidence" placeholder="Ex : Residence la verboise" autocomplete="off"><i class="fa fa-circle-o-notch fa-spin text-primary hide loading" aria-hidden="true"></i>\n' +
        '        <div id="address_row3Help" class="invalid-feedback"></div>\n' +
        '        <div class="valid-feedback feedback-icon" id="address_row3-valid">\n' +
        '        <i class="fa fa-check"></i>\n' +
        '        </div>\n' +
        '        <div class="invalid-feedback feedback-icon" id="address_row3-invalid" >\n' +
        '        <i class="fa fa-minus-circle"></i>\n' +
        '        </div>\n' +
        '        <div class="warning-feedback feedback-icon" id="address_row3-warning">\n' +
        '        <i class="fa fa-exclamation-circle"></i>\n' +
        '		</div>\n' +
        '    </div>\n' +
        '</div>\n' +
        '<div class="form-group row form-space has-feedback">\n' +
        '    <label id="address_row2_label" for="address_row2" class="col-md-4 col-form-label">Appartement, Escalier, Etage :</label>\n' +
        '    <div class="col-md-8">\n' +
        '        <input type="input" tabindex="6" class="form-control" id="address_row2" name="address_row2" maxlength="38" aria-describedby="Appartement, Escalier, Etage" placeholder="Ex : Appartement 123" autocomplete="off">\n' +
        '        <div id="address_row2Help" class="invalid-feedback"></div>\n' +
        '        <div class="valid-feedback feedback-icon" id="address_row2-valid">\n' +
        '        <i class="fa fa-check"></i>\n' +
        '        </div>\n' +
        '        <div class="invalid-feedback feedback-icon" id="address_row2-invalid" >\n' +
        '        <i class="fa fa-minus-circle"></i>\n' +
        '        </div>\n' +
        '        <div class="warning-feedback feedback-icon" id="address_row2-warning">\n' +
        '        <i class="fa fa-exclamation-circle"></i>\n' +
        '		</div>\n' +
        '    </div>\n' +
        '</div>\n' +

        '<div class="form-group form-space row">\n' +
        '    <label id="address_row9_label" for="address_row9" class="col-md-4 col-form-label">Téléphone :</label>\n' +
        '    <div class="col-md-8">\n' +
        '        <input type="input" tabindex="2" class="form-control" id="address_row9" name="address_row9" maxlength="38" aria-describedby="Téléphone" placeholder="EX : 0102030405" autocomplete="off">\n' +
        '         <div id="address_row9Help" class="invalid-feedback"></div>\n' +
        '        <div class="valid-feedback feedback-icon" id="address_row9-valid">\n' +
        '        <i class="fa fa-check"></i>\n' +
        '        </div>\n' +
        '        <div class="invalid-feedback feedback-icon" id="address_row9-invalid" >\n' +
        '        <i class="fa fa-minus-circle"></i>\n' +
        '        </div>\n' +
        '    </div>\n' +
        '</div>\n' +

        '<div class="form-group form-space row" >\n' +
        '    <label id="address_row8_label" for="address_row8" class="col-md-4 col-form-label">E-mail :</label>\n' +
        '    <div class="col-md-8" id="row8">\n' +
        '        <input type="input" tabindex="2" class="form-control" id="address_row8" name="address_row8" maxlength="38" aria-describedby="Email" placeholder="EX : dominique.dupont@laposte.fr" autocomplete="off"><i class="fa fa-circle-o-notch fa-spin text-primary hide loading" aria-hidden="true"></i>\n' +
        '		 <div id="address_row8Help" class="invalid-feedback"></div>\n' +
        '        <div class="valid-feedback feedback-icon" id="address_row8-valid">\n' +
        '        <i class="fa fa-check"></i>\n' +
        '        </div>\n' +
        '        <div class="invalid-feedback feedback-icon" style="margin-bottom:23px" id="address_row8-invalid" >\n' +
        '        <i class="fa fa-minus-circle"></i>\n' +
        '        </div>\n' +
        '        <div class="warning-feedback feedback-icon" style="margin-bottom:23px"  id="address_row8-warning">\n' +
        '        <i class="fa fa-exclamation-circle" ></i>\n' +
        '		</div>\n' +
        '		<span id="row8_message" value=""></span>\n' +
        '    </div>\n' +

        '</div>\n' +

                '<div class="form-group form-space row has-feedback m-0">\n' +
                '    <div class="col-md-12 d-flex flex-row-reverse flex-wrap justify-content-start">\n' +
                '        <button class="btn  btn-secondary font-weight-bold btn-lg float-center" style="float:right" disabled tabindex="7" title="Effectue une RNVP sur la l\'adresse saisie\net affiche des indicateurs en retour." id="btn_validate" type="submit">VALIDER VOTRE SAISIE</button>\n' +
                '		 <button class="btn btn-success btn-lg font-weight-bold float-center" style="float:right" disabled type="button" id="controler_votre_adresse" title="Controler votre addresse." >CONTRÔLER VOTRE ADRESSE</button>\n' +
                '        <button class="btn float-center" type="reset" id="btn_clear" style="float:right;" title="Efface le contenu du formulaire."><i class="fas fa-redo"></i>&nbsp;&nbsp;EFFACER</button>\n' +
                '        <button class="btn btn-primary" tabindex="8" type="button" id="btn_copy" role="WholeAdrClipboard" title="Copie l\'adresse dans le presse-papier." class="collapse">Copier l\'adresse complète</button>\n' +
                '    </div>\n' +

        '</div>\n' +
        '</form>\n';
      html = html + htmlCodeGender + htmlCodeAddressRow1 + htmlCodeAddress; // jshint ignore:line
    }

    return html;
  };

  $.fn.updateFinal = function() {
    var strcb = "";
    var address = {};


    if (options.upperCaseFields) {
      $('form').find("input[type=input], input[type=password], textarea").each(function() {
        $(":input").each(function() {
          this.value = this.value.toUpperCase();
        });
      });
    }
    if (options.oneFieldAddressRow1) {

      strcb += $('input:radio:checked').val() !== "" ? $('input:radio:checked').val() + " " + "" : "";


      strcb += $("#address_row1").val() !== "" ? $("#address_row1").val() + "\n" : "";



      if ($("#address_row1").val() == "") {

        strcb = "";
        address["address_row1"] = ""; // jshint ignore:line
      }
    } else {

      strcb += $('input:radio:checked').val() !== "" ? $('input:radio:checked').val() + " " + "" : "";
      if (options.orderFieldAddressRow1 == "first_name;last_name") {
        strcb += $("#address_row1_first_name").val() !== "" ? $("#address_row1_first_name").val() + " " : "";
        strcb += $("#address_row1_last_name").val() !== "" ? $("#address_row1_last_name").val() + "\n" : "";
      } else {
        strcb += $("#address_row1_last_name").val() !== "" ? $("#address_row1_last_name").val() + "\n" : "";
        strcb += $("#address_row1_first_name").val() !== "" ? $("#address_row1_first_name").val() + " " : "";
      }

      if (($("#address_row1_first_name").val() == "") && ($("#address_row1_last_name").val() == "")) {
        strcb = "";
        address.address_row1 = "";
      }
    }

    strcb += $("#address_row2").val() !== "" ? $("#address_row2").val() + "\n" : "";
    address["address_row2"] = $("#address_row2").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row2").val() + "</div>\n" : ""; // jshint ignore:line


    strcb += $("#address_row3").val() !== "" ? $("#address_row3").val() + "\n" : "";
    address["address_row3"] = $("#address_row3").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row3").val() + "</div>\n" : ""; // jshint ignore:line


    strcb += $("#address_row4").val() !== "" ? $("#address_row4").val() + "\n" : "";
    address["address_row4"] = $("#address_row4").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row4").val() + "</div>\n" : ""; // jshint ignore:line


    strcb += $("#address_row5").val() !== "" ? $("#address_row5").val() + "\n" : "";
    address["address_row5"] = $("#address_row5").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row5").val() + "</div>\n" : ""; // jshint ignore:line


    strcb += $("#address_row6").val() !== "" ? $("#address_row6").val() + "\n" : "";
    address["address_row6"] = $("#address_row6").val() !== "" ? "<div title='Cliquez pour copier'>" + $("#address_row6").val() + "</div>" : ""; // jshint ignore:line

    return strcb.toUpperCase();
  };

  $.fn.getTypeAddressRow4 = function(commune) {

    var communes_arrondissements = ["PARIS", "LYON", "MARSEILLE"];
    var typeAddressRow4 = "";
    if (communes_arrondissements.indexOf(commune) !== -1) {
      typeAddressRow4 = "address_row4_acheminement_label";
    } else {
      typeAddressRow4 = "address_row4_insee_code";
    }
    return typeAddressRow4;
  };

  $.fn.AjaxRetry = function(params, callback) {

    var timeOutId = window.setTimeout(function() {}, 0);
    while (timeOutId--) {
      window.clearTimeout(timeOutId);
    }

    var initTimeOutCount = 0;
    var ajaxRequest = function() {
      $.ajax({
          url: params.urlWS,
          type: 'GET',
          datatype: 'json',
          tryCount: initTimeOutCount,
          retryLimit: options.maxRetries,
          timebeforeTA: options.maxRetriesTimeout,
          timeout: options.ajaxTimeout, // timeOutArr[initTimeOutCount], //
          crossDomain: true,
          headers: {
            "X-Okapi-Key": $.fn.resultLicense()
          },
          beforeSend: function() {
            $(params.object).siblings('i').removeClass('hide');
          },
          success: function(data) {
            var addressList = $.fn.retrieveAddressFromSerca(data, $(params.object)[0].id, options);
            clearTimeout(timeOutId);

            callback(addressList);
          },
          dataFilter: function(data) {
            var datax = JSON.parse(data);


            if ($(params.object)[0].id == "address_row3" && params.numero_address_row4 !== "") {
              for (var i = datax.reponse.adresse.length - 1; i >= 0; i--) {
                if (datax.reponse.adresse[i].ligne4.numero !== params.numero_address_row4) {
                  datax.reponse.adresse.splice(i, 1);
                }
              }
            }
            if ($(params.object)[0].id == "address_row3") {

              var empty_adr_element = {

              };
              datax.reponse.adresse.unshift(empty_adr_element);
            }

            return JSON.stringify(datax);
          },
          error: function(xhr, status) {
            if (status == 'timeout') {
              this.tryCount++;
              initTimeOutCount++;
              if (this.tryCount <= this.retryLimit) {

                var newTimeOutDelay = parseInt(this.timebeforeTA + ((this.tryCount * 10) / 100 * 10000));
                timeOutId = setTimeout(ajaxRequest, parseInt(newTimeOutDelay));
              }
              return;
            }
          }
        })
        .always(function() {
          $(params.object).siblings('i').addClass('hide');
        });
    };

    ajaxRequest();
  };

  $.fn.AjaxRetryMascadia = function(params) {

    var timeOutId = window.setTimeout(function() {}, 0);
    while (timeOutId--) {
      window.clearTimeout(timeOutId);
    }
    var initTimeOutCount = 0;
    var ajaxRequest = function() {
      $.ajax({
        url: params.urlWS,
        type: 'GET',
        datatype: 'json',
        tryCount: initTimeOutCount,
        retryLimit: options.maxRetries,
        timebeforeTA: options.maxRetriesTimeout,
        timeout: options.ajaxTimeout,
        crossDomain: true,
        headers: {
          "X-Okapi-Key": $.fn.resultLicense()
        },
        beforeSend: function() {},
        success: function(data) {
          $.fn.retrieveAddressFromSercaMascadia(data, $(params.object)[0].id, options);
          clearTimeout(timeOutId);

        },
        dataFilter: function(data) {
          var datax = JSON.parse(data);
          return JSON.stringify(datax);
        },
        error: function(xhr, status) {
          if (status == 'timeout') {
            this.tryCount++;

            if (this.tryCount <= this.retryLimit) {
              $("#erreur_information").remove();

              var newTimeOutDelay = parseInt(this.timebeforeTA + ((this.tryCount * 10) / 100 * 10000));
              timeOutId = setTimeout(ajaxRequest, parseInt(newTimeOutDelay));
            }
            return;
          }


        }
      });
    };
    ajaxRequest();
  };


  $.fn.AjaxRetryMailAuto = function(params, callback) {

    var timeOutId = window.setTimeout(function() {}, 0);

    while (timeOutId--) {
      window.clearTimeout(timeOutId);
    }
    var initTimeOutCount = 0;
    var ajaxRequest = function() {
      $.ajax({
          url: params.urlWS,
          type: 'GET',
          datatype: 'json',
          tryCount: initTimeOutCount,
          retryLimit: options.maxRetries,
          timebeforeTA: options.maxRetriesTimeout,
          timeout: options.ajaxTimeout,
          crossDomain: true,
          headers: {
            "X-Okapi-Key": $.fn.resultLicense()
          },
          beforeSend: function() {
            $(params.object).siblings('i').removeClass('hide');
          },
          success: function(data) {
            var addressList = $.fn.retrieveAddressFromSerca(data, $(params.object)[0].id, options);
            clearTimeout(timeOutId);
            callback(addressList);
          },
          dataFilter: function(data) {
            var datax = JSON.parse(data);
            return JSON.stringify(datax);
          },
          error: function(xhr, status) {
            if (status == 'timeout') {
              this.tryCount++;

              if (this.tryCount <= this.retryLimit) {
                $("#erreur_information").remove();
                var newTimeOutDelay = parseInt(this.timebeforeTA + ((this.tryCount * 10) / 100 * 10000));
                timeOutId = setTimeout(ajaxRequest, parseInt(newTimeOutDelay));
              }
              return;
            }


          }
        })
        .always(function() {
          $(params.object).siblings('i').addClass('hide');
        });
    };
    ajaxRequest();
  };

  $.fn.copyToClipboard = function(element, full) {
    var $temp = $("<textarea>");
    $("body").append($temp);
    if (full) {
      $temp.val($.fn.updateFinal()).select();
    } else {
      $temp.val($(element).text()).select();
    }
    document.execCommand("copy");
    $temp.remove();
  };
 
  $.fn.findWord = function(word) {
    var words = ['APPT', 'ESC'];
    var final_words = ['APPARTEMENT', 'ESCALIER'];
    var res = words.indexOf(word);
    if (res !== -1) {
      return final_words[res];
    }
    return "";
  };

  $.fn.checkExtend = function(field) {
    var str = field.val().toUpperCase();
    var new_str = "";
    var arrstr = str.split(" ");
    for (var i = 0; i < arrstr.length; i++) {
      var rep = $.fn.findWord(arrstr[i]);
      if (rep !== "") {
        if ((new_str + rep).length <= 38)
          new_str += rep + " ";
        else
          new_str += arrstr[i] + " ";
      } else {
        new_str += arrstr[i] + " ";
      }
    }
    return new_str;
  };

  $.fn.inArray = function(target, array) {
    for (var i = 0; i < array.length; i++) {
      if (array[i] === target) {
        return true;
      }
    }
    return false;
  };

  /**
   * Initialise le plugin pour l'affichage dans une page html.
   * @param $params
   */
  $.fn.sercaForm = function($params) {
    this.each(function() {

      var $this = $(this);


      var defaults = {
        backColor: '',
        upperCaseFields: false,
        title: '',
        autocompleteListStyle: '',
        ihmModelAndVersion: 'bootstrap4',
        login: '',
        password: '',
        maxRetries: 3,
        maxRetriesTimeout: 3000,
        ajaxTimeout: 1000,
        minDelayBeforeCall: 50,
        minLengthBeforeCall: 3,
        autocompletion: {
          row3: false,
          row4_number: true,
          row4_road: true,
          postal_code_locality: true,
          cedex_id: true
        },
        continueOnError: true,
        doRnvp: false,
        rnvp: {
          row3: false,
          row4_number: true,
          row4_road: true,
          postal_code_locality: true,
          cedex_id: true
        },
        nbDisplayedResults: 5,
        oneFieldAddressRow1: true,
        orderFieldAddressRow1: "last-first",
        fullAddressCopyOrder: "address_row1;address_row2;address_row3;address_row4;address_row5;address_row6",
        language: 'fr',
        lockFormRow6: true,
        displayAddressLabel: false,
        corpsProxy: "",
        distantDNSSolr: "https://api.laposte.fr/adviz-ca-fulltext/v1/",
        distantDNSMascadia: "https://api.laposte.fr/adviz-ca-postale/v1/",
        distantDQEAutocompletionMail: "https://api.laposte.fr/adviz-ca-mail-suggest/v1",
        distantDQEMail: "https://api.laposte.fr/adviz-controle-mail/v1",
        distantDQETelephone: "https://api.laposte.fr/adviz-ca-tel/v1"
      };


      options = $.extend(defaults, $params);

      $this.append($.fn.getHtmlForm(options));

      $(".form-control").on("change input", function(event) {
        if (!event.target.value) {
          event.target.classList.add("empty");
        } else {
          event.target.classList.remove("empty");
        }
      });




      if (options.doFullClipboardCopy) {
        $("#btn_copy").show();
      } else {
        $("#btn_copy").hide();
      }


      if (options.upperCaseFields) {
        $('form').find("input[type=input], input[type=password], textarea").each(function() {

          if($(this).attr('id') !== "address_row8"){
                      $(this).addClass("uppercase");
                    }
        });
      }

      $.fn.lockForm = function() {
        $('form').find("input[type=input], input[type=password], textarea").each(function() {
          if (!$.fn.inArray($(this)[0].id.toString(), ["address_row6", "address_row1_first_name", "address_row1_last_name", "address_row1", "address_row8", "address_row9"])) {
            $(this).prop('disabled', true);
          }

          $(this).addClass('empty');

          $(this).removeClass("is-valid");
          $(this).removeClass("is-invalid");
          $(this).removeClass("is-warning");


          $("#row8_message").hide();
          $("#controler_votre_adresse").prop('disabled', true);
        });
      };

      $.fn.unlockControle = function() {
        if ($.trim($("#address_row4").val()).length !== 0 && $.trim($("#address_row6").val()).length !== 0 &&
          $.trim($("#address_row1_last_name").val()).length !== 0 &&
          $.trim($("#address_row1_first_name").val()).length !== 0) {
          $("#controler_votre_adresse").prop('disabled', false);
        } else {
          $("#controler_votre_adresse").prop('disabled', true);
        }
      };

      $("#address_row1_last_name,#address_row1_first_name").on("change input", $.fn.unlockControle);

      $.fn.unlockForm = function() {
        $('form').find("input[type=input], input[type=password], textarea").each(function() {
          $(this).prop('disabled', false);
        });
      };
      $.fn.unlock_4_5_Form = function() {
        $('form').find("input[type=input], input[type=password], textarea").each(function() {
          $("#address_row4").prop('disabled', false);
          $("#address_row5").prop('disabled', false);
        });
        $.fn.unlockControle();
      };



      $.fn.unlock_Bouton_Valider = function() {

        $('form').find("input[type=input], input[type=password], textarea").each(function() {
          $("#btn_validate").prop('disabled', false);
        });
        if ($.trim($("#address_row1_last_name").val()).length !== 0 && $.trim($("#address_row1_first_name").val()).length !== 0 && $.trim($("#address_row6").val()).length !== 0 && $.trim($("#address_row4").val()).length !== 0) {
          $("#btn_validate").prop('disabled', false);
        }
      };


      $.fn.lock_Bouton_Valider = function() {
        $('form').find("input[type=input], input[type=password], textarea").each(function() {
          $("#btn_validate").prop('disabled', true);
        });
      };
      $.fn.unlock_2_3_Form = function() {
        $('form').find("input[type=input], input[type=password], textarea").each(function() {
          $("#address_row2").prop('disabled', false);
          $("#address_row3").prop('disabled', false);
        });
        $.fn.unlockControle();
      };
      if (options.lockFormRow6) {

        $.fn.lockForm();
      } else {
        $.fn.unlockForm();
      }


      if (typeof options.backColor !== 'undefined' && options.backColor.length > 0) {
        $("#address-autocomplete-form").css("background-color", options.backColor);
      }

      $('#btn_clear').click(function() {

        $.fn.updateFinal(true);
        $.fn.lock_Bouton_Valider();

        if (options.lockFormRow6) {
          $.fn.lockForm();
          $.fn.lock_Bouton_Valider();
        }
      });

      $('input[type=radio]').change(function() {
        $.fn.updateFinal();
      });
      if (options.oneFieldAddressRow1) {
        $("#address_row1").change(function() {
          $.fn.updateFinal();
        });
      } else {
        $("#address_row1_first_name").change(function() {
          $.fn.updateFinal();
        });
        $("#address_row1_last_name").change(function() {
          $.fn.updateFinal();
        });
      }
      $("#address_row2").change(function() {
        $.fn.updateFinal();
      });
      $("#address_row3").change(function() {
        $.fn.updateFinal();
      });
      $("#address_row5").change(function() {
        $.fn.updateFinal();
      });

      $.widget("ui.autocomplete", $.ui.autocomplete, {
        _renderMenu: function(ul, items) {
          var footer_menu_html = '<li class="ui-state-disabled footer-autocomplete" id="SNAFooter"><a class="ui-state-disabled" target="_blank"><img class="ui-state-disabled" src="images/powered-by-laposte-on-white.png" alt="Avec La Poste"/></a></li>';
          var self = this;
          if (undefined !== items) {
            $.each(items, function(index, item) {
              self._renderItemData(ul, item);
              if (index + 1 === items.length) {
                $(footer_menu_html).appendTo(ul).data("ui-autocomplete-item", item);
              }
            });
          }
        },
        _renderItemData: function(ul, item) {
          $(item.highlightedResult).appendTo(ul).data("ui-autocomplete-item", item);
        }
      });

      /**
       * LIGNE 6 (+5)
       * @param ul
       * @param item
       * @returns {*}
       * @private
       */
      $("#address_row6").autocomplete({
        minLength: options.minLengthBeforeCall,
        autoFocus: true,
        source: function(request, callback) {
          var params = {
            object: $('#address_row6'),
            result: [],
            urlWS: $.fn.getSercaURL($('#address_row6').val(), "address_row6", options) + hlWordsMatch + hlWordsNoFound
          };
          var addressList = $.fn.AjaxRetry(params, callback);
          callback(addressList);
        },
        select: function(event, ui) {
          $("#address_row6").val(ui.item.address_row6).change()
            .attr("insee_code", ui.item.insee_code)
            .attr("libelle_acheminement", ui.item.libelle_acheminement);

          $("#address_row5").val(ui.item.address_row5).change();
          if (options.displayAddressLabel) {
            $.fn.updateFinal();
            $.fn.unlock_4_5_Form();

          }
          return false;
        },
        open: function() {
          $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function() {
          $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
      });

      /**
       * LIGNE 5 (+5)
       * @param ul
       * @param item
       * @returns {*}
       * @private
       */
      $("#address_row5").autocomplete({
        minLength: options.minLengthBeforeCall,
        autoFocus: true,
        source: function(request, callback) {
          var params = {
            object: $('#address_row6'),
            result: [],
            urlWS: $.fn.getSercaURL($('#address_row5').val(), "address_row5", options) + hlWordsMatch + hlWordsNoFound
          };
          var addressList = $.fn.AjaxRetry(params, callback);
          callback(addressList);
        },
        select: function(event, ui) {
          $("#address_row6").val(ui.item.address_row6).change()
            .attr("insee_code", ui.item.insee_code)
            .attr("libelle_acheminement", ui.item.libelle_acheminement);

          $("#address_row5").val(ui.item.address_row5).change();
          if (options.displayAddressLabel) {
            $.fn.updateFinal();
            $.fn.unlock_4_5_Form();

          }
          return false;
        },
        open: function() {
          $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function() {
          $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        }
      });

      /**
       * LIGNE 4
       * @param ul
       * @param item
       * @returns {*}
       * @private
       */
      $("#address_row4").autocomplete({
        minLength: options.minLengthBeforeCall,
        autoFocus: true,
        source: function(request, callback) {
          var params = {
            object: $('#address_row4'),
            result: [],
            urlWS: $.fn.getSercaURL($('#address_row4').val(), $.fn.getTypeAddressRow4($("#address_row6").attr("libelle_acheminement")), options) + hlWordsMatch + hlWordsNoFound
          };
          var addressList = $.fn.AjaxRetry(params, callback);
          callback(addressList);
        },
        select: function(event, ui) {
          $("#address_row4").attr("voie", ui.item.justVoieaddress_row4).attr("numext", ui.item.numext);
          $("#address_row4").val($.trim(ui.item.numext + " " + ui.item.justVoieaddress_row4));
          $("#address_row5").val(ui.item.address_row5).change();
          $("#address_row6").val(ui.item.address_row6).change();
          if (options.displayAddressLabel) {
            $.fn.updateFinal();
          }
          $("#address_row3").autocomplete({
            minLength: 0
          }).focus().autocomplete("search", "");
          event.preventDefault();


        },
        open: function() {
          $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function() {
          $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
          if (options.displayAddressLabel) {
            $.fn.updateFinal();
            $.fn.unlock_2_3_Form();
          }
        },
        change: function() {

          if (options.displayAddressLabel) {
            $.fn.updateFinal();
          }
        }
      });

      /**
       * LIGNE 3
       * @param ul
       * @param item
       * @returns {*}
       * @private
       */
      $("#address_row3").autocomplete({
        minLength: options.minLengthBeforeCall,
        autoFocus: true,
        source: function(request, callback) {
          var params = {
            object: $('#address_row3'),
            numero_address_row4: $("#address_row4").attr("numext"),
            result: [],
            urlWS: $.fn.getSercaURL($('#address_row3').val(), "address_row3", options) + hlWordsMatch + hlWordsNoFound
          };
          var addressList = $.fn.AjaxRetry(params, callback);
          callback(addressList);
        },
        select: function(event, ui) {
          if (ui.item.insee_code !== "-1") {
            $("#address_row3").val(ui.item.address_row3).attr("insee_code", ui.item.insee_code).change();
            $("#address_row4").val(ui.item.address_row4).change();
            $("#address_row5").val(ui.item.address_row5).change();
            $("#address_row6").val(ui.item.address_row6).change();
          } else {
            $("#address_row3").val("").change();
          }
          if (options.displayAddressLabel) {
            $.fn.updateFinal();
          }
          if (event.which === 13) {
            $("#address_row2").focus();
          }
        },
        open: function() {
          $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
          if (options.displayAddressLabel) {
            $.fn.updateFinal();
          }
        },
        close: function() {
          $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
        },
        change: function() {
          if (options.displayAddressLabel) {
            $.fn.updateFinal();
          }
        }
      });

      /**
       * LIGNE 8 (+5)
       * @param ul
       * @param item
       * @returns {*}
       * @private
       */
      $("#address_row8").autocomplete({
        minLength: options.minLengthBeforeCall,
        autoFocus: true,
        source: function(request, callback) {
          var params = {
            object: $('#address_row8'),
            result: [],
            urlWS: $.fn.getSercaURL($('#address_row8_autocompletion').val(), "address_row8_autocompletion", options)
          };
          var addressList = $.fn.AjaxRetryMailAuto(params, callback);
          callback(addressList);
        },
        select: function(event, ui) {

          $("#address_row8").val(ui.item.address_row8).change();
          if (options.displayAddressLabel) {
            $.fn.updateFinal();
          }
          return false;
        },
        open: function() {
          $(this).removeClass("ui-corner-all").addClass("ui-corner-top");
        },
        close: function() {
          $(this).removeClass("ui-corner-top").addClass("ui-corner-all");
          if ($("#address_row8").val().length > 0) {
            $("#address_row8").autocomplete({
              minLength: 0
            }).focus().autocomplete("search", "");
          }



        }
      });

      /**
       * BOUTON controler_votre_adresse (+5)
       * @param ul
       * @param item
       * @returns {*}
       * @private
       */
      $("#controler_votre_adresse").click(function() {
        $.fn.AjaxRetryMascadia({
          object: $('#controler_votre_adresse'),
          result: [],
          urlWS: $.fn.getSercaURL($('#controler_votre_adresse').val(), "controler_votre_adresse", options)
        });

        var mailVal = $('#address_row8').val();
        if (mailVal) $.fn.AjaxRetryMascadia({
          object: $('#address_row8'),
          result: [],
          urlWS: $.fn.getSercaURL(mailVal, "controler_votre_mail", options)
        });

        var telVal = $('#address_row9').val();
        if (telVal) $.fn.AjaxRetryMascadia({
          object: $('#address_row9'),
          result: [],
          urlWS: $.fn.getSercaURL(telVal, "controler_votre_telephone", options)
        });

        $.fn.unlock_Bouton_Valider();
        //}
      });

      /**
       * LIGNE 4 ONBLUR
       * @param ul
       * @param item
       * @returns {*}
       * @private
       */
      $("#address_row4").blur(function() {
        $.fn.unlockControle();
        $.fn.updateFinal();
      });

      /**
       * LIGNE 6 ONBLUR
       * @param ul
       * @param item
       * @returns {*}
       * @private
       */
      $("#address_row6").blur(function() {
        $.fn.unlockControle();
        $.fn.updateFinal();
      });
      /**
       * CHECKBOX CIVILITÉ
       * @param ul
       * @returns {*}
       * @private
       */
      $("input:checkbox").on('click', function() {
        var $box = $(this);
        if ($box.is(":checked")) {
          var group = "input:checkbox[name='" + $box.attr("name") + "']";
          $(group).prop("checked", false);
          $box.prop("checked", true);
        } else {
          $box.prop("checked", false);
        }
      });
      return $this;
    });
  };


})(jQuery);
