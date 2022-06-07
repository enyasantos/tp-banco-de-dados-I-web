import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import styles from './styles.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <a>
            Powered by{' '}
            <span className={styles.logo}>
                <AirplanemodeActiveIcon fontSize='small'/>
            </span>
            vooe
            </a>
        </footer>
    )
}