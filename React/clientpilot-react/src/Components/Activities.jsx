
function Activities() {

    const activities = [
        'Meeting with Acme Corporation - Today',
        'Follow-up call with Tech Solutions - Tomorrow',
        'Product demo - Friday',
        'Client discussion - Monday'
    ];

    return (
        <div className="content">

            <h1>Activities</h1>
            <p>Manage meetings and follow-ups.</p>

            <div className="tab-content">

                <h2>Upcoming Activities</h2>

                {activities.map((item, index) => (
                    <div className="activity-row" key={index}>
                        {item}
                    </div>
                ))}

            </div>

        </div>
    );
}

export default Activities;
