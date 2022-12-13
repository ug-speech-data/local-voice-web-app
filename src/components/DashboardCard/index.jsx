import './style.scss';


function DashboardCard(props) {
    return (
        <div className="dashboard-card col-md-6 mt-4">
            <div className="card-content p-3">
                {props.children}
            </div>
        </div>
    );
}

export default DashboardCard;
