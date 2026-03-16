import React from 'react';
import styles from '../styles/IndexPage.module.css'; // we'll reuse same header styles
import { Language } from '../types';

interface HeaderProps {
    showTimer?: boolean;
    timer?: string;
    onLanguageChange?: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ showTimer, timer, onLanguageChange }) => {
    return (
        <div className={styles.header}>
            <img src="/navbarIcon.png" className={styles.logo} alt="HHT Logo" />
            <div>HHT One-to-One Mentor</div>
            {showTimer && <div className={styles.timer}>{timer}</div>}
            {onLanguageChange && (
                <select
                    className={styles.langSelector}
                    onChange={(e) => onLanguageChange(e.target.value as Language)}
                    defaultValue={localStorage.getItem('language') || 'en-IN'}
                >
                    <option value="en-IN">English (India)</option>
                    <option value="hi-IN">Hindi (India)</option>
                </select>
            )}
        </div>
    );
};

export default Header;