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
            title="Go to homepage"
        >
            <img src={logo} alt="KnightRate logo" id="logo-img" />
            <span id="logo-home-label">Home</span>
        </button>
    );
}

export default LogoLink;
