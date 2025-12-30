import { useAuth } from '../context/AuthContext';
import StudentDashboard from '../components/StudentDashboard';
import MentorDashboard from '../components/MentorDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1 className="mb-4">Dashboard</h1>
            {user.role === 'student' ? <StudentDashboard /> : <MentorDashboard />}
        </div>
    );
};

export default Dashboard;
