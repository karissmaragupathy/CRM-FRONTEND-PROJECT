
export default function EmployeeActivity({ records }) {
    return (
        <div className="content">
            <h2>Employee Activity</h2>
            <p>Monitor employee login and logout details.</p>

            <table>
                <thead>
                    <tr>
                        <th>Employee</th>
                        <th>Email</th>
                        <th>Login Time</th>
                        <th>Logout Time</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {records.map((record, index) => (
                        <tr key={index}>
                            <td>{record.name}</td>
                            <td>{record.email}</td>
                            <td>{record.login}</td>
                            <td>{record.logout || '-'}</td>
                            <td>{record.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
