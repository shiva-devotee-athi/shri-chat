import { useAuth } from '../../hooks/useAuth';
import '../UnauthenticatedApp/style.css';
import YourSvg from "../UnauthenticatedApp/google.png";

function UnauthenticatedApp() {
    const { login } = useAuth();

    return (
        <>
            <h2 className='log-in'>Log in to join a chat room! <i className="fa fa-sign-in" aria-hidden="true"></i></h2>
            <div className='button-for-login'>
                <p  onClick={login} className="login">
                    Login with Google  
                </p> 
                <img src={YourSvg} className='google' alt="Your SVG" />
            </div>

        </>
    );
}

export { UnauthenticatedApp };