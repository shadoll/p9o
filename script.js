document.addEventListener('DOMContentLoaded', function() {
    const phrases = {
        'la': {  // Latin
            text: 'Omnia possibilia tempore et opibus',
            flag: 'flags/latin.svg',
            name: 'Latin'
        },
        'en': {  // English
            text: 'All things are possible with time and resources',
            flag: 'flags/english.svg',
            name: 'English'
        },
        'uk': {  // Ukrainian
            text: 'Можливо все за наявності ресурсів та часу',
            flag: 'flags/ukrainian.svg',
            name: 'Ukrainian'
        },
        'de': {  // German
            text: 'Alles ist mit Zeit und Ressourcen möglich',
            flag: 'flags/german.svg',
            name: 'German'
        },
        'es': {  // Spanish
            text: 'Todo es posible con tiempo y recursos',
            flag: 'flags/spanish.svg',
            name: 'Spanish'
        },
        'fr': {  // French
            text: 'Tout est possible avec du temps et des ressources',
            flag: 'flags/french.svg',
            name: 'French'
        }
    };
    
    // Preload all flag images
    const preloadedFlags = {};
    Object.keys(phrases).forEach(lang => {
        const img = new Image();
        img.src = phrases[lang].flag;
        preloadedFlags[lang] = img;
    });

    const phraseElement = document.getElementById('phrase');
    const flagBackground1 = document.getElementById('flag-background-1');
    const flagBackground2 = document.getElementById('flag-background-2');
    const quoteContainer = document.querySelector('.quote');
    const progressLine = document.querySelector('.progress-line');
    const nextLangBtn = document.getElementById('next-lang-btn');
    const currentLangNameElement = document.getElementById('current-lang-name');
    
    // Initialize the first background
    flagBackground1.style.backgroundImage = `url('${phrases['la'].flag}')`;

    let currentLang = 'la'; // Start with Latin
    let languages = Object.keys(phrases);
    let switchInterval = 3 * 60 * 1000; // 3 minutes
    let progressInterval;

    // Get browser language if available
    const browserLang = navigator.language.substring(0, 2);

    // Function to animate progress bar
    function startProgressBar() {
        // Reset progress bar
        if (progressInterval) {
            clearInterval(progressInterval);
        }
        progressLine.style.width = '0%';

        // Animate progress bar over switchInterval duration
        const startTime = Date.now();
        progressInterval = setInterval(() => {
            const elapsedTime = Date.now() - startTime;
            const progress = Math.min((elapsedTime / switchInterval) * 100, 100);
            progressLine.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(progressInterval);
            }
        }, 50); // Update every 50ms for smooth animation
    }

    // Function to change the phrase and flag
    function changeLanguage(lang) {
        quoteContainer.classList.add('fade-out');
        
        // Get current and next background elements
        const currentFlag = flagBackground1.classList.contains('active') ? flagBackground1 : flagBackground2;
        const nextFlag = flagBackground1.classList.contains('active') ? flagBackground2 : flagBackground1;
        
        // Prepare the next flag before showing it
        const flagUrl = phrases[lang].flag;
        nextFlag.style.backgroundImage = `url('${flagUrl}')`;
        
        setTimeout(() => {
            // Change the text
            phraseElement.textContent = phrases[lang].text;
            currentLangNameElement.textContent = phrases[lang].name;
            
            // Swap the flags
            currentFlag.classList.remove('active');
            nextFlag.classList.add('active');

            // Reset animation
            quoteContainer.classList.remove('fade-out');
            quoteContainer.classList.remove('visible');

            // Trigger new animation after a short delay
            setTimeout(() => {
                quoteContainer.classList.add('visible');
            }, 50);

            currentLang = lang;

            // Restart progress bar
            startProgressBar();
        }, 1000);
    }

    // Function to get next language
    function getNextLanguage() {
        // Filter out current language
        const availableLangs = languages.filter(lang => lang !== currentLang);
        // Choose random language
        return availableLangs[Math.floor(Math.random() * availableLangs.length)];
    }

    // Add click event to next button
    nextLangBtn.addEventListener('click', function() {
        const nextLang = getNextLanguage();
        changeLanguage(nextLang);

        // Reset the automatic timer when manually changing
        if (window.nextLangTimeout) {
            clearTimeout(window.nextLangTimeout);
        }

        // Set up the next automatic change
        window.nextLangTimeout = setTimeout(automaticChange, switchInterval);
    });

    // Function for automatic language change
    function automaticChange() {
        const nextLang = getNextLanguage();
        changeLanguage(nextLang);
        window.nextLangTimeout = setTimeout(automaticChange, switchInterval);
    }

    // Initial display - Latin
    changeLanguage('la');

    // After 3 minutes, switch to browser language if available, or English
    window.nextLangTimeout = setTimeout(() => {
        const nextLang = phrases[browserLang] ? browserLang : 'en';
        changeLanguage(nextLang);

        // Start random language rotation after first change
        window.nextLangTimeout = setTimeout(automaticChange, switchInterval);
    }, switchInterval);
});
