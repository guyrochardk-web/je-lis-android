# Je lis ! — projet prêt pour compilation APK dans le cloud

Ce dossier contient le prototype web et la configuration Capacitor + GitHub Actions.
Aucun PC n'est nécessaire pour lancer la compilation : le travail est fait par les serveurs GitHub.

## Ce qu'il faut
- Un compte GitHub (gratuit).
- Le navigateur du téléphone.
- Une connexion Internet pour envoyer le projet et récupérer l'APK.

## Étapes depuis Android

1. Téléchargez et décompressez `je_lis_cloud_build.zip` avec l'application Fichiers de votre téléphone.
2. Ouvrez https://github.com et créez un compte ou connectez-vous.
3. Créez un nouveau dépôt, par exemple `je-lis-android`, et choisissez **Public** (les minutes GitHub Actions sont alors généralement disponibles gratuitement pour les dépôts publics).
4. Dans le dépôt, utilisez **Add file > Upload files** et téléversez le contenu décompressé du dossier, en conservant les dossiers `www` et `.github`.
   - Il faut téléverser le contenu du dossier, pas le fichier ZIP lui-même.
   - Vérifiez que `.github/workflows/build-apk.yml` est bien présent dans le dépôt.
5. Validez avec **Commit changes**.
6. Dans le dépôt, ouvrez l'onglet **Actions**. Le workflow « Construire l'APK Je lis ! » démarre automatiquement après le commit.
7. Ouvrez l'exécution terminée avec une coche verte, puis téléchargez l'artefact `je-lis-debug-apk`.
8. Décompressez l'artefact téléchargé : il contient `app-debug.apk`. Touchez ce fichier pour lancer l'installation. Android peut demander d'autoriser temporairement l'installation depuis cette source.

## Si le workflow ne démarre pas
- Vérifiez que le dépôt contient exactement `.github/workflows/build-apk.yml`.
- Ouvrez l'onglet **Actions** et activez les workflows si GitHub le demande.
- Ouvrez le dernier journal d'exécution pour voir l'étape en erreur.

## Notes
- Le workflow génère un APK de débogage (`app-debug.apk`), suffisant pour une installation personnelle et des essais.
- Il n'est pas signé comme une version de publication Play Store.
- Les données de lecture sont stockées localement dans le navigateur WebView de l'application.
- Le projet utilise Capacitor 6.2.1 et Java 17.
- La compilation nécessite Internet côté GitHub, mais l'application installée fonctionne sans connexion pour ses fonctions actuelles.

## Confidentialité
Pour garder le code privé, un dépôt privé est possible, mais les quotas GitHub Actions gratuits dépendent du compte et du type de dépôt. Un dépôt public rend le processus plus simple pour commencer, mais le code est alors visible publiquement. Ne placez aucune donnée personnelle de l'enfant dans le dépôt.
