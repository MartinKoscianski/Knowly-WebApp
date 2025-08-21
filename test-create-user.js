
// Utilitaire fetch pour Node.js
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testAll() {
  // 1. Créer un utilisateur
  const userRes = await fetch('http://localhost:3000/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      notification: null,
      creationAccountDate: new Date().toISOString(),
      lastConnexion: null,
      lastRevision: null,
    }),
  });
  const user = await userRes.json();
  console.log('User created:', user);

  // 2. Créer un dossier
  const folderRes = await fetch('http://localhost:3000/api/folder', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Dossier Test',
      userId: user.id,
    }),
  });
  const folder = await folderRes.json();
  console.log('Folder created:', folder);

  // 3. Créer un set de flashcards
  const setRes = await fetch('http://localhost:3000/api/flashcardSet', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Set Test',
      description: 'Set de test',
      folderId: folder.id,
      userId: user.id,
    }),
  });
  const set = await setRes.json();
  console.log('FlashcardSet created:', set);

  // 4. Créer une flashcard
  const flashcardRes = await fetch('http://localhost:3000/api/flashcard', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recto: 'Recto test',
      verso: 'Verso test',
      hint: 'Indice',
      positionInSet: 1,
      flashcardSetId: set.id,
    }),
  });
  const flashcard = await flashcardRes.json();
  console.log('Flashcard created:', flashcard);

  // 5. Créer une session de révision
  const revisionRes = await fetch('http://localhost:3000/api/revisionSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      currentRevisionFlashcards: [flashcard.id],
      nextRevisionFlashcards: [],
      completedFlashcards: [],
      currentRevisionCycle: 1,
      totalRevisionTime: 0,
      currentRevisionTime: 0,
      totalRevisionsNumber: 1,
      currentRevisionsNumber: 1,
      userId: user.id,
    }),
  });
  const revision = await revisionRes.json();
  console.log('RevisionSession created:', revision);

  // 6. Vérifier les GET pour chaque ressource
  const getUser = await fetch('http://localhost:3000/api/user');
  console.log('GET /user:', await getUser.json());

  const getFolder = await fetch('http://localhost:3000/api/folder');
  console.log('GET /folder:', await getFolder.json());

  const getSet = await fetch('http://localhost:3000/api/flashcardSet');
  console.log('GET /flashcardSet:', await getSet.json());

  const getFlashcard = await fetch('http://localhost:3000/api/flashcard');
  console.log('GET /flashcard:', await getFlashcard.json());

  const getRevision = await fetch('http://localhost:3000/api/revisionSession');
  console.log('GET /revisionSession:', await getRevision.json());
}

testAll().catch(console.error);
