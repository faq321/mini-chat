document.addEventListener('DOMContentLoaded', () => {
  const peers = [
    'https://gun-manhattan.herokuapp.com/gun',
    'https://gun-eu.herokuapp.com/gun',
    'https://gun-us.herokuapp.com/gun'
  ];

  const gun = Gun({ peers });
  const chat = gun.get('chat-ultimate-v1');
  const chatBox = document.getElementById('chat-box');
  let user = localStorage.getItem('chat_user') || '';
  const processedIds = new Set();

  function renderMessage(msg) {
    if(!msg || !msg.text || processedIds.has(msg.id)) return;
    processedIds.add(msg.id);

    const div = document.createElement('div');
    div.className = `msg ${msg.user===user?'msg-my':'msg-other'}`;
    div.innerHTML = `<b>${msg.user}:</b> ${msg.text}`;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function setupListeners() {
    chat.map().on(msg => renderMessage(msg));
  }

  function login(name) {
    user = name;
    localStorage.setItem('chat_user', user);
    document.getElementById('login-screen').style.display='none';
    document.getElementById('chat-ui').style.display='block';
    setupListeners();
  }

  document.getElementById('login-btn').addEventListener('click', ()=>{
    const val = document.getElementById('username').value.trim();
    if(val) login(val);
  });

  if(user) login(user);

  document.getElementById('send-btn').addEventListener('click', ()=>{
    const input = document.getElementById('msg-input');
    const text = input.value.trim();
    if(!text) return;
    const msg = { id: Date.now()+'_'+Math.random().toString(36).slice(2,5), text, user };
    chat.set(msg);
    input.value = '';
  });

  document.getElementById('msg-input').addEventListener('keydown', e=>{
    if(e.key==='Enter' && !e.shiftKey) {
      e.preventDefault();
      document.getElementById('send-btn').click();
    }
  });
});
