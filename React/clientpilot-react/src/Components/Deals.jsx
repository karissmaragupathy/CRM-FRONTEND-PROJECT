
function Deals() {

    const deals = [
        { name: 'Website Development', value: '₹50,000', status: 'Won' },
        { name: 'Software Project', value: '₹35,000', status: 'Pending' },
        { name: 'Cloud Services', value: '₹20,000', status: 'Active' }
    ];

    return (
        <div className="content">

            <h1>Deal Management</h1>
            <p>Track your business deals.</p>

            <div className="tab-content">

                <h2>All Deals</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Deal Name</th>
                            <th>Value</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {deals.map((deal, index) => (
                            <tr key={index}>
                                <td>{deal.name}</td>
                                <td>{deal.value}</td>
                                <td>{deal.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>

        </div>
    );
}

export default Deals;
