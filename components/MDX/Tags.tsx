import styles from "./Tags.module.css";

export const P = (props) => <p {...props} className={styles.p} />;

export const UL = (props) => <ul {...props} className={styles.ul} />;

export const OL = (props) => <ol {...props} className={styles.ol} />;

export const LI = (props) => <li {...props} className={styles.li} />;

export const Table = (props) => <table {...props} className={styles.table} />;

export const THead = (props) => <thead {...props} className={styles.thead} />;

export const TR = (props) => <tr {...props} className={styles.tr} />;

export const TH = (props) => <th {...props} className={styles.th} />;

export const TD = (props) => <td {...props} className={styles.td} />;

export const Video = (props) => <video {...props} className={styles.video} />;
