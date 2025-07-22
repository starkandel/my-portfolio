import { Link } from 'react-router-dom';
import '../App.css';
import logo from '../assets/logo.png';

const Navbar = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.clear();
        window.location.reload();
    };
    return (
        <nav className="navbar">
            <img src={logo} alt="Logo" className="logo" />
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/about">About Me</Link>
                <Link to="/projects">Projects</Link>
                <Link to="/services">Services</Link>
                <Link to="/contact">Contact</Link>
                {!user ? (
                    <>
                        <Link to="/signup">Signup</Link>
                        <Link to="/signin">Signin</Link>
                    </>
                ) : (
                    <>
                        <span className="welcome-text">Welcome, {user.name} </span>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
