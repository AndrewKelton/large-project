import PageTitle from '../components/PageTitle.tsx';
import WelcomeMessage from '../components/WelcomeMessage.tsx';
import Logout from '../components/Logout.tsx';

const HomePage = () => {
    const token = localStorage.getItem('token'); // save token

    return(
        <div>
            <PageTitle />
            <WelcomeMessage />
            {token && <Logout/>}
        </div>
    );
};
export default HomePage;
