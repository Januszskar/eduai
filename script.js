// ============ Shared interactive behaviours ============

// Flip cards
document.querySelectorAll('.flip-card').forEach(card=>{
  card.addEventListener('click', ()=> card.classList.toggle('flipped'));
  card.setAttribute('tabindex','0');
  card.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault(); card.classList.toggle('flipped');} });
});

// Tabs
document.querySelectorAll('.tabs').forEach(tabset=>{
  const btns = tabset.querySelectorAll('.tab-btn');
  const panels = tabset.querySelectorAll('.tab-panel');
  btns.forEach((btn,i)=>{
    btn.addEventListener('click', ()=>{
      btns.forEach(b=>b.classList.remove('active'));
      panels.forEach(p=>p.classList.remove('active'));
      btn.classList.add('active');
      panels[i].classList.add('active');
    });
  });
});

// Role map nodes
document.querySelectorAll('.role-node').forEach(node=>{
  node.addEventListener('click', ()=> node.classList.toggle('open'));
});

// Tier rows (module 3 signature diagram)
document.querySelectorAll('.tier-row').forEach(row=>{
  row.addEventListener('click', ()=>{
    const wasActive = row.classList.contains('active');
    document.querySelectorAll('.tier-row').forEach(r=>r.classList.remove('active'));
    if(!wasActive) row.classList.add('active');
  });
});

// Checklist progress bars
document.querySelectorAll('.checklist').forEach(list=>{
  const boxes = list.querySelectorAll('input[type=checkbox]');
  const wrap = list.parentElement.querySelector('.progress-wrap');
  if(!wrap) return;
  const fill = wrap.querySelector('.progress-fill');
  const label = wrap.querySelector('.progress-label');
  function update(){
    const done = [...boxes].filter(b=>b.checked).length;
    const pct = boxes.length ? Math.round(done/boxes.length*100) : 0;
    fill.style.width = pct+'%';
    label.textContent = done+' of '+boxes.length+' considered ('+pct+'%)';
  }
  boxes.forEach(b=>b.addEventListener('change', update));
  update();
});

// Sort quiz (drag chips into OK / NOT ALLOWED bins)
document.querySelectorAll('.sort-wrap').forEach(wrap=>{
  const chips = wrap.querySelectorAll('.sort-chip');
  const bins = wrap.querySelectorAll('.sort-bin');
  const feedback = wrap.querySelector('.sort-feedback');
  let placed = 0, correct = 0;

  chips.forEach(chip=>{
    chip.draggable = true;
    chip.addEventListener('dragstart', e=>{
      e.dataTransfer.setData('text/plain', chip.dataset.id);
    });
    // click-to-place fallback for touch/mobile
    chip.addEventListener('click', ()=>{
      const answer = chip.dataset.answer;
      const targetBin = wrap.querySelector('.sort-bin.'+answer);
      placeChip(chip, targetBin);
    });
  });

  bins.forEach(bin=>{
    bin.addEventListener('dragover', e=> e.preventDefault());
    bin.addEventListener('drop', e=>{
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const chip = wrap.querySelector('[data-id="'+id+'"]');
      if(chip) placeChip(chip, bin);
    });
  });

  function placeChip(chip, bin){
    if(chip.dataset.placed) return;
    chip.dataset.placed = '1';
    bin.appendChild(chip);
    chip.style.cursor='default';
    placed++;
    const isCorrect = bin.classList.contains(chip.dataset.answer);
    chip.style.borderColor = isCorrect ? 'var(--sage)' : 'var(--maroon)';
    chip.style.background = isCorrect ? 'var(--sage-soft)' : '#F3DCDF';
    if(isCorrect) correct++;
    if(feedback && placed === chips.length){
      feedback.textContent = correct+' of '+chips.length+' placed correctly. Reload to try again.';
    }
  }
});

// Simple reveal-on-scroll for cards
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){ e.target.style.opacity=1; e.target.style.transform='translateY(0)'; }
  });
},{threshold:0.1});
document.querySelectorAll('.card, .role-node, .mod-card').forEach(el=>{
  el.style.opacity=0; el.style.transform='translateY(10px)';
  el.style.transition='opacity .5s ease, transform .5s ease';
  io.observe(el);
});
