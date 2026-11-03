# SYSTÈME PRO — Boutique GitHub Pages

Site : https://gillesgallon.github.io/Boutique--systeme-pro/

## Catalogue — tarifs décidés le 3 novembre 2026

| Produit | Prix public | Paiement |
| --- | ---: | --- |
| AMIGO SYSTÈME PRO | 49,90 € | Nouveau lien Stripe requis |
| TOTOCALCIO PRO | 49,90 € | Nouveau lien Stripe requis |
| HIPPIQUE SYSTÈME PRO | 49,90 € | Nouveau lien Stripe requis |
| Pack des trois | 108 € | Produit, tarif et lien Stripe requis |

Prix séparés totalisant 149,70 €, réduction pack de 41,70 €.

Les anciens liens Stripe (35 € et 39 €) ne sont plus affichés comme boutons d'achat sur la boutique, car ils ne correspondent plus aux prix publics souhaités. Ils peuvent rester actifs dans le tableau de bord Stripe jusqu'à leur désactivation explicite et doivent être vérifiés avant diffusion.

## Sécurité de la livraison

**Ne jamais publier les ZIP/HTML complets des logiciels vendus dans un dépôt GitHub Pages public.** Un fichier public accessible via le site n'est pas protégé par le paiement.

Pour automatiser correctement la livraison :
1. Conserver les fichiers dans un stockage privé, jamais dans ce dépôt.
2. Configurer un webhook Stripe `checkout.session.completed` sur un service serveur (et vérifier la signature).
3. Vérifier le statut réel du paiement et l'identité du produit commandé.
4. Générer un lien de téléchargement temporaire et individuel, à usage limité.
5. Envoyer le lien à l'adresse e-mail de l'acheteur ; enregistrer l'envoi et prévoir un renvoi en cas d'échec.
6. Tester tous les parcours en mode test avant activation en production.

Une page de remerciement statique seule ne prouve pas le paiement et ne doit pas contenir les fichiers vendus.

## Éléments de vente à compléter avant commercialisation

- Identité commerciale et moyens de contact du vendeur
- Mentions légales, conditions générales de vente, politique de confidentialité
- Conditions de fourniture du contenu numérique et règles applicables au droit de rétractation
- Modalités de support, compatibilité et téléchargement
- Vérification des droits d'utilisation des images de la boutique

## Modification GitHub Pages

Le fichier `index.html` contient la page publique. La branche principale est `main`. Les boutons non configurés restent désactivés pour éviter les achats trompeurs.

## Liens précédemment utilisés (anciens tarifs, ne pas republier)

- AMIGO : ancien lien à 35 €.
- TOTOCALCIO : ancien lien à 39 €.
- HIPPIQUE : ancien lien à 35 € trouvé dans Stripe.

Les nouveaux liens devront être vérifiés côté Stripe en mode réel avant publication.
