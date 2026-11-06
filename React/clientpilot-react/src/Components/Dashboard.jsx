
import { useState } from 'react';

function Dashboard() {

    const [tab, setTab] = useState('Overview');

    return (
        <div className="content">

            <h1>Welcome to ClientPilot!</h1>
            <p>Here is your business overview.</p>

            <div className="cards">

                <div className="card">
                    <h3>Total Clients</h3>
                    <h2>120</h2>
                </div>

                <div className="card">
                    <h3>Active Deals</h3>
                    <h2>25</h2>
                </div>

                <div className="card">
                    <h3>Won Deals</h3>
                    <h2>18</h2>
                </div>

                <div className="card">
                    <h3>Pending Follow-ups</h3>
                    <h2>10</h2>
                </div>

            </div>

            <div className="tabs">

                {['Overview', 'Recent Activities',
                    'Top Clients', 'Sales Analytics'].map(item => (

                        <button
                            className={tab === item ? 'active' : ''}
                            onClick={() => setTab(item)}
                            key={item}
                        >
                            {item}
                        </button>

                    ))}

            </div>

            <div className="tab-content">

                {tab === 'Overview' && (
                    <>
                        <h2>Business Overview</h2>
                        <p>Total Clients: 120</p>
                        <p>Active Deals: 25</p>
                        <p>Monthly Sales: ₹2,50,000</p>
                    </>
                )}

                {tab === 'Recent Activities' && (
                    <>
                        <h2>Recent Activities</h2>
                        <p>Meeting with Acme Corp</p>
                        <p>New client added</p>
                        <p>Deal completed successfully</p>
                    </>
                )}

                {tab === 'Top Clients' && (
                    <>
                        <h2>Top Clients</h2>
                        <p>Acme Corporation - ₹50,000</p>
                        <p>Tech Solutions - ₹35,000</p>
                        <p>Innovate Ltd - ₹20,000</p>
                    </>
                )}

                {tab === 'Sales Analytics' && (
                    <>
                        <h2>Sales Analytics</h2>
                        <p>Deals Won: 18</p>
                        <p>Deals Pending: 7</p>
                        <p>Success Rate: 72%</p>
                    </>
                )}

            </div>

        </div>
    );
}

export default Dashboard;
