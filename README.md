# DeckIt
### *Your pocket vocabulary*

**DeckIt** is an Angular PWA designed to create and manage your personal vocabulary, born from the personal need to have a dedicated place for storing and reviewing **Japanese words**.

The goal is not just to preserve the words you've learned, but to turn the vocabulary into a tool that's also useful for **reviewing, memorizing, and continuing to learn**.

Thanks to a **flashcard** system, **streaks**, and a **customized virtual keyboard**, DeckIt aims to make learning simpler and more accessible, while keeping your vocabulary always at hand.

## License
This is a personal project, developed for private use. The code is not distributed under an open source license and all rights are reserved.

### Features

#### Vocabulary
The main section of the application allows you to:
* Add new words to your vocabulary;
* Edit existing words;
* Remove words;
* View and analyze each word in detail;

#### Categories
Words can be organized through custom categories, and in the "Categories" section it is possible to:
* Create new categories;
* Edit existing categories;
* Delete categories;
* Search and filter words based on category.

#### Custom keyboard
One of the central elements of DeckIt is the **custom virtual keyboard**, designed to make it easier to enter Japanese words and their characters. The keyboard aims to make it more immediate to write content that might be difficult to enter using only the device's traditional keyboard.

## In development

### Statistics
A section dedicated to the user's personal statistics, with information such as:
* Number of words stored;
* Number of categories;
* Mistakes made;
* Number of reviews performed;
* Learning progress trends;
* Streaks and progress.

### Review
The review system will be based mainly on **flashcards**, with different types of exercises to test knowledge of words.

Among the planned features:
* Word recognition and translation;
* Review of mistakes;
* Verification of the correct translation;
* Recognition of the correct **Kanji**;
* Repetition of the most difficult words;
* Streak system to encourage consistency.

The goal is to turn the simple vocabulary into a true **learning tool**.

## Future
DeckIt will continue to evolve with new features dedicated to learning and vocabulary management.

Among the future features:
* Phrases associated with individual words, to be able to see and store examples of usage;
* More advanced learning statistics and analysis;
* Increasingly personalized review systems;
* Additional languages with different writing systems, such as Russian or Arabic

## Technologies
DeckIt is built with **Angular 19.2** as a PWA.
- **Frontend**: Angular, Bootstrap
- **Backend / Database**: Supabase
- **Deploy**: Vercel

## Struttura del progetto

```
DeckIt/
├── public/              # Icone, assets statici
├── scripts/             # Script per generare environment.ts con le variabili Vercel
└── src/
    ├── app/
    │   ├── component/    # Componenti riutilizzabili
    │   ├── layout/       # Layout dell'applicazione
    │   ├── page/         # Pagine dell'app
    │   ├── service/      # Servizi (auth-service, data-service, ecc.)
    │   ├── guards/        # Guard per login e autenticazione
    │   └── core/          # supabase.client.ts, utils, models
    └── environments/      # Cartella popolata al deploy su Vercel
```

## Installation and setup

Clone the repository and install the dependencies:
​```bash
git clone <repo-url>
cd deckit
npm install
​```

Start the development server:
​```bash
ng serve
​```

The application will be available at `http://localhost:4200/`.

### Production build
​```bash
ng build
​```
The compiled files will be generated in the `dist/` folder.

## Goal

DeckIt was born from a simple idea:
> **Always have your vocabulary in your pocket.**

A place to store the words you're learning, to be able to consult them when needed, and at the same time, to gradually turn them into knowledge through review.
**DeckIt — Your pocket vocabulary.**
