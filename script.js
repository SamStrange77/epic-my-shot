let gameState = {
  song: null,            // full song object
  lyrics: [],            // array of lyric lines
  currentIndexLyric: 0,
  currentIndexSong: 0,
  initialIndex: 0,
  finalIndex: 0,       // how many lines shown
  maxLines: 0,           // total number of lines
  guesses: 0,
  maxSongGuesses: 0,
  maxLyricGuesses: 0,
  maxAudioGuesses: 0,            // number of wrong guesses
  answerRevealed: false,
  startTimestamp: 0,
  correct: ''  // flag to prevent further guesses
};

let audioGuessed;

let wordsDone = []; 

let buttonEnabled;

let initialDate = new Date("2025-05-18").setHours(0,0,0,0);

let TODAY = new Date().toISOString().split("T")[0];

//localStorage.removeItem("savedState");

let savedState = localStorage.getItem("savedState") ? JSON.parse(localStorage.getItem("savedState")) :
{
  "SongGuesses": [],
  "WonSongToday": false,
  "SongStreak": 0,
  "LastPlayedDateSong": '',
  "LastInteractedDateSong": '',
  "SongAttempts": 0,
  "LyricGuesses": [],
  "WonLyricToday": false,
  "LyricStreak": 0,
  "LastPlayedDateLyric": '',
  "LastInteractedDateLyric": '',
  "LyricAttempts": 0,
  "AudioGuesses": [],
  "WonAudioToday": false,
  "AudioStreak": 0,
  "LastPlayedDateAudio": '',
  "LastInteractedDateAudio": '',
  "AudioAttempts": 0
}

if (new Date(TODAY).toISOString().split("T")[0] != savedState.LastInteractedDateSong)
{
  savedState.SongGuesses = [];
  savedState.SongAttempts = 0;
  savedState.WonSongToday = false;
}
if (new Date(TODAY).toISOString().split("T")[0] != savedState.LastInteractedDateLyric)
{
  savedState.LyricGuesses = [];
  savedState.LyricAttempts = 0;
  savedState.WonLyricToday = false;
}
if (new Date(TODAY).toISOString().split("T")[0] != savedState.LastInteractedDateAudio)
{
  savedState.AudioGuesses = [];
  savedState.AudioAttempts = 0;
  savedState.WonAudioToday = false;
}

async function fetchSongs() {
  // Load all songs (you could also preload a master list if you generate it)
  const files = [
    "the-horse-and-the-infant.json",
    "just-a-man.json",
    "full-speed-ahead.json",
    "open-arms.json",
    "warrior-of-the-mind.json",
    "polyphemus.json",
    "survive.json",
    "remember-them.json",
    "my-goodbye.json",
    "storm.json",
    "luck-runs-out.json",
    "keep-your-friends-close.json",
    "ruthlessness.json",
    "puppeteer.json",
    "wouldnt-you-like.json",
    "done-for.json",
    "there-are-other-ways.json",
    "the-underworld.json",
    "no-longer-you.json",
    "monster.json",
    "suffering.json",
    "different-beast.json",
    "scylla.json",
    "mutiny.json",
    "thunder-bringer.json",
    "legendary.json",
    "little-wolf.json",
    "well-be-fine.json",
    "love-in-paradise.json",
    "god-games.json",
    "not-sorry-for-loving-you.json",
    "dangerous.json",
    "charybdis.json",
    "get-in-the-water.json",
    "six-hundred-strike.json",
    "the-challenge.json",
    "hold-them-down.json",
    "odysseus.json",
    "i-cant-help-but-wonder.json",
    "would-you-fall-in-love-with-me-again.json",
    "the-horse-and-the-infant.json",
    "just-a-man.json",
    "full-speed-ahead.json",
    "open-arms.json",
    "warrior-of-the-mind.json",
    "polyphemus.json",
    "survive.json",
    "remember-them.json",
    "my-goodbye.json",
    "storm.json",
    "luck-runs-out.json",
    "keep-your-friends-close.json",
    "ruthlessness.json",
    "puppeteer.json",
    "wouldnt-you-like.json",
    "done-for.json",
    "there-are-other-ways.json",
    "the-underworld.json",
    "no-longer-you.json",
    "monster.json",
    "suffering.json",
    "different-beast.json",
    "scylla.json",
    "mutiny.json",
    "thunder-bringer.json",
    "legendary.json",
    "little-wolf.json",
    "well-be-fine.json",
    "love-in-paradise.json",
    "god-games.json",
    "not-sorry-for-loving-you.json",
    "dangerous.json",
    "charybdis.json",
    "get-in-the-water.json",
    "six-hundred-strike.json",
    "the-challenge.json",
    "hold-them-down.json",
    "odysseus.json",
    "i-cant-help-but-wonder.json",
    "would-you-fall-in-love-with-me-again.json"
  ];
  
  const songs = await Promise.all(
    files.map(file =>
  fetch("data/" + file)
    .then(res => {
      if (!res.ok) throw new Error("HTTP error " + res.status);
      return res.json();
    })
    .catch(err => {
      console.error("Failed to fetch:", file, err);
    })
)  
  );
  
  return songs;
}

