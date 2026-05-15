import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { PaperAirplaneIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const currentUser = JSON.parse(localStorage.getItem('current_user') || '{}');
const ROLE_LABELS = { doctor: 'Médecin', secretary: 'Secrétaire', assistant: 'Assistante' };

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const chatEnd = useRef(null);

  useEffect(() => {
    api.getMessages().then(setMessages).catch(() => {});
    api.getContacts().then(setContacts).catch(() => {});
    const interval = setInterval(() => {
      api.getMessages().then(setMessages).catch(() => {});
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedContact]);

  const conversations = contacts.map(contact => {
    const withContact = messages.filter(m =>
      (m.sender_id === contact.id && m.receiver_id === currentUser.id) ||
      (m.sender_id === currentUser.id && m.receiver_id === contact.id)
    );
    const last = withContact[0];
    const unread = messages.filter(m => m.sender_id === contact.id && m.receiver_id === currentUser.id && !m.read).length;
    return { contact, messages: withContact, last, unread };
  }).filter(c => c.contact.nom.toLowerCase().includes(search.toLowerCase()) || c.contact.prenom.toLowerCase().includes(search.toLowerCase()));

  const activeConv = conversations.find(c => c.contact.id === selectedContact?.id);

  const handleSend = async () => {
    if (!input.trim() || !selectedContact) return;
    setError('');
    try {
      const msg = await api.sendMessage({ receiver_id: selectedContact.id, subject: '.', content: input.trim() });
      setMessages(prev => [msg, ...prev]);
      setInput('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const openConversation = async (contact) => {
    setSelectedContact(contact);
    await api.markAllMessagesRead(contact.id).catch(() => {});
    setMessages(prev => prev.map(m => m.sender_id === contact.id && m.receiver_id === currentUser.id ? { ...m, read: 1 } : m));
  };

  if (!selectedContact) {
    return (
      <div className="h-screen bg-gray-50 flex">
        <div className="w-full lg:w-96 border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <h1 className="text-2xl font-bold text-primary">Messages</h1>
            <div className="relative mt-3">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="Rechercher..." />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 && (
              <p className="text-center text-gray-400 mt-8 text-sm">Aucune conversation</p>
            )}
            {conversations.map(({ contact, last, unread }) => (
              <button key={contact.id} onClick={() => openConversation(contact)}
                className="w-full flex items-center gap-3 p-4 hover:bg-gray-50 border-b transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-semibold flex-shrink-0">
                  {contact.prenom?.charAt(0)}{contact.nom?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <p className="font-medium text-gray-900 truncate">{contact.prenom} {contact.nom}</p>
                    {last && <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{new Date(last.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}</span>}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{ROLE_LABELS[contact.role] || contact.role}</p>
                  {last && <p className="text-sm text-gray-400 truncate mt-0.5">{last.sender_id === currentUser.id ? 'Vous: ' : ''}{last.content}</p>}
                </div>
                {unread > 0 && (
                  <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{unread}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="hidden lg:flex flex-1 items-center justify-center text-gray-400">
          <div className="text-center">
            <PaperAirplaneIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p>Sélectionnez une conversation</p>
          </div>
        </div>
      </div>
    );
  }

  const chatMessages = (activeConv?.messages || []).slice().reverse();

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="hidden lg:flex w-96 border-r bg-white flex-col">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-primary">Messages</h1>
          <div className="relative mt-3">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              placeholder="Rechercher..." />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(({ contact, last, unread }) => (
            <button key={contact.id} onClick={() => openConversation(contact)}
              className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 border-b transition-colors text-left ${selectedContact?.id === contact.id ? 'bg-accent/5' : ''}`}>
              <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-semibold flex-shrink-0">
                {contact.prenom?.charAt(0)}{contact.nom?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{contact.prenom} {contact.nom}</p>
                <p className="text-sm text-gray-500 truncate">{ROLE_LABELS[contact.role] || contact.role}</p>
              </div>
              {unread > 0 && (
                <span className="bg-accent text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">{unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedContact(null)} className="lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <div className="w-9 h-9 rounded-full bg-accent/10 text-accent flex items-center justify-center font-semibold flex-shrink-0">
            {selectedContact.prenom?.charAt(0)}{selectedContact.nom?.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{selectedContact.prenom} {selectedContact.nom}</p>
            <p className="text-xs text-gray-500">{ROLE_LABELS[selectedContact.role] || selectedContact.role}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {chatMessages.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Aucun message. Envoyez votre premier message !
            </div>
          )}
          {chatMessages.map(msg => {
            const isMine = msg.sender_id === currentUser.id;
            return (
              <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${isMine ? 'bg-accent text-white rounded-br-sm' : 'bg-white text-gray-900 rounded-bl-sm shadow-sm'}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMine ? 'text-white/70' : 'text-gray-400'} text-right`}>
                    {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={chatEnd} />
        </div>

        {error && <div className="bg-red-50 border-t border-red-200 text-red-800 px-4 py-2 text-sm">{error}</div>}

        <div className="bg-white border-t p-3">
          <div className="flex gap-2 items-end">
            <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              placeholder="Écrivez votre message..." rows={1} />
            <button onClick={handleSend} disabled={!input.trim()}
              className="bg-accent hover:bg-accent-hover disabled:opacity-40 text-white p-3 rounded-xl transition-colors">
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
