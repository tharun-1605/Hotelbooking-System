import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <div className="container-custom py-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Layout;