function getRandomElement(arr, seed) {
  return arr[Math.floor(dailyRandom(seed) * arr.length)];
}

function save ()
{
  localStorage.setItem("savedState", JSON.stringify(savedState));
}

function startSongMode(songs) {
  const song = getRandomElement(songs, 40010);
  document.getElementById("input-field").innerHTML = `
    <input list = "song-names" class = "input-fields" id="guess-input-song" placeholder="Type your guess!">
    <button id = "guess-song" class = "guess-buttons" onclick="checkGuessSong(document.getElementById('guess-input-song').value)">Submit</button>
  `; 
  
  let lyricInputBox = document.getElementById('guess-input-song');
  document.getElementById("mode-switch").innerHTML = 
  "<p></p>"
  document.getElementById("guess-input-song").addEventListener("blur", function () {
  console.log('BLUR!')
  const input = this.value;
  const options = Array.from(document.querySelectorAll("#song-names option"))
                       .map(option => option.value);
  console.log(options);
  if (!options.includes(input)) {
    this.value = "";  // Clear the input if not valid
  }
});  
   document.getElementById('guess-input-song').addEventListener("keydown", (event) => {
      if(event.key==="Enter")
      {
        checkGuessSong(lyricInputBox.value);
      }
  }); 
  gameState.song = song;
  gameState.lyrics = song.lyrics;
  gameState.maxLines = song.lyrics.length;
  gameState.guesses = 0;
  gameState.maxSongGuesses = 20;
  gameState.initialIndex = Math.floor(dailyRandom(12)*(gameState.lyrics.length-gameState.maxSongGuesses));
  gameState.currentIndexSong = gameState.initialIndex+1;
  gameState.answerRevealed = false;  

  document.getElementById("tries").innerHTML = `
    <p>Tries remaining: ${gameState.maxSongGuesses - gameState.guesses}
  `;
  showLyricsSong();
  savedState.SongGuesses.forEach(element => {
    checkGuessSong(element, true); 
  });
}

function showLyricsSong ()
{
    document.getElementById("lyrics-box").removeAttribute('hidden')
    const lyricBox = document.getElementById("lyrics-box");
    const linesToShow = gameState.lyrics.slice(gameState.initialIndex, gameState.currentIndexSong);
    lyricBox.innerHTML = linesToShow.join(" ") + ' ... ';
    console.log('... ' + gameState.song.lyrics + ' ???');
}


