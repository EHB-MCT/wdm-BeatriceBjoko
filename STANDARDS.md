## React – Conventies & Design Patterns

1. Conventies

- Projectstructuur / mapindeling:

Gebruik een duidelijke mappenstructuur volgens feature of component: Plaats bestanden die logisch bij elkaar horen in dezelfde map.

Beperk diepe mappen­nesting: te veel submappen maakt importeren en navigeren lastig.

🔗 Bron: Handsonreact – Code Organization Conventions (https://handsonreact.com/docs/code-organization-conventions?utm_source=chatgpt.com)

- Naamgeving van componenten, bestanden, variabelen:

React-component: PascalCase (elk woord met hoofdletter)
De bestandsnaam van het component moet overeenkomen met de componentnaam

- Props

Gebruik beschrijvende namen voor props, zodat hun betekenis direct duidelijk is.

Vermijd afkortingen of te cryptische namen, tenzij ze binnen de context duidelijk zijn.
Bijvoorbeeld: gebruik user ipv usr

- State-variabelen

Bij booleaanse state-variabelen gebruik je prefixes zoals is, has of should om te duiden dat het een boolean is.
De setter-functie hoort logisch bij de state

- Event Handlers

Gebruik prefix handle voor event handler-functies. Dit maakt direct duidelijk dat die functie iets afhandelt in de UI.

- CSS-klassen / classNames

Gebruik lowercase letters met streepjes (kebab-case) voor CSS-klassennamen.

- Constanten

Gebruik uppercase met underscores (UPPER_SNAKE_CASE) voor constanten in JavaScript.
Bijvoorbeeld

- Utility / helper functies

Geef functies namen die direct hun doel aangeven. Zorg dat de naam de functie laat vermoeden (wat hij doet), zodat je niet steeds hoeft te kijken naar de implementatie.

🔗 Bron: https://dev.to/kristiyanvelkov/react-js-naming-convention-lcg

- Testing

Test componenten met Jest of Vitest en plaats testbestanden in dezelfde map

🔗 Bron: https://medium.com/@obrm770/best-practices-and-design-patterns-in-react-js-for-high-quality-applications-6b203be747fb

2. Design Patterns

- Container / Presentational Pattern

Splits logica en weergave: Container component: bevat state, data fetching en logica.
Presentational component: toont enkel de UI op basis van props.

🔗 Bron: https://medium.com/@agamkakkar/react-design-patterns-best-practices-for-building-scalable-and-maintainable-apps-70a1220eba92

- Lazy Loading & Error Boundaries

Lazy Loading: gebruik React.lazy() en Suspense om componenten pas te laden wanneer ze nodig zijn. Error Boundaries: vangen fouten in onderliggende componenten op en tonen een fallback UI.

🔗 Bron: https://www.telerik.com/blogs/react-design-patterns-best-practices?utm_source=chatgpt.com

🔗 Bron: https://www.geeksforgeeks.org/reactjs/react-design-patterns/

## Node.js / Express – Conventies & Design Patterns

-- Main entry point: `index.js`

- Routes (future): stored in `/routes`
- Controllers (future): stored in `/controllers`
- Database (future): stored in `/models`

## Docker – Conventies & Design Patterns

- Each service has its own Dockerfile
- Multi-container managed by `docker-compose.yml`

## Git - Conventies & Design Patterns

- Branch names follow `feature/...`, `fix/...`, or `hotfix/...`
- Commit messages follow conventional commits

# Data Flow

- The frontend sends JSON via `fetch` to the backend (port 5000).
- The backend processes data and interacts with MongoDB.
- MongoDB stores JSON-like documents (questions, users, analytics).
