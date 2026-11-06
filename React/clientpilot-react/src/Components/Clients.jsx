
import { useState } from 'react';

function Clients() {

    const [clients, setClients] = useState([
        { name: 'Acme Corporation', email: 'acme@gmail.com' },
        { name: 'Tech Solutions', email: 'tech@gmail.com' },
        { name: 'Innovate Ltd', email: 'innovate@gmail.com' }
    ]);

    const [name, setName] = useState('');

    function addClient() {
        if (name.trim() === '') return;

        setClients([
            ...clients,
            { name: name, email: 'Not provided' }
        ]);

        setName('');
    }

    return (
        <div className="content">

            <h1>Client Management</h1>
            <p>Manage your company clients.</p>

            <div className="add-client">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter client name"
                />

                <button onClick={addClient}>
                    Add Client
                </button>
            </div>

            <div className="tab-content">

                <h2>Client List</h2>

                {clients.map((client, index) => (
                    <div className="client-row" key={index}>
                        <b>{client.name}</b>
                        <span>{client.email}</span>
                    </div>
                ))}

            </div>

        </div>
    );
}

export default Clients;
