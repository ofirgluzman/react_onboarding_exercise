import styles from './AppTopHeader.module.css';

const AppTopHeader = () => {
  return (
    <header className={styles.container}>
      <span className={styles.logoText}>Lightricks</span>
      <div className={styles.avatar}>TJ</div>
    </header>
  );
};

export default AppTopHeader;
