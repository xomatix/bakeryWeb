import { Link } from 'preact-router';
import './Navbar.css';
import { useEffect, useState } from 'preact/hooks';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(true);
    
    useEffect(() => {
        window.addEventListener('keypress', (e) => {
            if (e.key == '`') {
                setTimeout(() => {
                    toggleNavbar()
                }, 50);
            }
        })
    },[])

    const toggleNavbar = () => {
        
        setIsOpen((prevVisibility) => !prevVisibility);
    };

    return (
        <>
            <div className={`navbar ${isOpen ? 'open' : ''}`}>
            <button className="toggle-button" onClick={toggleNavbar}>
                ☰
            </button>

                {/* style={{display: isOpen ? 'block' : 'none'}} */}
                <nav className="navbar-content" >
                    <Link href="/">Home</Link>
                    <Link href="/clients">Clients</Link>
                    <Link href="/staff">Staff</Link>
                    <Link href="/bread_categories">Bread Categories</Link>
                    <Link href="/ingredients">Ingredients</Link>
                    <Link href="/stock">Stock</Link>
                    <Link href="/breads">Breads</Link>
                    <Link href="/orders">Orders</Link>
                </nav>
            </div>
        </>
    );
};

export default Navbar;