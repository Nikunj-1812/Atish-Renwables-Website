import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';

const PHONE_NUMBER = '+916359260330';
const WA_BASE = 'https://wa.me/916359260330';

const initialBotMessage = `Hi! I'm Atish Solar Assistant — I can help with solar estimates and a free consultation. May I know your name?`;

function WhatsAppIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path d="M12 2.25C6.615 2.25 2.25 6.615 2.25 12c0 1.99.522 3.847 1.432 5.48L2.25 21.75l4.532-1.396A9.718 9.718 0 0 0 12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Z" fill="#25D366" />
      <path d="M17.1 14.35c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.48-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2 0-.37-.02-.52-.02-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.66-.51-.17-.01-.37-.01-.57-.01s-.52.07-.79.37c-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.06 2.86 1.21 3.06.15.2 2.08 3.35 5.04 4.7 2.96 1.36 2.96.91 3.49.85.53-.06 1.72-.7 1.97-1.38.25-.68.25-1.26.175-1.38-.08-.12-.28-.2-.58-.35Z" fill="#fff" />
    </svg>
  );
}

// Quick-action buttons shown after askRoof step
function QuickActions({ onWhatsApp, onCall }) {
  return (
    <div className="chatbot-quick-actions">
      <button className="chatbot-qa-btn chatbot-qa-btn--wa" onClick={onWhatsApp} aria-label="Continue on WhatsApp">
        <WhatsAppIcon size={16} />
        WhatsApp
      </button>
      <button className="chatbot-qa-btn chatbot-qa-btn--call" onClick={onCall} aria-label="Call now">
        <Phone size={15} />
        Call Now
      </button>
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: 'bot', text: initialBotMessage }]);
  const [input, setInput] = useState('');
  const [step, setStep] = useState('askName');
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [lead, setLead] = useState({ name: '', city: '', bill: '', property: '', roof: '', phone: '' });
  const scrollRef = useRef(null);

  useEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const pushBot = (text, delay = 350) => {
    setTimeout(() => setMessages((m) => [...m, { from: 'bot', text }]), delay);
  };

  const handleWhatsApp = (customLead) => {
    const l = customLead || lead;
    const msg = l.name
      ? `Hi Atish Renewables 🌞, I'm ${l.name} from ${l.city || '[City]'}. My monthly bill is ₹${l.bill || '[amount]'}. Property: ${l.property || ''}, Roof: ${l.roof || ''}. I'd like a free consultation.`
      : `Hi Atish Renewables 🌞, I'm interested in your solar solutions.`;
    window.open(WA_BASE + '?text=' + encodeURIComponent(msg), '_blank');
  };

  const handleCall = () => {
    window.open('tel:' + PHONE_NUMBER, '_self');
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Global keyword shortcuts
    if (/\bwhatsapp\b/i.test(trimmed)) {
      setMessages((m) => [...m, { from: 'user', text: trimmed }]);
      pushBot('Opening WhatsApp chat for you...');
      setTimeout(() => handleWhatsApp(), 600);
      setInput('');
      return;
    }
    if (/\bcall\b/i.test(trimmed)) {
      setMessages((m) => [...m, { from: 'user', text: trimmed }]);
      pushBot('Opening phone dialer with ' + PHONE_NUMBER + '...');
      setTimeout(() => handleCall(), 600);
      setInput('');
      return;
    }

    setMessages((m) => [...m, { from: 'user', text: trimmed }]);

    if (step === 'askName') {
      setLead((l) => ({ ...l, name: trimmed }));
      pushBot('Nice to meet you, ' + trimmed + '! Which city are you in?');
      setStep('askCity');
    } else if (step === 'askCity') {
      setLead((l) => ({ ...l, city: trimmed }));
      pushBot('Thanks — what is your approximate monthly electricity bill in ₹?');
      setStep('askBill');
    } else if (step === 'askBill') {
      setLead((l) => ({ ...l, bill: trimmed }));
      pushBot('Is this for a Residential or Commercial property?');
      setStep('askProperty');
    } else if (step === 'askProperty') {
      setLead((l) => ({ ...l, property: trimmed }));
      pushBot('What is your roof type? (RCC roof / Tin roof / Open land)');
      setStep('askRoof');
    } else if (step === 'askRoof') {
      const updatedLead = { ...lead, roof: trimmed };
      setLead(updatedLead);
      pushBot('Great. Please share your contact number, or use the quick options below to connect instantly.');
      setShowQuickActions(true);
      setStep('askPhone');
    } else if (step === 'askPhone') {
      setLead((l) => ({ ...l, phone: trimmed }));
      setShowQuickActions(false);
      pushBot('Thanks! Would you like a free consultation on WhatsApp or should our expert call you?');
      setStep('done');
    } else if (step === 'done') {
      if (/whatsapp/i.test(trimmed)) {
        pushBot('Opening WhatsApp for a quick consultation — please continue there.');
        setTimeout(() => handleWhatsApp(), 400);
      } else if (/call/i.test(trimmed)) {
        pushBot('Opening phone dialer now...');
        setTimeout(() => handleCall(), 400);
      } else {
        pushBot('Thanks — our team will contact you shortly.');
      }
    }

    setInput('');
  };

  const toggleChat = () => setOpen((v) => !v);

  return (
    <div className={`chatbot-root ${open ? 'chatbot-open' : ''}`}>
      {!open && (
        <button aria-label="Open chat" className="chatbot-button" onClick={toggleChat}>
          <MessageCircle size={20} />
        </button>
      )}

      <div className="chatbot-window" role="dialog" aria-hidden={!open}>
        <div className="chatbot-header">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="chatbot-title">Atish Solar Assistant</div>
            <div className="chatbot-sub">Free consultation • Quick lead capture</div>
          </div>
          {open && (
            <button className="chatbot-close" onClick={toggleChat} aria-label="Close chat">
              <X size={16} />
            </button>
          )}
        </div>

        <div className="chatbot-body" ref={scrollRef}>
          <div className="chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chatbot-msg ${m.from === 'bot' ? 'bot' : 'user'}`}>
                <div className="chatbot-bubble">{m.text}</div>
              </div>
            ))}
            {showQuickActions && (
              <QuickActions
                onWhatsApp={() => {
                  setMessages((m) => [...m, { from: 'user', text: 'WhatsApp' }]);
                  setShowQuickActions(false);
                  pushBot('Opening WhatsApp for a quick consultation — please continue there.');
                  setTimeout(() => handleWhatsApp(), 400);
                }}
                onCall={() => {
                  setMessages((m) => [...m, { from: 'user', text: 'Call Now' }]);
                  setShowQuickActions(false);
                  pushBot('Opening phone dialer now...');
                  setTimeout(() => handleCall(), 400);
                }}
              />
            )}
          </div>
        </div>

        <div className="chatbot-input">
          <input
            aria-label="Type your message"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
          />
          <button className="chatbot-send" onClick={handleSend} aria-label="Send message">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
