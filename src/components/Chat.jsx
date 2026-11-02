import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { useLS, uid, fmtTime } from '../utils/localStorage';

// contacts: [{ email, name, sub }]
export default function Chat({ me, contacts }) {
  const [messages, setMessages] = useLS('messages');
  const [active, setActive] = useState(contacts[0]?.email || null);
  const [text, setText] = useState('');
  const end = useRef(null);

  const thread = messages
    .filter((m) => (m.from === me.email && m.to === active) || (m.to === me.email && m.from === active))
    .sort((a, b) => new Date(a.time) - new Date(b.time));

  useEffect(() => { end.current?.scrollIntoView({ block: 'end' }); }, [thread.length, active]);

  const send = (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    setMessages([...messages, { id: uid(), from: me.email, fromName: me.name, to: active, text: text.trim(), time: new Date().toISOString() }]);
    setText('');
  };
  const last = (email) => {
    const t = messages.filter((m) => (m.from === me.email && m.to === email) || (m.to === me.email && m.from === email));
    return t.length ? t[t.length - 1].text : 'No messages yet';
  };

  if (!contacts.length)
    return (
      <div className="empty"><MessageSquare size={40} /><h3>No conversations yet</h3>
        <p>Messages will appear here once a tenant is assigned to one of your properties.</p></div>
    );

  const current = contacts.find((c) => c.email === active);
  return (
    <div className="chat">
      <div className={`chat-list ${active ? 'hide-mobile' : ''}`}>
        <h4>Conversations</h4>
        {contacts.map((c) => (
          <button key={c.email} className={c.email === active ? 'on' : ''} onClick={() => setActive(c.email)}>
            <span className="avatar">{c.name.charAt(0)}</span>
            <span className="c-text"><strong>{c.name}</strong><small>{last(c.email)}</small></span>
          </button>
        ))}
      </div>
      <div className={`chat-pane ${!active ? "hide-mobile" : ""}`}>
        <div className="chat-head">
          <button className="back-btn" onClick={() => setActive(null)}>‹ Back</button>
          <span className="avatar">{current?.name.charAt(0)}</span>
          <div><strong>{current?.name}</strong><small>{current?.sub}</small></div>
        </div>
        <div className="chat-body">
          {thread.length === 0 && <p className="muted center">Say hello 👋 – start the conversation below.</p>}
          {thread.map((m) => (
            <div key={m.id} className={`bubble ${m.from === me.email ? 'me' : 'them'}`}>
              <span className="b-name">{m.fromName}</span>
              <p>{m.text}</p>
              <small>{fmtTime(m.time)}</small>
            </div>
          ))}
          <div ref={end} />
        </div>
        <form className="chat-input" onSubmit={send}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message…" />
          <button className="btn btn-primary" disabled={!text.trim()}><Send size={16} /> Send</button>
        </form>
      </div>
    </div>
  );
}
