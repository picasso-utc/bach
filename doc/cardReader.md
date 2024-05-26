# Explication du lecteur de carte
## Jcappuchino
On a une applet java qui tourne sous la borne. Elle s'appelle jcappuchino et avec des theard d'écoute pour les evenements de card read cette applet vas envoyer sur un websocket les badge_uid des cartes lus par la badgeuse.

On vas utiliser le module react useWebSocket pour écouter ce websocket et répondre a chaque lecture de carte

Dans App.tsx
```typescript
const {lastMessage, readyState } = useWebSocket('ws://127.0.0.1:8080/cards/listen',
    {
        shouldReconnect: (closeEvent) => true,
        reconnectAttempts: 10,
        reconnectInterval: 5000
    });
```
```typescript
useEffect(() => {
    if (lastMessage !== null) {
        let data = JSON.parse(lastMessage.data)
        if(data.type==="card"){
            if(connexion.type === typeConnexion.LOGOUT){
                dispatch(logInTmpBadge(data.payload))
            }
            else if(connexion.type === typeConnexion.SUCCESSFULL){
                if(basket.length === 0){
                    getLastPurchases(data.payload)
                }
                else{
                    pay(data.payload)
                }
            }
        }
    }
    // eslint-disable-next-line
}, [lastMessage]);
```
