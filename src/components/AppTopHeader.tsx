import React from 'react';
import './AppTopHeader.css';

const AppTopHeader: React.FC = () => {
  return (
    <header className="app-top-header">
      <span className="app-top-header__logo-text">Lightricks</span>
      <div className="app-top-header__avatar">TJ</div>
    </header>
  );
};

export default AppTopHeader;