function checkGuessSong(userInput, auto = false) {
  savedState.LastInteractedDateSong = new Date(TODAY).toISOString().split("T")[0];
  save();
  if (gameState.answerRevealed) return;
  if (userInput === '') return;
  document.getElementById("guess-input-song").value = "";
  
  for (let i = 0; i<document.getElementById("song-names").children.length; i++)
  {
    if (document.getElementById("song-names").children[i].value === userInput)
    {
      document.getElementById("song-names").removeChild(document.getElementById("song-names").children[i]);
    }
  }
  if (!auto)
  {
    savedState.SongGuesses.push(userInput);
  }

  
  save();

  const guess = userInput.trim().toLowerCase();
  const correct = gameState.song.title.trim().toLowerCase();
  
  
  if (guess === correct) 
  {
    document.getElementById("result").innerHTML = `
      <div class = "answer-bubbles correct-answer hoverable">
        ${gameState.song.title}
      </div>
    ` + document.getElementById("result").innerHTML;
    gameState.answerRevealed = true;
    gameState.guesses++;
  document.getElementById("tries").innerHTML = `
    <p>Tries remaining: ${gameState.maxSongGuesses - gameState.guesses}
  `;
    let fullHint =  gameState.lyrics.slice(gameState.initialIndex, gameState.initialIndex+21);
    fullHint = fullHint.join(" ")
    document.getElementById("final-result").style.setProperty("visibility","visible");
    document.getElementById("final-result").innerHTML += `
      <p>You won!<br>
      Number of tries: ${gameState.guesses}<br>
      <br>
      Entire hint:</p>
      <div class = "answer-bubbles final-hint">
        ${fullHint}
      </div>
      <div class = "answer-bubbles correct-answer">
        ${gameState.song.title}
      </div>
    `
    if (!savedState.WonSongToday)
    {
      let LastDate = savedState.LastPlayedDateSong;
      LastDate = new Date(LastDate);
      let today = new Date(TODAY);

      LastDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0)
      if ((today - LastDate)/(1000*60*60*24) > 1)
      {
        savedState.SongStreak = 0;
      }
      savedState.SongStreak++;
      savedState.SongAttempts = gameState.guesses;
      savedState.LastPlayedDateSong = new Date(TODAY).toISOString().split("T")[0];
      savedState.WonSongToday = true;
      save();
    }
    finalResults();
  } 
  else 
  {
    gameState.guesses++;
    document.getElementById("result").innerHTML = `
      <div class = "answer-bubbles wrong-answer hoverable">
        ${userInput}
      </div>
    ` + document.getElementById("result").innerHTML;
    if (gameState.guesses === gameState.maxSongGuesses)
    {
      gameState.answerRevealed = true;
      let fullHint =  gameState.lyrics.slice(gameState.initialIndex, gameState.initialIndex+21);
    fullHint = fullHint.join(" ")
    
      document.getElementById("final-result").style.setProperty("visibility","visible");
    document.getElementById("final-result").innerHTML += `
      <p>You lost<br>
      Number of tries: ${gameState.guesses}<br>
      <br>
      Entire hint:</p>
      <div class = "answer-bubbles final-hint">
        ${fullHint}
      </div>
      <div class = "answer-bubbles correct-answer">
        ${gameState.song.title}
      </div>
    `
    savedState.SongAttempts = -1;
    savedState.SongStreak = 0;
    savedState.WonSongToday = true;
    save();
      finalResults();
    }
    gameState.currentIndexSong++;
    
  document.getElementById("tries").innerHTML = `
    <p>Tries remaining: ${gameState.maxSongGuesses - gameState.guesses}
  `;
    showLyricsSong();
  }
}


function startLyricMode(songs) {
  const song = getRandomElement(songs, 71415);
  document.getElementById("input-field").innerHTML = `
    <input  class = "input-fields" id="guess-input-lyric" placeholder="Type your guess!">
    <button id = "guess-lyric" class = "guess-buttons" onclick="checkGuessLyric(document.getElementById('guess-input-lyric').value)">Submit</button>
  `; 
  document.getElementById("mode-switch").innerHTML = 
  "<p></p>"
  let lyricInputBox = document.getElementById('guess-input-lyric');
   lyricInputBox.addEventListener("input", () =>
  {
     let value = standardize(lyricInputBox.value.trim().toLowerCase());
     console.log('CHANGED!');
     console.log('VALUE: ' + value);
     console.log('FINISHED: ' + wordsDone)
     if (wordsDone.includes(value))
     {
       lyricBoxDisable();
     }
     else
     {
       lyricBoxEnable();
     }
  }
);

  lyricInputBox.addEventListener("keydown", (event) => {
    if (!buttonEnabled) return;
      if(event.key==="Enter")
      {
        checkGuessLyric(lyricInputBox.value);
      }
  });

  lyricBoxEnable();
  gameState.song = song;
  gameState.lyrics = song.lyrics;
  gameState.maxLines = song.lyrics.length;
  gameState.guesses = 0;
  gameState.maxLyricGuesses = 35;
  gameState.finalIndex = Math.floor(dailyRandom(12)*(gameState.maxLines-gameState.maxLyricGuesses)) + gameState.maxLyricGuesses;
  gameState.currentIndexLyric = gameState.finalIndex-1;
  gameState.answerRevealed = false;  
  gameState.correct = gameState.song.words[gameState.finalIndex]
  
  console.log(gameState.lyrics[gameState.finalIndex]);
  document.getElementById("tries").innerHTML = `
    <p>Tries remaining: ${gameState.maxLyricGuesses - gameState.guesses}
  `;
  showLyricsLyric();
  savedState.LyricGuesses.forEach( (element) => { 
    checkGuessLyric(element, true);
  });
}

