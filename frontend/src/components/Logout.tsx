// Code Written by Adam Betinsky with assistance from ChatGPT. See the AI Disclosure for relevant information

// Main function for Logging out
function Logout() {
    // Sub function to do the actual Log out. Removes the login token and redirects to home screen
    function doLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        window.location.href = '/';
    }

    return (
        <button
            onClick={doLogout}
            aria-label="Log out of your account"
            className="nav-pill-btn"
        >
            Log Out
        </button>
    );
}

export default Logout; // Export the Logout function to be used elsewhere