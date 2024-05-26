document.addEventListener('DOMContentLoaded', async () => {
  // const res = await fetch('./src/data/words.json');
  const res = await fetch('./src/data/words.example.json');
  const data = await res.json();
  // console.log({ data });

  const container = document.getElementById('list');
  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');
  const limit = 50;
  let currentPage = 0;

  function displayPage(page) {
    container.innerHTML = '';
    const start = page * limit; // page -> funktionsparameter = currentPage. der initiale wert von page ist also 0
    const end = start + limit;
    let index = start; // index (global) erhöht sich um die anzahl der generierten elemente pro durchlauf (50)
    // console.log({ index });
    // console.log({ page });

    // die differenz zw. start & end ist immer 50
    for (let i = start; i < end && i < data.length * limit; i++) {
      const pageIndex = Math.floor(i / limit);
      const itemIndex = i % limit;
      const entry = data[pageIndex]?.learnedLexemes[itemIndex];

      if (entry !== undefined) {
        const liItem = document.createElement('li');
        liItem.id = index;
        const textDiv = document.createElement('div');
        textDiv.classList.add('text');
        const audioDiv = document.createElement('div');
        audioDiv.classList.add('audio');

        //# word
        const word = document.createElement('p');
        word.classList.add('word');
        const wordText = entry.text;
        word.innerText = wordText;

        //# translations
        const translations = document.createElement('p');
        translations.classList.add('translation');
        const translationsText = entry.translations.join(', ');
        translations.innerText = translationsText;

        //# button
        const button = document.createElement('button');
        button.classList.add('play');
        button.innerText = '▶';
        button.dataset.url = entry.audioURL;

        container.appendChild(liItem);
        liItem.appendChild(audioDiv);
        liItem.appendChild(textDiv);
        textDiv.appendChild(word);
        textDiv.appendChild(translations);

        word.addEventListener('click', () => {
          word.classList.toggle('hidden');
          const child = word.querySelector('.message');
          if (!child) {
            const messageDiv = document.createElement('div');
            messageDiv.innerText = 'show word';
            messageDiv.classList.add('message');
            word.appendChild(messageDiv);
          } else {
            word.removeChild(child);
          }
        });

        translations.addEventListener('click', () => {
          translations.classList.toggle('hidden');
          const child = translations.querySelector('.message');
          if (!child) {
            const messageDiv = document.createElement('div');
            messageDiv.innerText = 'show translation';
            messageDiv.classList.add('message');
            translations.appendChild(messageDiv);
          } else {
            translations.removeChild(child);
          }
        });

        button.addEventListener('click', () => {
          // audio element wird immer erst on click generiert
          //# audio
          const audioPlayer = document.createElement('audio');
          audioPlayer.src = entry.audioURL;
          audioPlayer.play();

          audioDiv.appendChild(audioPlayer);
        });

        audioDiv.appendChild(button);
        index++;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        // console.log({ wordText, translationsText, itemIndex, pageIndex });
      }
    }
    const pageCounter = document.getElementById('page');
    pageCounter.innerText = currentPage + 1;

    prevButton.disabled = page === 0;
    nextButton.disabled = end >= data.length * limit;
  }

  // erst on click werden immer die 50 nächsten/vorherigen li elemente generiert
  prevButton.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      // console.log({ currentPage });
      displayPage(currentPage);
    }
  });

  nextButton.addEventListener('click', () => {
    if ((currentPage + 1) * limit < data.length * limit) {
      currentPage++;
      // console.log({ currentPage });
      displayPage(currentPage);
    }
  });

  // console.log({ currentPage });
  displayPage(currentPage);
});

//# hide/display all words or translations --------------------------

const hideWordsButton = document.getElementById('hide-words');
const showWordsButton = document.getElementById('show-words');
const hideTransButton = document.getElementById('hide-trans');
const showTransButton = document.getElementById('show-trans');

hideWordsButton.addEventListener('click', () => {
  const words = document.getElementsByClassName('word');
  // console.log({ words });
  // HTMLCollection muss zum interieren erst in array umgewandelt werden
  [...words].forEach((word) => {
    if (!word.classList.contains('hidden')) {
      word.classList.add('hidden');
      const messageDiv = document.createElement('div');
      messageDiv.innerText = 'show word';
      messageDiv.classList.add('message');
      word.appendChild(messageDiv);
    }
  });
  hideWordsButton.classList.add('hidden');
  showWordsButton.classList.remove('hidden');
});

showWordsButton.addEventListener('click', () => {
  const words = document.getElementsByClassName('word');
  // console.log({ words });
  [...words].forEach((word) => {
    if (word.classList.contains('hidden')) {
      word.classList.remove('hidden');
      const child = word.querySelector('.message');
      word.removeChild(child);
    }
  });
  showWordsButton.classList.add('hidden');
  hideWordsButton.classList.remove('hidden');
});

hideTransButton.addEventListener('click', () => {
  const trans = document.getElementsByClassName('translation');
  // console.log({ trans });
  [...trans].forEach((trans) => {
    if (!trans.classList.contains('hidden')) {
      trans.classList.add('hidden');
      const messageDiv = document.createElement('div');
      messageDiv.innerText = 'show translation';
      messageDiv.classList.add('message');
      trans.appendChild(messageDiv);
    }
  });
  hideTransButton.classList.add('hidden');
  showTransButton.classList.remove('hidden');
});

showTransButton.addEventListener('click', () => {
  const trans = document.getElementsByClassName('translation');
  // console.log({ trans });
  [...trans].forEach((trans) => {
    if (trans.classList.contains('hidden')) {
      trans.classList.remove('hidden');
      const child = trans.querySelector('.message');
      trans.removeChild(child);
    }
  });
  showTransButton.classList.add('hidden');
  hideTransButton.classList.remove('hidden');
});

//# dark mode settings ----------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.add('');
  }

  // in ios safari ist die minimierte adressleiste auch damit immernoch hell idk :/
  function updateThemeColor() {
    const themeColorMetaTag = document.querySelector(
      'meta[name="theme-color"]'
    );
    if (document.body.classList.contains('dark-mode')) {
      themeColorMetaTag.setAttribute('content', '#7384f4');
    } else {
      themeColorMetaTag.setAttribute('content', '#3a3695');
    }
  }
  updateThemeColor();
});
