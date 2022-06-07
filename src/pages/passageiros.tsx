import Head from 'next/head'
import Footer from '../components/Footer'
import Header from '../components/Header'
import styles from '../styles/Passageiros.module.css'
import MUIDataTable from 'mui-datatables';
import { data } from '../data/data';
import Table from '../components/Table';

export default function Passageiros() {
    const columns = [
        'Id',
        'Title',
        'Author',
        'Page Count',
        'Rating',
    ];
    return (
        <div className={styles.container}>
            <Head>
                <title>Vooe - Sistema de Gerenciamento</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header title="Passageiros"/>
            <div className={styles.content}>
                <Table columns={columns} data={data}/>
            </div>
            <Footer/>
        </div>
    )
}