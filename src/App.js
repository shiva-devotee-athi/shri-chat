import { AuthenticatedApp } from './components/AuthenticatedApp';
import { UnauthenticatedApp } from './components/UnauthenticatedApp';
import { useAuth } from './hooks/useAuth';
import './App.css';
// import { BrowserRouter } from 'react-router-dom';

function App() {
    const { user } = useAuth();

    return (
        
        <div className="container">
            <h1 className='heading-chat'>🫰🏼Chat Room</h1>
            {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
        </div>
       
    );
}

export default App;