function showLyricsLyric ()
{
    document.getElementById("lyrics-box").removeAttribute('hidden')
    const lyricBox = document.getElementById("lyrics-box");
    const linesToShow = gameState.lyrics.slice(gameState.currentIndexLyric, gameState.finalIndex);
    lyricBox.innerHTML = '... ' + linesToShow.join(" ") + ' ??? ';
}

function isLetter (str)
{
  
  if( str.length === 1 && str.match(/[a-z]/i))
  {
    return true;
  }
  else{
    return false;
  }
}

function standardize (word)
{
  for (let i = 0; i<word.length; i++)
  {
    if (isLetter(word.charAt(i)))
    {
      continue;
    }
    word = word.substring(0,i) + word.substring(i+1);
    i--;
  }
  return word
}

function checkGuessLyric(userInput, auto = false) {
 
  savedState.LastInteractedDateLyric = new Date(TODAY).toISOString().split("T")[0];
  save(); 
  console.log('HIII')
  
  
  if (!auto)
  {
    savedState.LyricGuesses.push(userInput);
  }

  
  save();

  const guess = standardize(userInput.trim().toLowerCase());
  const correct = gameState.correct.trim().toLowerCase();

  console.log(guess);
  if (userInput === '')
  {
    return;
  }
  document.getElementById("guess-input-lyric").value = "";
  let buttonEnabledLocal = buttonEnabled;
  lyricBoxEnable();
  if (!buttonEnabledLocal) return;
  if (gameState.answerRevealed) return;
  

  wordsDone.push(guess);

  console.log('GUESS: ' + guess);
  if (guess === correct) 
  {
    document.getElementById("result").innerHTML = `
      <div class = "answer-bubbles correct-answer hoverable">
        ${gameState.lyrics[gameState.finalIndex]}
      </div>
    ` + document.getElementById("result").innerHTML;
    gameState.answerRevealed = true;
    gameState.guesses++;
  document.getElementById("tries").innerHTML = `
    <p>Tries remaining: ${gameState.maxLyricGuesses - gameState.guesses}
  `;
    let fullHint =  gameState.lyrics.slice(gameState.finalIndex-36,gameState.finalIndex);
    fullHint = fullHint.join(" ");
    let remainder = gameState.lyrics.slice(gameState.finalIndex+1, Math.min(gameState.maxLines,gameState.finalIndex+20))
    remainder = remainder.join(" ");
    console.log(remainder);
    console.log('FINAL INDEX ' + gameState.finalIndex);
    console.log('LENGTH: ' + gameState.maxLines);
    console.log('FINAL INDEX + 20: ' + (gameState.finalIndex+20));
    document.getElementById("final-result").style.setProperty("visibility","visible");
    document.getElementById("final-result").innerHTML += `
      <p>You won!<br>
      Number of tries: ${gameState.guesses}<br>
      <br>
      Entire hint:</p>
      <div class = "answer-bubbles final-hint">
        ${fullHint}
      </div>
      <div class = "answer-bubbles correct-answer">
        ${gameState.lyrics[gameState.finalIndex]}
      </div>
      <div class = "answer-bubbles final-hint">
        ${remainder}
      </div>
    `
    if (!savedState.WonLyricToday)
    {
      let LastDate = savedState.LastPlayedDateLyric;
      LastDate = new Date(LastDate);
      let today = new Date(TODAY);

      LastDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0)
      if ((today - LastDate)/(1000*60*60*24) > 1)
      {
        savedState.LyricStreak = 0;
      }
      savedState.LyricStreak++;
      savedState.LyricAttempts = gameState.guesses;
      savedState.LastPlayedDateLyric = new Date(TODAY).toISOString().split("T")[0];
      savedState.WonLyricToday = true;
      save();
    }
    finalResults();
  } 
  else 
  {
    gameState.guesses++;
    document.getElementById("result").innerHTML = `
      <div class = "answer-bubbles wrong-answer hoverable">
        ${userInput}
      </div>
    ` + document.getElementById("result").innerHTML;
    if (gameState.guesses === gameState.maxLyricGuesses)
    {
      gameState.answerRevealed = true;
      let fullHint =  gameState.lyrics.slice(gameState.finalIndex-35,gameState.finalIndex);
    fullHint = fullHint.join(" ");
    let remainder = gameState.lyrics.slice(finalIndex+1, Math.min(gameState.lyrics.length-1,gameState.finalIndex+20))
    remainder = remainder.join(" ");
    document.getElementById("final-result").style.setProperty("visibility","visible");
    document.getElementById("final-result").innerHTML += `
      <p>You won!<br>
      Number of tries: ${gameState.guesses}<br>
      <br>
      Entire hint:</p>
      <div class = "answer-bubbles final-hint">
        ${fullHint}
      </div>
      <div class = "answer-bubbles correct-answer">
        ${gameState.lyrics[gameState.finalIndex]}
      </div>
      <div class = "answer-bubbles final-hint">
        ${gameState.remainder}
      </div>
    `
    savedState.LyricAttempts = -1;
    savedState.LyricStreak = 0;
    savedState.WonLyricToday = true;
    save();
      finalResults();
    }
    gameState.currentIndexLyric--;
    
  document.getElementById("tries").innerHTML = `
    <p>Tries remaining: ${gameState.maxLyricGuesses - gameState.guesses}
  `;
    showLyricsLyric();
  }
}



