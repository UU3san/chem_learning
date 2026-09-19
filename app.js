const tabs = [...document.querySelectorAll('.tab')];
const pages = [...document.querySelectorAll('.page')];
let speakOn = false;

function showPage(id){
  pages.forEach(p=>p.classList.toggle('active',p.id===id));
  tabs.forEach(t=>t.classList.toggle('active',t.dataset.target===id));
  window.scrollTo({top:0,behavior:'smooth'});
}
tabs.forEach(t=>t.addEventListener('click',()=>showPage(t.dataset.target)));

const speakBtn = document.getElementById('speakToggle');
speakBtn.addEventListener('click',()=>{
  speakOn=!speakOn;
  speakBtn.setAttribute('aria-pressed', String(speakOn));
  speakBtn.textContent = speakOn ? '🔊 読み上げ ON' : '🔇 読み上げ OFF';
  if(!speakOn) speechSynthesis.cancel();
});
function speak(text){
  if(!speakOn || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang='ja-JP'; u.rate=.95;
  speechSynthesis.speak(u);
}

function setRunning(selector,on=true){
  const el=document.querySelector(selector);
  if(el) el.classList.toggle('running',on);
}
document.querySelectorAll('.action').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const a=btn.dataset.action;
    if(a==='ionize'){
      const atom=document.getElementById('zincAtom');
      const wrap=document.getElementById('zincIonWrap');
      const btn=document.getElementById('ionizeBtn');
      if(btn.disabled) return;
      btn.disabled=true;
      atom.classList.remove('ionizing');
      wrap.classList.add('hidden');

      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        atom.classList.add('ionizing');
        setTimeout(()=>{
          atom.classList.add('hidden');
          wrap.classList.remove('hidden');
        },650);
      }));

      speak('亜鉛原子が電子を2個失うと、亜鉛イオンになります。右にある電子2個は、亜鉛が放出した電子です。');

      setTimeout(()=>{
        wrap.classList.add('hidden');
        atom.classList.remove('hidden','ionizing');
        btn.disabled=false;
      },4200);
    }
    if(a==='run-volta'){
      setRunning('#volta .battery-card',true);
      speak('まず、硫酸は水中で電離して水素イオンと硫酸イオンになります。亜鉛が電子を出し、電子は導線を通って銅へ進みます。水素イオンは電子を受け取り、いったん水素原子になり、2個が結びついて水素分子H2として気体になります。');
    }
    if(a==='reset-volta'){ setRunning('#volta .battery-card',false); speechSynthesis.cancel(); }
    if(a==='run-daniell'){
      setRunning('#daniell .battery-card',true);
      speak('ダニエル電池では、硫酸亜鉛水溶液と硫酸銅水溶液がそれぞれイオンに分かれています。亜鉛が電子を出し、電子は銅へ移動します。銅イオンが電子を受け取って銅原子になり銅板に付着するので、水溶液中の銅イオンが減り、青色が少しずつ薄くなります。');
    }
    if(a==='reset-daniell'){ setRunning('#daniell .battery-card',false); speechSynthesis.cancel(); }
  });
});

