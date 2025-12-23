import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <nav className="bg-gray-800 p-4 text-white">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/dashboard" className="text-xl font-bold">StockFlow</Link>
                <div className="flex gap-4 items-center">
                    <Link to="/dashboard" className="hover:text-gray-300">Dashboard</Link>
                    <Link to="/products" className="hover:text-gray-300">Products</Link>
                    {user && <span className="text-sm text-gray-400">({user.organizationName})</span>}
                    <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm">Logout</button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
