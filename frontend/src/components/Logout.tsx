// Code Written by Adam Betinsky with assistance from ChatGPT. See the AI Disclosure for relevant information

// Main function for Logging out
function Logout()
{
    // Sub function to do the actual Log out. Removes the login token and redirects to home screen
    function doLogout()
    {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    // Visual elements. Very basic, but it does the job for now :)
    return(
        <div>
            <p>Ready to Logout? If so, click the button!</p>
            <button onClick={doLogout}>Log Out</button>
        </div>
    );
};

export default Logout; // Export the Logout function to be used elsewhere