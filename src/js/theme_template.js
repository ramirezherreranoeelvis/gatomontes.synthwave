(function () {

  const tokenReplacements = {
    /* Red */
    'fe4450': "color: #fff5f6; text-shadow: 0 0 2px #000, 0 0 10px #fc1f2c72, 0 0 5px #fc1f2c72, 0 0 25px #fc1f2c72; backface-visibility: hidden;",
    /* Neon pink */
    'ff7edb': "color: #f92aad; text-shadow: 0 0 2px #100c0f, 0 0 5px #dc078e33, 0 0 10px #fff3; backface-visibility: hidden;",
    /* Yellow */
    'fede5d': "color: #f4eee4; text-shadow: 0 0 2px #393a33, 0 0 8px #f39f0572, 0 0 2px #f39f0572; backface-visibility: hidden;",
    /* Green */
    '72f1b8': "color: #72f1b8; text-shadow: 0 0 2px #100c0f, 0 0 10px #257c5572, 0 0 35px #21272472; backface-visibility: hidden;",
    /* Blue */
    '36f9f6': "color: #fdfdfd; text-shadow: 0 0 2px #001716, 0 0 3px #03edf972, 0 0 5px #03edf972, 0 0 8px #03edf972; backface-visibility: hidden;"
  };


  const themeStylesExist = (tokensEl, replacements) => {
    return tokensEl.innerText !== '' &&
      Object.keys(replacements).every(color => {
        return tokensEl.innerText.toLowerCase().includes(`#${color}`);
      });
  };

  const replaceTokens = (styles, replacements) => Object.keys(replacements).reduce((acc, color) => {
    const re = new RegExp(`color: #${color};`, 'gi');
    return acc.replace(re, replacements[color]);
  }, styles);

  const usingSynthwave = () => {
    const appliedTheme = document.querySelector('[class*="theme-json"]');
    const synthWaveTheme = document.querySelector('[class*="GatomontesRoseIII-synthwave-dark-blue-themes"]');
    return appliedTheme && synthWaveTheme;
  }

  const readyForReplacement = (tokensEl, tokenReplacements) => tokensEl
    ? (
      // only init if we're using a Synthwave 84 subtheme
      usingSynthwave() &&
      // does it have content ?
      themeStylesExist(tokensEl, tokenReplacements)
    )
    : false;

  const initNeonDreams = (disableGlow, obs) => {
    const tokensEl = document.querySelector('.vscode-tokens-styles');

    if (!tokensEl || !readyForReplacement(tokensEl, tokenReplacements)) {
      return;
    }

    const initialThemeStyles = tokensEl.innerText;

    // Replace tokens with glow styles
    let updatedThemeStyles = !disableGlow
      ? replaceTokens(initialThemeStyles, tokenReplacements)
      : initialThemeStyles;

    /* append the remaining styles */
    updatedThemeStyles = `${updatedThemeStyles}[CHROME_STYLES]`;

    const newStyleTag = document.createElement('style');
    newStyleTag.setAttribute("id", "synthwave-84-theme-styles");
    newStyleTag.innerText = updatedThemeStyles.replace(/(\r\n|\n|\r)/gm, '');
    document.body.appendChild(newStyleTag);

    console.log('Synthwave \'84: NEON DREAMS initialised!');
    if (obs) {
      obs.disconnect();
      obs = null;
    }
  };


  const watchForBootstrap = function (mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        // does the style div exist yet?
        const tokensEl = document.querySelector('.vscode-tokens-styles');
        if (readyForReplacement(tokensEl, tokenReplacements)) {
          // If everything we need is ready, then initialise
          initNeonDreams(false, observer);
        } else {
          // sometimes VS code takes a while to init the styles content, so if there stop this observer and add an observer for that
          observer.disconnect();
          observer.observe(tokensEl, { childList: true });
        }
      }
      if (mutation.type === 'childList') {
        const tokensEl = document.querySelector('.vscode-tokens-styles');
        if (readyForReplacement(tokensEl, tokenReplacements)) {
          // Everything we need should be ready now, so initialise
          initNeonDreams(false, observer);
        }
      }
    }
  };

  //=============================
  // Start bootstrapping!
  //=============================
  initNeonDreams(false);
  // Grab body node
  const bodyNode = document.querySelector('body');
  // Use a mutation observer to check when we can bootstrap the theme
  const observer = new MutationObserver(watchForBootstrap);
  observer.observe(bodyNode, { attributes: true });
})();