// Quiz
const baseQuestions = [
  {
    q:'ボルタ電池とダニエル電池で、電子はどちらからどちらへ流れますか？',
    choices:['銅 → 亜鉛','亜鉛 → 銅','水溶液 → 亜鉛','銅 → 水溶液'],
    a:1,
    why:'亜鉛が電子を出し、その電子が導線を通って銅へ流れます。'
  },
  {
    q:'亜鉛が電子を2個出す反応として正しいものは？',
    choices:['Zn²⁺ → Zn + 2e⁻','Zn → Zn²⁺ + 2e⁻','Zn + 2e⁻ → Zn²⁺','Zn → Cu²⁺ + 2e⁻'],
    a:1,
    why:'亜鉛原子 Zn は電子を2個失い、Zn²⁺ になります。'
  },
  {
    q:'ボルタ電池の銅板付近で発生する気体は？',
    choices:['酸素','二酸化炭素','水素','窒素'],
    a:2,
    why:'H⁺ が電子を受け取り、2H⁺ + 2e⁻ → H₂ の反応で水素が発生します。'
  },
  {
    q:'ダニエル電池の銅板側で電子を受け取る粒子は？',
    choices:['Zn²⁺','H⁺','Cu²⁺','SO₄²⁻'],
    a:2,
    why:'ダニエル電池では Cu²⁺ が電子を受け取り、Cu になります。'
  },
  {
    q:'ダニエル電池がボルタ電池より安定して電流を流しやすい理由として適切なのは？',
    choices:['亜鉛を使わないから','銅板に水素がたまりにくいから','電子が水溶液の中を流れるから','銅が電子を出すから'],
    a:1,
    why:'ボルタ電池のように銅板に水素がたまりにくいため、電流が弱くなりにくいからです。'
  }
];
let queue=[], current=0, score=0, wrong=[];
const qText=document.getElementById('questionText'), choicesEl=document.getElementById('choices');
const feedback=document.getElementById('feedback'), nextBtn=document.getElementById('nextBtn');
const progress=document.getElementById('quizProgress'), scoreEl=document.getElementById('quizScore');
const finish=document.getElementById('quizFinish'), quizArea=document.getElementById('quizArea'), result=document.getElementById('resultText'), retryInfo=document.getElementById('retryInfo');

function startQuiz(){
  queue=baseQuestions.map((x,i)=>({...x,origin:i}));
  current=0; score=0; wrong=[];
  finish.classList.add('hidden'); quizArea.classList.remove('hidden');
  renderQuestion();
}
function renderQuestion(){
  const item=queue[current];
  progress.textContent=`${current+1} / ${queue.length}`;
  scoreEl.textContent=`正解 ${score}`;
  qText.textContent=item.q; choicesEl.innerHTML=''; feedback.textContent=''; feedback.className='feedback';
  nextBtn.classList.add('hidden');
  item.choices.forEach((c,i)=>{
    const b=document.createElement('button'); b.className='choice'; b.textContent=`${String.fromCharCode(65+i)}. ${c}`;
    b.addEventListener('click',()=>answer(i,b));
    choicesEl.appendChild(b);
  });
}
function answer(i,btn){
  [...choicesEl.children].forEach(x=>x.disabled=true);
  const item=queue[current], ok=i===item.a;
  [...choicesEl.children][item.a].classList.add('correct');
  if(!ok){btn.classList.add('wrong'); if(!wrong.includes(item.origin)) wrong.push(item.origin);}
  else score++;
  feedback.className='feedback '+(ok?'good':'bad');
  feedback.textContent=(ok?'正解！ ':'ちがいます。 ')+item.why;
  speak(feedback.textContent);
  nextBtn.classList.remove('hidden');
}
nextBtn.addEventListener('click',()=>{
  current++;
  if(current<queue.length) renderQuestion();
  else finishQuiz();
});
function finishQuiz(){
  quizArea.classList.add('hidden'); finish.classList.remove('hidden');
  result.textContent=`${queue.length}問中 ${score}問 正解でした。`;
  if(wrong.length){
    retryInfo.innerHTML=`<p><strong>まちがえた問題：${wrong.length}問</strong></p><button id="retryWrong" class="primary">まちがえた問題だけ再テスト</button>`;
    document.getElementById('retryWrong').addEventListener('click',()=>{
      queue=wrong.map(i=>({...baseQuestions[i],origin:i}));
      current=0; score=0; wrong=[];
      finish.classList.add('hidden'); quizArea.classList.remove('hidden'); renderQuestion();
    });
  } else retryInfo.innerHTML='<p class="tip">全問正解です。ボルタ電池とダニエル電池の違いまで整理できています。</p>';
}
document.getElementById('restartBtn').addEventListener('click',startQuiz);
startQuiz();

// default is OFF despite initial button copy
speakOn=false;
speakBtn.textContent='🔇 読み上げ OFF';
