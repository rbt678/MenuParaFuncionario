
import React from 'react';
import { theme } from '../styles/theme';
import { TEXTS } from '../constants/texts';

const Footer: React.FC = () => {
  return (
    <footer className={`text-center mt-12 py-6 border-t border-[${theme.colors.borderDark}]`}>
      <p className={`text-[${theme.colors.primaryLight}] text-lg`}>{TEXTS.COMPANY_SOCIAL}</p>
      <p className={`text-sm text-[${theme.colors.textSecondary}] mt-2`}>{TEXTS.APP_VERSION}</p>
    </footer>
  );
};

export default Footer;
