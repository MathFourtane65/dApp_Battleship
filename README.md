
# dApp Battleship

### Jeu de la bataille navale 

#### J'ai utilisé le "Template Starter" issu de ce repository : https://github.com/XamHans/React-Solidity-Typescript-Starter

FrontEnd : React + Vite + Typescript

BackEnd : Solidity + Hardhat + Typescript






## Grille d'évaluation

 - le smart-contract compile correctement avec "npx hardhat compile" **1pt** [![Generic badge](https://img.shields.io/badge/-FAIT-<GREEN>.svg)](https://shields.io/)
 - le smart-contract est testé par la commande "npx hardhat test" (min 5 tests significatifs) **1pt** [![Generic badge](https://img.shields.io/badge/-FAIT-<GREEN>.svg)](https://shields.io/)
 - le test du smart-contract permet de tester le déploiement du contrat (deux joueurs obligatoires) **1pt** [![Generic badge](https://img.shields.io/badge/-FAIT-<GREEN>.svg)](https://shields.io/)
 - le test du smart-contract permet de tester l'ajout correct d'un bateau sur sa grille **1pt** [![Generic badge](https://img.shields.io/badge/-FAIT-<GREEN>.svg)](https://shields.io/)
- le test du smart-contract permet de tester l'ajout incorrect d'un bateau sur sa grille **1pt** [![Generic badge](https://img.shields.io/badge/-FAIT-<GREEN>.svg)](https://shields.io/)
- le test du smart-contract permet de tester une tentative correcte sur la grille de l'adversaire **1pt** [![Generic badge](https://img.shields.io/badge/-FAIT-<GREEN>.svg)](https://shields.io/)
- le test du smart-contract permet de tester une tentative incorrecte sur la grille de l'adversaire **1pt** [![Generic badge](https://img.shields.io/badge/-FAIT-<GREEN>.svg)](https://shields.io/)
- le test du smart-contract permet de tester une tentative correcte mais par le mauvais joueur sur la grille de l'adversaire **1pt** (gestion des tours) [![Generic badge](https://img.shields.io/badge/-FAIT-<GREEN>.svg)](https://shields.io/)
- le test du smart-contract permet de tester si la partie est terminée **1pt**
- le test du smart-contract permet de tester qui est vainqueur. **1pt**
- l'appli react permet de démarrer une partie (on saisit à la main l'adresse de l'adversaire) **2pts** [![Generic badge](https://img.shields.io/badge/-EN_COURS-orange.svg)](https://shields.io/)
- l'appli react permet de jouer la partie **3pts** [![Generic badge](https://img.shields.io/badge/-EN_COURS-orange.svg)](https://shields.io/)

### Bonus : 
- le test du smart-contract permet de tester l'envoi d'un hash de la position des bateaux en début de partie **2pts**
- le test du smart-contract permet de tester la confirmation d'une tentative de l'adversaire **2pts**
- le test du smart-contract permet de tester l'envoi de la position des bateaux en fin de partie **2pts**

