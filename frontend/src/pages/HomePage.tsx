import PageTitle from '../components/PageTitle.tsx';
import WelcomeMessage from '../components/WelcomeMessage.tsx';
import Logout from '../components/Logout.tsx';

const HomePage = () =>
{
    return(
        <div>
            <PageTitle />
            <WelcomeMessage />
            <Logout/>
        </div>
    );
};
export default HomePage;