function lyricBoxEnable ()
{
   
   let lyricInputBox = document.getElementById('guess-input-lyric');
   lyricInputBox.style.setProperty("border", "#000000");
   lyricInputBox.style.setProperty("border-style", "solid");
   lyricInputBox.style.setProperty("border-thickness", "0.15rem");
   let guessButton = document.getElementById('guess-lyric');
   let alrGuessed = document.getElementById('already-guessed-container');
   guessButton.style.setProperty("visibility", "visible");
   alrGuessed.style.setProperty("visibility", "hidden");
   alrGuessed.innerHTML = `
    <p>Already Guessed!</p>
   `
   buttonEnabled = true;
   
}

function lyricBoxDisable ()
{
   let lyricInputBox = document.getElementById('guess-input-lyric');
   lyricInputBox.style.setProperty("border", "#FF0000");
   lyricInputBox.style.setProperty("border-style", "solid");
   lyricInputBox.style.setProperty("border-thickness", "0.15rem");
   let guessButton = document.getElementById('guess-lyric');
   let alrGuessed = document.getElementById('already-guessed-container');
   guessButton.style.setProperty("visibility", "hidden");
   alrGuessed.style.setProperty("visibility", "visible");
   alrGuessed.innerHTML = `
    <p>Already Guessed!</p>
   `
   buttonEnabled = false;
   
}

function startAudioMode(songs) {
  const song = getRandomElement(songs, 50465);
  
  document.getElementById("input-field").innerHTML = `
    <input list = "song-names" class = "input-fields" id="guess-input-audio" placeholder="Type your guess!">
    <button id = "guess-audio" class = "guess-buttons" onclick="checkGuessAudio(document.getElementById('guess-input-audio').value)">Submit</button>
  `; 
  document.getElementById("mode-switch").innerHTML = 
  "<p></p>"
  document.getElementById("guess-input-audio").addEventListener("blur", function () {
  console.log('BLUR!')
  const input = this.value;
  const options = Array.from(document.querySelectorAll("#song-names option"))
                       .map(option => option.value);
  console.log(options);
  if (!options.includes(input)) {
    this.value = "";  // Clear the input if not valid
  }
});  
   document.getElementById('guess-input-audio').addEventListener("keydown", (event) => {
      if(event.key==="Enter")
      {
        checkGuessAudio(document.getElementById('guess-input-audio').value);
      }
  }); 
  gameState.song = song;
  gameState.lyrics = song.lyrics;
  gameState.url = song.url;
  
    showPlayer();
  let iframePlayer = document.getElementById('sc-widget');
  let widget = SC.Widget(iframePlayer);

  widget.bind(SC.Widget.Events.READY, function () {
  console.log("Widget is ready!");
  

  getWidgetDuration(widget).then(duration => {
    gameState.duration = duration;
    console.log('DURATION: ' + gameState.duration);
    gameState.startTimestamp = Math.floor(dailyRandom(12)*(gameState.duration-10000));
    gameState.endTimestamp = gameState.startTimestamp+500;
    console.log(gameState.startTimestamp);
    gameState.maxLines = song.lyrics.length;
    gameState.guesses = 0;
    gameState.maxSongGuesses = 20;
    gameState.maxLyricGuesses = 35;
    gameState.maxAudioGuesses = 20;
    gameState.finalIndex = Math.floor(dailyRandom(12)*(gameState.lyrics.length-gameState.maxSongGuesses));
    gameState.initialIndex = Math.floor(dailyRandom(12)*(gameState.lyrics.length-gameState.maxLyricGuesses));
    gameState.currentIndexLyric = gameState.finalIndex-1;
    gameState.currentIndexSong = gameState.initialIndex+1;
    gameState.answerRevealed = false;  
    showPlayButton();
    document.getElementById("tries").innerHTML = `
      <p>Tries remaining: ${gameState.maxSongGuesses - gameState.guesses}
    `;
  });
  savedState.AudioGuesses.forEach(
    (element) =>
    {
      checkGuessAudio(element, true);
    }
  )
});
}

