import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle.tsx';
import WelcomeMessage from '../components/WelcomeMessage.tsx';
import Logout from '../components/Logout.tsx';

const HomePage = () => {
    const token = localStorage.getItem('token'); // save token

    return(
        <div>
            <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                {!token && <Link to="/auth">Login / Sign Up</Link>}
            </div>
            <PageTitle />
            <WelcomeMessage />
            {token && <Logout/>}
        </div>
    );
};
export default HomePage;
