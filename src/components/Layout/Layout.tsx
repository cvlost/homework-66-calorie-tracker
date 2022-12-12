import React from 'react';
import {Link} from "react-router-dom";

const Layout: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <div className="vh-100 d-flex flex-column">
      <header className="text-bg-dark sticky-top py-2">
        <div className="container">
          <Link to="/" className="m-0 nav-link fs-4">Calorie tracker</Link>
        </div>
      </header>
      <main className="container flex-grow-1 overflow-auto">
        <div className="row h-100">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;