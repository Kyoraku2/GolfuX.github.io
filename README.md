# GolfuX
Projet minigolf, projet de fin de licence

TODO :
- Faire en sorte de pouvoir forcer le lancement d'une partie s'il y a au moins 2 joueurs (créateur)
- Retirer le joueur d'une partie quand il quitte (si token, au bout de deux tours pas joués ou 30s ?)
- Supprimer une partie vide ou finie
- Détecter la fin de partie coté serveur (pour ça il faut la/les positions du/des trou(s))
- Faire le système de points
- Faire des niveaux
- Afficher la flèche directionnelle pour tous les tirs (sans le % quand ce n'est pas toi qui tir) (Pour ça fait faire en sorte qu'on envoie des co et un vecteur au serveur qui le transmet au reste des joueurs)
- Mode multi local (règles du jeu coté client)


- Détecter quand la balle s'arrête et transmettre sa position finale (Attendre que la balle s'arrête pour pouvoir jouer le tour suivant)
- Calculer vecteur normal portails
- "Stack" de coup à jouer dans le cas où la page est pas chargée.
- Faire en sorte de replacer TOUTES les balles à chaque fin de tour


Bonus :
- Faire en sorte qu'un joueur puisse rejoindre une partie quittée ? (avec les tokens, c'est ce que dado disait)
- Proposer un lien à la création d'une partie pour pouvoir join directement en cliquant dessus