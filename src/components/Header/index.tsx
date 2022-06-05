import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useRouter } from 'next/router';
import styles from './styles.module.css'

export default function Header(props: {
    title: string
}) {
    const router = useRouter()

    function onBack() {
        router.back();
    }

    return (
        <header className={styles.container}>
            <h2>{props.title}</h2>
            <button onClick={onBack}>
                <ArrowBackIosNewIcon />
            </button>
        </header>
    )
}