function showPlayer ()
{
    document.getElementById("audio-container").removeAttribute('hidden');
    const audioContainer = document.getElementById("audio-container");
    audioContainer.innerHTML += `
      <img id = "cover" src = "Cover.png"></img>
      <iframe 
        id="sc-widget" 
        width="100%" 
        height="166" 
        scrolling="no" 
        frameborder="no" 
        allow="autoplay"
        style="display: none;" 
        src=${gameState.url}
      </iframe>
    `
}

function showPlayButton()
{
    const audioContainer = document.getElementById("audio-container");
    image = document.getElementById('cover');
    audioContainer.innerHTML += `
      <button id = "play-button" on-click>
        Play
      </button>
    `
    document.getElementById('play-button').addEventListener('click', () =>
    {
        play();

    });
}

function play ()
{
  console.log('playing');
  if (audioGuessed)
  {
     gameState.endTimestamp = gameState.startTimestamp + 10000; 
  }
  const iframeElement = document.getElementById('sc-widget');
  const widget = SC.Widget(iframeElement);
  widget.seekTo(gameState.startTimestamp)
  widget.play();
  // Clear any existing timer (if you want to allow multiple plays)
  if (window.autoPauseTimeout) clearTimeout(window.autoPauseTimeout);

  // Set a timer to pause after playDurationMs
  window.autoPauseTimeout = setTimeout(() => {
    widget.pause();
  }, gameState.endTimestamp-gameState.startTimestamp);
  console.log(gameState.duration);
}

function getWidgetDuration(widget) {
  return new Promise(resolve => {
    widget.getDuration(function(duration) {
      resolve(duration);
    });
  });
}

async function doSomethingWithDuration() {
  console.log("Duration in seconds:", Math.floor(duration / 1000));
}

