// script.js - playful, harmless trolling behaviors
// Keep the three files in same folder. This file requires no external libs.

(() => {
  // DOM refs
  const mysteryBtn = document.getElementById('mysteryBtn');
  const reverseBtn = document.getElementById('reverseBtn');
  const toaster = document.getElementById('toaster');
  const typingArea = document.getElementById('typingArea');
  const prankLinks = document.querySelectorAll('.prank-link');
  const confettiCanvas = document.getElementById('confettiCanvas');

  // small util
  const say = (text, timeout = 2500) => {
    toaster.textContent = text;
    setTimeout(()=> { if (toaster.textContent === text) toaster.textContent = ''; }, timeout);
  };

  // 1) "Surprise" button - shows fake loading + confetti + silly reveal
  mysteryBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    mysteryBtn.disabled = true;
    mysteryBtn.textContent = 'Preparing surprise...';
    say('Loading totally normal surprise...');
    await sleep(900);
    // fake progress
    for (let i=0;i<=100;i+=20){
      mysteryBtn.textContent = `Loading… ${i}%`;
      await sleep(220);
    }
    // Boom: confetti + reveal
    mysteryBtn.textContent = 'Surprise!';
    startConfetti();
    say('🎉 Surprise! You just triggered harmless confetti. Relax, it stops soon.');
    setTimeout(stopConfetti, 4500);
    setTimeout(()=>{ mysteryBtn.textContent = 'Click me for a surprise'; mysteryBtn.disabled = false; }, 2000);
  });

  // 2) Reverse button — mild "glitch" reversal effect (flips colors & mirror text) then reveals "just kidding"
  reverseBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (document.body.classList.contains('reversed')) {
      say("Already reversed. Chill.");
      return;
    }
    say('System corruption detected... (just kidding)');
    document.body.classList.add('reversing');
    // apply CSS transform & invert
    document.documentElement.style.transition = 'filter .6s, transform .6s';
    document.documentElement.style.filter = 'invert(1) hue-rotate(180deg)';
    document.documentElement.style.transform = 'scaleX(-1)';
    // add reversed marker
    setTimeout(() => {
      document.body.classList.remove('reversing');
      document.body.classList.add('reversed');
      // after short while revert back with a message
      setTimeout(() => {
        document.documentElement.style.transform = '';
        document.documentElement.style.filter = '';
        document.body.classList.remove('reversed');
        say("Phew — everything's normal again. You fell for it 😉");
      }, 3500);
    }, 800);
  });

  // 3) Fake links show playful modal-like message in typing area
  prankLinks.forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      typeOut(typingArea, "No Diabito, roll back to kitchen instead!", 20);
    });
  });

  // 4) Gentle typing trick in header: show a "typing" status
  let phrases = [
    "Everything is definitely normal.",
    "No pranks here.",
    "Absolutely not a trap.",
    "Surely you can trust this site.",
    "Why are you still reading?",
    "Just kidding, have fun!",
    "Enjoy your stay!",
    "Hope you're having a great day!"
    ];
  let idx = 0;
  setInterval(()=> {
    typeOut(typingArea, phrases[idx], 18);
    idx = (idx + 1) % phrases.length;
  }, 5000);

  // tiny helpers
  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  // typeOut: progressive typing effect
  let typerLock = false;
  async function typeOut(el, text, speed=30){
    if (typerLock) return;
    typerLock = true;
    el.textContent = '';
    for (let i=0;i<text.length;i++){
      el.textContent += text[i];
      await sleep(speed + Math.random()*20);
    }
    await sleep(1200);
    // fade out politely
    el.textContent = '';
    typerLock = false;
  }

  // -------------------
  // Confetti: lightweight particle effect (canvas)
  // -------------------
  let confettiCtx, confettiTime;
  function startConfetti(){
    if (!confettiCanvas) return;
    confettiCanvas.width = innerWidth;
    confettiCanvas.height = innerHeight;
    confettiCtx = confettiCanvas.getContext('2d');
    const pieces = [];
    const colors = ['#7DD3FC','#FDBA74','#FCA5A5','#C7F9CC','#FFF59D'];
    for (let i=0;i<120;i++){
      pieces.push({
        x: Math.random()*confettiCanvas.width,
        y: Math.random()*-confettiCanvas.height,
        r: 6+(Math.random()*8),
        d: Math.random()*0.08 + 0.02,
        tilt: Math.random()*10,
        color: colors[Math.floor(Math.random()*colors.length)]
      });
    }
    let t0 = performance.now();
    function render(now){
      confettiTime = requestAnimationFrame(render);
      const dt = now - t0; t0 = now;
      confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
      pieces.forEach(p => {
        p.y += 0.6 + p.d*6;
        p.x += Math.sin(now/600 + p.d*10) * 1.2;
        p.tilt += 0.02;
        confettiCtx.save();
        confettiCtx.translate(p.x, p.y);
        confettiCtx.rotate(p.tilt);
        confettiCtx.fillStyle = p.color;
        confettiCtx.fillRect(-p.r/2, -p.r/2, p.r, p.r*0.6);
        confettiCtx.restore();
        if (p.y > confettiCanvas.height + 20){
          p.y = -10 - Math.random()*confettiCanvas.height;
          p.x = Math.random()*confettiCanvas.width;
        }
      });
    }
    render(performance.now());
  }
  function stopConfetti(){
    if (confettiTime) cancelAnimationFrame(confettiTime);
    if (confettiCtx) confettiCtx.clearRect(0,0,confettiCanvas.width, confettiCanvas.height);
  }

  // small keyboard fun: pressing "t" triggers a tiny prank
  window.addEventListener('keydown', (ev) => {
    if (ev.key.toLowerCase() === 't') {
      say("You pressed 't' — nice talent. Try 'r' for reverse!");
    } else if (ev.key.toLowerCase() === 'r') {
      // mimic clicking reverse
      reverseBtn.click();
    }
  });

  // accessibility: announce page loaded
  window.addEventListener('load', ()=> say('Page loaded. Everything very normal.'));

})();
