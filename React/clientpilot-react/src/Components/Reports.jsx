
function Reports() {

    return (
        <div className="content">

            <h1>Business Reports</h1>
            <p>View your sales performance.</p>

            <div className="cards">

                <div className="card">
                    <h3>Total Revenue</h3>
                    <h2>₹2,50,000</h2>
                </div>

                <div className="card">
                    <h3>Successful Deals</h3>
                    <h2>18</h2>
                </div>

                <div className="card">
                    <h3>Pending Deals</h3>
                    <h2>7</h2>
                </div>

            </div>

            <div className="tab-content">
                <h2>Monthly Performance</h2>
                <p>August - ₹1,50,000</p>
                <p>September - ₹1,80,000</p>
                <p>October - ₹2,10,000</p>
                <p>November - ₹2,50,000</p>
            </div>

        </div>
    );
}

export default Reports;
