# Livraison automatisée — prototype NON déployé

Prototype serveur de livraison privée après paiement Stripe. Il **n'est pas actif** et il ne faut pas le confondre avec une livraison automatique opérationnelle.

## Infrastructure à créer
1. Compte Cloudflare, Worker, namespace KV et bucket R2 **privé**.
2. Compte Resend (ou autre service d'envoi d'e-mail transactionnel) avec domaine et adresse expéditrice vérifiés.
3. Téléverser les ZIP de vente uniquement dans R2, aux clés `amigo/current.zip`, `hippique/current.zip`, `totocalcio/current.zip`.
4. Installer Node.js et Wrangler, renseigner les identifiants KV/R2 dans `wrangler.toml` et les secrets avec `wrangler secret put`.
5. Déployer le Worker, créer dans Stripe un webhook pour `checkout.session.completed` et `checkout.session.async_payment_succeeded` pointant vers `https://<worker>/stripe/webhook`. Ne jamais recopier un secret dans ce dépôt.
6. Tester intégralement dans un environnement **Stripe test**, avec tarifs et liens de test distincts (les identifiants des prix présents dans le prototype sont ceux du mode réel). Adapter la table `priceProducts` pour les prix de test.
7. Activer en réel seulement après validation des fichiers distribuables, de la compatibilité, des emails, des retours, de la politique de livraison et de la conformité juridique.

## Fonctionnement
- Signature Stripe vérifiée sur les octets bruts avec tolérance temporelle 5 minutes.
- Session récupérée côté serveur et vérifiée payée, correspondance des prix identifiée.
- Liens privés uniques valables 7 jours, fichiers servis depuis R2 privé.
- Email transactionnel d'une confirmation d'achat; dédoublonnage simple par session.
- Le suivi des mises à jour à vie n'est **pas encore automatisé**. Les commandes sont mémorisées dans KV, mais un espace client et un mécanisme de réémission/notification restent à construire.

## Travaux avant production
- Verrouillage par transaction robuste : un KV simple n'est pas transactionnel et peut produire des emails doublons lors d'événements concurrents. Prévoir D1 ou Durable Object/idempotence transactionnelle.
- Enregistrement durable des droits d'accès, réémission des téléchargements après expiration, administration des remboursements et litiges.
- Gestion des notifications de mises à jour gratuite à vie avec respect des préférences e-mail.
- Sécurisation : limitation des requêtes de téléchargement, anti-abus, journaux sans secrets, rotation des clés.
- Paiements différés, état d'achat, suivi des échecs e-mail et tests d'intégration complets.

**Ne pas** publier le code source commercial dans la boutique GitHub Pages : ce dossier ne contient que l'infrastructure d'exemple.
