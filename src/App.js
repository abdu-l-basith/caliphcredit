import logo from './logo.svg';
import './App.css';
import TopBar from './components/common/TopBar';
import HeaderBar from './components/common/HeaderBar';
import Footer from './components/common/Footer';
import FacultyDashboard from './components/faculty/FacultyDashboard';
import AcademicPerformanceForm from './components/faculty/AcademicPerformanceForm';
import DashboardLayout from './components/common/DashboardLayout';


function App() {
  return (
    <div className='app-container'>
    {/* <TopBar></TopBar>
    <FacultyDashboard></FacultyDashboard>
    <Footer></Footer> */}
    
    <DashboardLayout>
      <FacultyDashboard />
    </DashboardLayout>
    </div>
  
  );
}

export default App;
