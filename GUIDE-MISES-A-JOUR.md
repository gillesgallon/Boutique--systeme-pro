# SYSTÈME PRO — Procédure de mise à jour (gratuites à vie)

## Politique
- AMIGO SYSTÈME PRO, TOTOCALCIO PRO et HIPPIQUE SYSTÈME PRO : mises à jour gratuites à vie pour les acheteurs disposant d'un achat confirmé.
- Paiement initial : achat unique, aucun abonnement.
- Les nouvelles versions sont envoyées de manière privée après vérification de l'achat.
- La page publique `mises-a-jour.html` permet seulement de consulter les versions, pas de télécharger les programmes.

## Actuellement réalisé
- `versions.json` : catalogue public des versions connues.
- `mises-a-jour.html` : outil public de comparaison des numéros de version.
- Lien vers cette page depuis la boutique.
- Les versions d'AMIGO et HIPPIQUE restent « à confirmer » ; TOTOCALCIO 2.0.8 a été identifiée dans son index HTML le 3 novembre 2026.
- Aucun webhook, espace client, e-mail automatisé ni téléchargement privé n'est encore installé.

## Nouvelle version : publication sûre
1. Tester le programme sur un poste et vérifier la conservation/importation des sauvegardes.
2. Produire un ZIP *client* limité aux seuls fichiers nécessaires (exclure `.git`, anciennes vitrines, sauvegardes, tests, secrets).
3. Calculer une somme SHA256 : `sha256sum NOM-DU-FICHIER.zip`.
4. Déposer le ZIP dans un stockage privé disposant de liens temporaires. **Ne jamais** mettre les archives payantes dans ce dépôt public, ni placer leur URL statique dans `versions.json`.
5. Modifier `versions.json` : `latest_version`, `release_status` et `changes`. Ne renseigner une version qu'après validation du ZIP commercial.
6. Vérifier les paiements historiques dans Stripe avant de délivrer une nouvelle version à l'acheteur. Envoi manuel tant que le mécanisme automatisé n'est pas installé.
7. Informer les clients concernés et fournir les instructions de sauvegarde et d'installation.

## Automatisation future — exigences
- Service de backend fiable, endpoint Stripe webhook signé, contrôle de `checkout.session.completed` ET du statut payé.
- Association des produits achetés à des licences/acheteurs, politique d'accès aux mises à jour.
- Stockage privé, liens de téléchargement temporaires et individuels, taux d'utilisation limité.
- Gestion des erreurs, dédoublonnage des événements Stripe, journal d'envoi, désabonnement éventuel des notifications non essentielles.
- Vérification en environnement de test avant mise en production.
- **GitHub Pages ne peut pas à lui seul** vérifier un paiement Stripe ni protéger un fichier accessible au public.

## TOTOCALCIO : attention spéciale
Le logiciel TOTOCALCIO actuel et son dépôt GitHub sont publics. La page de la boutique ne protège donc pas son code. Décider d'une politique de distribution, tester une copie client complète, puis seulement annoncer une livraison privée. La suppression du dépôt public ne révoquera pas les copies déjà téléchargées.
