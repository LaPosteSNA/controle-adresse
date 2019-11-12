# controle-adresse

## Installation de vos identifiants

Référez-vous à la documentation à télécharger sur votres espace client.

## Installation du plugin

Récupérez dans le fichier **code.html** le code à inclure entre les balises `<head>` et `</head>` de votre site (ou au moins de la page qui accueillera le formulaire) ainsi qu'une ligne à insérer à l'endroit de votre page où s'affichera le formulaire.

## Paramétrage du formulaire

Modifier le paramètre **action** du formulaire selon l'endroit où vous souhaitez envoyer les données.
La modification doit se faire dans le fichier `jquery.serca-form.min.js`

```html
<form id="address-autocomplete-formu" class="containerca" autocomplete="off" action="VotreDestination" method="POST">
```

## Paramétrages avancés

Vous avez le droit d'adapter le code du formulaire à vos besoins.
La documentation téléchargeable dans votre espace client comprend toute l'information nécessaire sur les bonnes et mauvaises pratiques.

Les fichiers relatifs au formulaire et à ses paramètres sont *minifiés*. Les fichiers utilisés sont dans le répertoire `src/js` et leur version non minifiée dans `dist/js`