function checkGuessAudio(userInput, auto = false) {
  
  savedState.LastInteractedDateAudio = new Date(TODAY).toISOString().split("T")[0];
  save();
  if (gameState.answerRevealed) return;
  if (userInput === '') return;
  document.getElementById("guess-input-audio").value = "";
  
  for (let i = 0; i<document.getElementById("song-names").children.length; i++)
  {
    if (document.getElementById("song-names").children[i].value === userInput)
    {
      document.getElementById("song-names").removeChild(document.getElementById("song-names").children[i]);
    }
  }

  if (!auto)
  { 
    savedState.AudioGuesses.push(userInput);

  }
  save();
  
  const guess = userInput.trim().toLowerCase();
  console.log(guess);
  const correct = gameState.song.title.trim().toLowerCase();

  if (guess === correct) 
  {
    audioGuessed = true;
    document.getElementById("result").innerHTML = `
      <div class = "answer-bubbles correct-answer hoverable">
        ${gameState.song.title}
      </div>
    ` + document.getElementById("result").innerHTML;
    gameState.answerRevealed = true;
    gameState.guesses++;
    gameState.endTimestamp = gameState.startTimestamp + 10000;
  document.getElementById("tries").innerHTML = `
    <p>Tries remaining: ${gameState.maxSongGuesses - gameState.guesses}
  `;
    document.getElementById("final-result").style.setProperty("visibility","visible");
    document.getElementById("final-result").innerHTML += `
      <p>You won!<br>
      Number of tries: ${gameState.guesses}<br>
      <br>
      <br>
      <div class = "answer-bubbles correct-answer">
        ${gameState.song.title}
      </div>
    `
    if (!savedState.WonAudioToday)
    {
      let LastDate = savedState.LastPlayedDateAudio;
      LastDate = new Date(LastDate);
      let today = new Date(TODAY);

      LastDate.setHours(0,0,0,0);
      today.setHours(0,0,0,0)
      if ((today - LastDate)/(1000*60*60*24) > 1)
      {
        savedState.AudioStreak = 0;
      }
      savedState.AudioStreak++;
      savedState.AudioAttempts = gameState.guesses;
      savedState.LastPlayedDateAudio = new Date(TODAY).toISOString().split("T")[0];
      savedState.WonAudioToday = true;
      save();
    }
    finalResults();
  } 
  else 
  {
    gameState.guesses++;
    gameState.endTimestamp+=500;
    document.getElementById("result").innerHTML = `
      <div class = "answer-bubbles wrong-answer hoverable">
        ${userInput}
      </div>
    ` + document.getElementById("result").innerHTML;
    if (gameState.guesses === gameState.maxSongGuesses)
    {
      gameState.answerRevealed = true;
      document.getElementById("final-result").style.setProperty("visibility","visible");
    document.getElementById("final-result").innerHTML += `
      <p>You lost<br>
      Number of tries: ${gameState.guesses}<br>
      <br>
      <br>
      <div class = "answer-bubbles correct-answer">
        ${gameState.song.title}
      </div>
    `
    savedState.AudioAttempts = -1;
    savedState.AudioStreak = 0;
    savedState.WonAudioToday = true;
    save();
      finalResults();
    }
    
  document.getElementById("tries").innerHTML = `
    <p>Tries remaining: ${gameState.maxSongGuesses - gameState.guesses}
  `;
  }
}

document.getElementById("songMode").onclick = async () => {
  const songs = await fetchSongs();
  startSongMode(songs);
};

document.getElementById("lyricMode").onclick = async () => {
  const songs = await fetchSongs();
  startLyricMode(songs);
};

document.getElementById("audioMode").onclick = async () => {
  const songs = await fetchSongs();
  startAudioMode(songs);
};

function hashStringFNV1a(str) {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = (hash * 0x01000193) >>> 0; // FNV prime and >>> 0 to keep unsigned
  }
  return hash;
}

function dailyRandom(seed = 0) {
  const today = TODAY || new Date().toISOString().split("T")[0];
  const combined = today + seed;
  const hash = hashStringFNV1a(combined);
  return hash / 4294967295;
}

function finalResults ()
{
    finalRes = document.getElementById('final-final-result');
    finalRes.style.setProperty("visibility","visible");
    finalRes.innerHTML += `
      <p>Results for Day #${(initialDate - new Date().setHours(0,0,0,0))/(-86400000) + 1}<br>
      </p>
    `
    if (savedState.WonSongToday)
    {
        finalRes.innerHTML += `Song: ` + (savedState.SongAttempts == -1 ? `lost :(` : `Won in ${savedState.SongAttempts}` + (savedState.SongAttempts == 1 ? ` try ` : ` tries `) + `(Streak: ${savedState.SongStreak})`) + `<br>`
    }
    if (savedState.WonLyricToday)
    {
        finalRes.innerHTML += `Lyric: ` + (savedState.LyricAttempts == -1 ? `lost :(` : `Won in ${savedState.LyricAttempts}` + (savedState.LyricAttempts == 1 ? ` try ` : ` tries `) + `(Streak: ${savedState.LyricStreak})`)+ `<br>`
    }
    if (savedState.WonAudioToday)
    {
        finalRes.innerHTML += `Audio: ` + (savedState.AudioAttempts == -1 ? `lost :(` : `Won in ${savedState.AudioAttempts}` + (savedState.AudioAttempts == 1 ? ` try ` : ` tries `) + `(Streak: ${savedState.AudioStreak})`)+ `<br>`
    }
}
