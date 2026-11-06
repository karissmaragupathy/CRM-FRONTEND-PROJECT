
import { useState } from 'react';

function ChatBox() {

    const [message, setMessage] = useState('');

    const [messages, setMessages] = useState([
        { name: 'Rahul', text: 'Hello team!' },
        { name: 'Priya', text: 'Meeting at 3 PM.' }
    ]);

    function sendMessage() {

        if (message.trim() === '') return;

        setMessages([
            ...messages,
            { name: 'You', text: message }
        ]);

        setMessage('');
    }

    return (
        <div className="content">

            <h1>Employee Chat</h1>
            <p>Communicate with your team.</p>

            <div className="chat-box">

                <div className="messages">

                    {messages.map((msg, index) => (
                        <div className="message" key={index}>
                            <b>{msg.name}</b>
                            <p>{msg.text}</p>
                        </div>
                    ))}

                </div>

                <div className="chat-input">

                    <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                    />

                    <button onClick={sendMessage}>
                        Send
                    </button>

                </div>

            </div>

        </div>
    );
}

export default ChatBox;
