import { useNavigate } from 'react-router-dom';
import './LogoLink.css';
import logo from '/knight-rate-app-logo.png';

function LogoLink() {
    const navigate = useNavigate();

    return (
        <button
            id="logo-link"
            onClick={() => navigate('/')}
            aria-label="Go to homepage"
        >
            <img src={logo} alt="KnightRate logo" id="logo-img" />
        </button>
    );
}

export default LogoLink;
