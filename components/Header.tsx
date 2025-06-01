
import React from 'react';
import Logo from './Logo';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

const Header: React.FC = () => {
  return (
    <header className="text-center mb-8">
      <Logo />
      <h1 
        className={`font-['${theme.fonts.heading}'] text-[${theme.colors.primary}] text-4xl sm:text-5xl font-bold`}
        style={{ fontFamily: theme.fonts.heading }}
      >
        {TEXTS.HEADER_MAIN_TITLE}
      </h1>
      <p className={`text-xl text-[${theme.colors.primaryLight}]`} style={{ fontFamily: theme.fonts.body }}>
        {TEXTS.HEADER_SUB_TITLE}
      </p>
    </header>
  );
};

export default Header;
