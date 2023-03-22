import './style.scss';


function DashboardCard(props) {
    return (
        <div className="dashboard-card mt-4">
            <div className="card-content p-3" style={{ overflow: "auto" }}>
                {props.children}
            </div>
        </div>
    );
}

export default DashboardCard;
