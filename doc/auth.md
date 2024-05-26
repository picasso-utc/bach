# Explication du fonctionnement du système d'authenfication
## Récupération de session
Au chargement de la page on vas récupérer depuis le local storage les informations d'authentification s'il y en a

Dans App.tsx:
```typescript
const connexionInfo = localStorage.getItem("@auth_info");
    if (connexionInfo != null) {
      const connexionInfoParsed = JSON.parse(connexionInfo);
      if (connexionInfoParsed.sessionId !== connexion.connect.user.sessionId) {
        dispatch(
          logInSuccess({
            sessionId: connexionInfoParsed.sessionId,
            username: connexionInfoParsed.username,
          }),
        );
      }
    }
```
## Connexion
La connexion peut se faire de 2 manières:
### Badge
Si on n'est pas connecter, a chaque lecture de badge on vas stocker dans le state le badge id qui viens d'être lu. On vas aussi changer le state de connexion et donc cela vas faire apparaitre l'interface pour rentrer votre pin

Dans App.tsx: 
```typescript
if(connexion.type === typeConnexion.LOGOUT){
    dispatch(logInTmpBadge(data.payload))
}
```

Le reste de la logique de connexion est dans connexion.tsx ou après qu'on ai rentrer notre pin qui a une longeur de 4 on vas envoyer une requête a notre serveur api avec le badge_id et le pin.
```typescript
apiRequest("POST", "bach/login/badge", { badge_uid: badge_uid, pin: pinFunc })
```

Le sessionid et le username sont aussi sotcker dans le localstorage pour que la connexion persiste aussi longtemps que la session est valide (La requête qu'on fait après que la session n'est plus valide vas fail et donc on vas se logout et vider le localstorage)
```typescript
localStorage.setItem(
                "@auth_info",
                JSON.stringify({
                  username: res.data.username,
                  sessionId: res.data.sessionid,
                }),
            );
```
### CAS
Pour le cas on a la même logique mais on utilise le CAS quand aucune badgeuse n'est connecter 
