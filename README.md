# SYSTÈME PRO — Boutique GitHub Pages

Site : https://gillesgallon.github.io/Boutique--systeme-pro/

## Catalogue

| Produit | Prix affiché | Statut |
| --- | ---: | --- |
| AMIGO SYSTÈME PRO | 35 € | Lien Stripe réel installé dans index.html |
| TOTOCALCIO PRO | 39 € | Lien Stripe réel installé sur la fiche et l'accueil |
| HIPPIQUE SYSTÈME PRO | 39 € | Le tarif Stripe actuellement constaté est 35 € ; créer un nouveau tarif à 39 € |
| Pack des trois | 99 € | Produit et tarif Stripe à créer |

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

## Liens connus

- Stripe AMIGO (35 €) : https://buy.stripe.com/5kQdR92gk8a37Ma0Toa3u01
- Stripe TOTOCALCIO (39 €) : https://buy.stripe.com/6oU28r08c4XRgiG59Ea3u02
- Autre lien Stripe réel trouvé sur le compte : associé à HIPPIQUE **35 €**, ne pas utiliser pour le tarif boutique **39 €**.

Les informations de Stripe ci-dessus reflètent un contrôle ponctuel, à revérifier après modification des produits.
