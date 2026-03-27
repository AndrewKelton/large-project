import { useState } from 'react';

interface LoginProps {
    onSwitchToRegister?: () => void;
}

function Login({ onSwitchToRegister }: LoginProps)
{
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [userPassword, setPassword] = useState('');

    async function doLogin(event:any) : Promise<void>
    {
        event.preventDefault();
        
        var obj = {"Username": username, "Password": userPassword};
        var js = JSON.stringify(obj);

        try {
            const response = await fetch('http://leandrovivares.com/api/login', {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' }
            });

            var res = JSON.parse(await response.text());

            if (!res.token) {
                setMessage('User/Password combination incorrect');
            } else {
                localStorage.setItem('token', res.token);
                setMessage('');
                window.location.href = '/HomePage'; // doesn't exist yet!
            }
        } catch(error: any) {
            alert(error.toString());
            return;
        }
    };

    // set user's login name
    function handleSetUsername(e: any) : void {
        setUsername(e.target.value);
    }

    // set user's password
    function handleSetPassword(e: any) : void {
        setPassword(e.target.value);
    }

    // return form
    return(
        <div id="loginDiv">
            <span id="inner-title">PLEASE LOG IN</span><br />
            <input type="text" id="username" placeholder="Username"
                onChange={handleSetUsername} />
            <input type="password" id="userPassword" placeholder="Password"
                onChange={handleSetPassword} />
            <input type="submit" id="loginButton" className="buttons" value = "Do It" onClick={doLogin} />
            <span id="loginResult">{message}</span>
            <br />
            <p style = {{display: 'inline'}}>Don't have an account? Click </p>
            <button className="link-button" onClick={onSwitchToRegister}>here</button>
            <p style = {{display: 'inline'}}> to make one! </p>
        </div>
    );
};
export default Login;
