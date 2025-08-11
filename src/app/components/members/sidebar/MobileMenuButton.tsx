import { Menu } from 'lucide-react';
import styles from './MobileMenuButton.module.css';

interface MobileMenuButtonProps {
  onClick: () => void;
}

export default function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <button 
      className={styles.menuButton} 
      onClick={onClick} 
      title="Open Menu"
      aria-label="Open Menu"
    >
      <Menu size={20} />
    </button>
  );
}