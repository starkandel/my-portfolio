import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Services from './pages/Services';
import Contact from './pages/Contact';
import SignUpForm from './pages/signup';
import SignInForm from './pages/signin';
import './App.css';

function App() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/signin" element={<SignInForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
