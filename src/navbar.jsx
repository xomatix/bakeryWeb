import { Link } from 'preact-router';
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link href="/">Home</Link>
            <Link href="/clients">Clients</Link>
            <Link href="/staff">Staff</Link>
            <Link href="/bread_categories">Bread Categories</Link>
            <Link href="/ingredients">Ingredients</Link>
            <Link href="/stock">Stock</Link>
            <Link href="/breads">Breads</Link>
            <Link href="/orders">Orders</Link>
        </nav>
    );
};

export default Navbar;