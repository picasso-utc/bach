# Documentation complète

Documentation des bornes du Pic. Les bornes permettent aux utilisateurs d'effectuer des achats au sein du Pic, elles ont une fonction de mise en veille et doivent être déverouillées pour un memebre de l'association.

## 1. Architecture 

Les bornes du Pic ne sont ni plus ni moins qu'un simple site suivant le framework **React** affiché en plein écran sur les deux écrans des bornes (oui c'est decevant je sais). Pour celles et ceux qui n'ont jamais codé en React ou qui ne sont pas très familier avec la stack voici un petit récap de ce qu'est React et commment il s'applique à se projet.

### React, c'est des briques qui s'assemblent

Imaginez que votre interface est une construction en LEGO. Chaque **composant React** est une brique réutilisable :

- Un bouton = 1 brique
- Un formulaire de connexion = 1 brique (qui contient des petites briques : champs de texte, boutons...)
- La page entière = 1 grosse brique (qui contient toutes les autres)

### Les 3 concepts clés pour débuter

#### 1/ **Props** (ce qu'on donne au composant)

Les **Props** sont comme des **arguments** qu'on passe à un composant. C'est ce qui rend un composant réutilisable.

```typescript
// On donne un "nom" au composant Bouton
<Bouton texte="Se connecter" couleur="bleu" />
```

**Règle d'or** : Les Props sont en **lecture seule**. Un composant ne peut jamais modifier ses propres Props.

#### 2/ **State** (la mémoire du composant)

Le **State** est la **mémoire interne** d'un composant. C'est une variable spéciale qui, quand elle change, fait re-dessiner le composant automatiquement.

```typescript
const [pin, setPin] = useState(""); // pin = "" au départ
setPin("1234"); // Changement → React redessine l'écran !
```

**Règle d'or** : Pour modifier le State, utilisez **toujours** la fonction `setXXX`. Ne faites jamais `pin = "1234"` directement.

#### 3/ **Tout est JavaScript** (pas de HTML classique)

Vous n'écrivez pas dans des fichiers `.html` classiques. React utilise du **JSX** : une syntaxe qui ressemble à du HTML mais qui est en fait du JavaScript déguisé.

```typescript
// Ça ressemble à du HTML, mais c'est du JavaScript !
return <div className="container">Bonjour {username}</div>;
```

**Attention** : En JSX, on écrit `className` au lieu de `class` (car `class` est un mot réservé en JavaScript).

---

## 2. Cartographie des Dossiers

### Les fichiers clés

#### `index.tsx` 

C'est le **point d'entrée** de votre application. Il dit à React : "Démarre l'app et affiche-la dans le DOM".

```typescript
ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
```

**Ce qu'il fait** : Trouve l'élément HTML avec l'id `root` (dans `index.html`) et y injecte votre composant `<App />`.

#### `App.tsx`

C'est le **composant racine** de votre application. Tous les autres composants sont des enfants de `App`.

**Ici**, `App.tsx` gère notamment :
- La récupération de la session depuis le `localStorage` au chargement
- La réception des événements de lecture de badge
- Le routage entre les différentes pages

### `node_modules/` : La Zone Interdite ⛔

Ce dossier contient **toutes les dépendances** de votre projet (React, TypeScript, etc.). Il est **généré automatiquement** par npm.

**Règles absolues** :
- ❌ Ne **JAMAIS** modifier les fichiers dedans
- ❌ Ne **JAMAIS** le versionner sur Git (déjà dans `.gitignore`)
- ✅ Si quelque chose plante, supprimez-le et lancez `npm install` pour le régénérer

---

## 3. Quelques Commandes npm

Ces commandes sont définies dans `package.json`. Lancez-les depuis le terminal (Ctrl + ù dans VS Code).

### Installation des dépendances
```bash
npm install
```
**Quand l'utiliser** : À chaque fois que vous clonez le projet ou que quelqu'un ajoute une nouvelle dépendance.

### Lancer le serveur de développement
```bash
npm start
# ou
npm run dev
```
**Quand l'utiliser** : Pour tester l'application en local (généralement sur `http://localhost:5173` ou `http://localhost:3000`).

### Builder pour la production
```bash
npm run build
```
**Quand l'utiliser** : Pour créer une version optimisée de l'app à déployer sur un serveur.

### Lancer les tests (si configurés)
```bash
npm test
```

---

## 4. Debugging

### 1/ La Console du Navigateur (votre meilleure amie)

Appuyez sur **F12** (ou clic droit → Inspecter) pour ouvrir les DevTools.  
Je vous conseille de vite prendre la main car c'est unironically un des meilleurs outils pour débugger du web (ça vous sera utile dans vos UV web ou même pour vos projet perso).

#### Onglet "Console"
C'est là que s'affichent :
- Vos `console.log()`
- Les erreurs JavaScript
- Les warnings React

**Exemple d'utilisation** :
On met un console log pour voir une valeur qui fait planter le code : 
```typescript
function Connexion() {
  const [pin, setPin] = useState("");
  
  console.log("PIN actuel :", pin); // Pour voir la valeur en temps réel
  
  return <input onChange={(e) => setPin(e.target.value)} />;
}
```

#### Onglet "Network"
Permet de voir toutes les requêtes HTTP (API calls). Très utile pour debugger les appels API.  
Selon moi l'outil le plus puissant de devtools.  

### 2/ React Developer Tools

Je vous conseille fortement d'installez l'extension **React Developer Tools** pour Chrome/Firefox.

**Ce qu'elle permet** :
- Voir l'arbre des composants React
- Inspecter les Props et le State de chaque composant en temps réel
- Identifier quel composant cause un re-render

**Comment l'utiliser** : Ouvrez les DevTools (F12) et cliquez sur l'onglet "⚛️ Components".

### 3/ Messages d'erreur courants

#### "Cannot read property 'xxx' of undefined"
**Signification** : Vous essayez d'accéder à une propriété sur un objet qui n'existe pas (ou pas encore).

**Solution** : Utilisez l'**optional chaining** (`?.`)
```typescript
// ❌ Plante si user est null
const name = user.username;

// ✅ Retourne undefined si user est null
const name = user?.username;
```

#### "Too many re-renders"
**Signification** : Vous avez créé une boucle infinie (souvent en appelant `setState` dans le corps du composant).

**Solution** : Mettez les appels à `setState` dans un `useEffect` ou un gestionnaire d'événement.

```typescript
// ❌ Boucle infinie
function Composant() {
  const [count, setCount] = useState(0);
  setCount(count + 1); // Se ré-exécute à chaque render !
}

// ✅ Correct
function Composant() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1); // S'exécute 1 seule fois au montage
  }, []); // Le [] signifie "seulement au montage"
}
```

### 4/ Checklist de debugging

Quand quelque chose ne marche pas :
1. ✅ Vérifiez la **Console** (F12) : y a-t-il une erreur ?
2. ✅ Ajoutez des `console.log()` pour tracer l'exécution
3. ✅ Vérifiez que vos dépendances sont installées (`npm install`)
4. ✅ Relancez le serveur de dev (`npm start`)
5. ✅ Si tout plante, supprimez `node_modules/` et relancez `npm install`


---

### Le mot de la fin

> Rédigé en **A25** par votre super Resp Info, **Clément Chazelas**.
>
> J'encourage mes successeurs à étoffer cette rapide documentation, pour ceux qui viendront après.
> Ne laissont pas ce super projet subir le cycle de renouvellement qu'on voit bien trop souvent dans le paysage associatif de notre belle école.
> 
> **Have fun !** 


To learn React, check out the [React documentation](https://reactjs.org/).
