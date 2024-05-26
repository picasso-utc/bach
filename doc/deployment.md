# Explication deploiement
## Pipeline github
Sur le repo github on a mis en place une action github qui build l'application de bach.

Ce build s'execute a chaque nouveau push sur main

## Deploiment server
Un script bash a été écrit sur la machine files du SiMDE et qui se trouve and public_html/download_latest_artifact.sh.

Il suffit juste d'éxécuter ce script après que le build soit finis pour mettre en production la nouvelle version.

## Github Personal access token
Un personal accèss token doit être fournis avec la requête de téléchargement de l'artifact (Nouveau build). On peut en créer sur github dans settings/developper settings/ fine-grained tokens.
Il faut mettre que picasso-utc est le ressource owner et dire que c'est un access token pour le repo de bach et pas les autres.
Il faut donner les permissions de read-only sur actions pour ce token et après l'avoir génerer il faut le mettre dans download_latest_artifact.sh.
Le token actuellement générer est valable jusqu'au 24 mai 2025.
