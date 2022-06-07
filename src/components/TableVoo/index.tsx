
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles.module.css'
import { api } from '../../service/api';

type IProps = {
    columns: string[]
    data: any[]
    setAlterData: Dispatch<SetStateAction<number>>
    alterData: number
}

export default function TableVoo({ setAlterData, alterData, columns, data }: IProps) {

    const [count] = useState(data.length);
    const [allData, setAllData] = useState(data);
    const [rowSelected, setRowSelected] = useState<string[]>([]);
    const [allSelected, setAllSelected] = useState(false);
    const [search, setSearch] = useState('');

    function handleDelete() {
        console.log('Not working ...')
    }

    useEffect(() => {
        if(search) {
            api.get(`buscar-voo/${search}`).then((response) => {
                setAllData(response.data)
            })
        } else {
            setAllData(data);
        }
    }, [data, search, alterData])

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <label className={styles.search}>
                        <input type="text" value={search} onChange={(e) => { setSearch(e.target.value) }} />
                        <SearchIcon />
                    </label>
                    {rowSelected.length > 0 && (
                        <button className={styles.btn__delete} onClick={handleDelete}>
                            <DeleteIcon />
                        </button>
                    )}
                </header>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>
                                <label>
                                    <input type="checkbox"  onChange={(e) => {
                                        setAllSelected(e.target.checked);
                                    }}/>
                                </label>
                            </th>
                            {columns.map((column, index) => (
                                !search ? (
                                    index < 5 && (<th scope="col" key={column}>{column}</th>)
                                ) : (
                                    <th scope="col" key={column}>{column}</th>
                                )
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {allData.map((d, index) => (
                        <Row 
                            key={d.id}
                            count={count}
                            d={d}
                            index={index}
                            rowSelected={rowSelected}
                            setRowSelected={setRowSelected}
                            allSelected={allSelected}
                            search={search}
                        />
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    )
}

function Row(props: { 
    count: number, 
    d: any, 
    index: number, 
    rowSelected: string[],
    setRowSelected: Dispatch<SetStateAction<string[]>>
    allSelected: boolean
    search: string
}) {
    const [selected, setSelected] = useState(false);

    function convertData(data: string) {
        const data_americana = data;
        const data_brasileira = data_americana.split('-');
        return `${data_brasileira[2][0]}${data_brasileira[2][1]}/${data_brasileira[1]}/${data_brasileira[0]}`;
    }

    useEffect(() => {
        let has = -1;
        if(props.rowSelected.length > 0 && props.allSelected) {
            has = props.rowSelected.indexOf(props.d.cpf);
        }

        if(has === -1) {
            if(props.allSelected) {
                setSelected(true);
                props.setRowSelected((c) => [...c, props.d.cpf]);
            } else {
                setSelected(false);
                props.setRowSelected([]);
            }
        }
        
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.allSelected])

    return (
        <>
            <tr className={selected ? styles.active : ''}>
                <th>
                    <label>
                        <input 
                        type="checkbox" 
                        checked={selected}
                        onChange={(e) => { 
                            setSelected(e.target.checked) 
                            if(e.target.checked) {
                                props.setRowSelected((c) => [...c, props.d.cpf])
                            } else {
                                props.setRowSelected((c) => c.filter((item) => {
                                    return item !== props.d.cpf
                                }))
                            }
                        }}/>
                    </label>
                </th>
                <th>{props.d.codigo}</th>
                <td>{props.d.registro}</td>
                <td>{props.d.cpf_piloto}</td>
                <td>{props.d.codigo_itinerario}</td>
                <td>{convertData(props.d.data)}</td>
                {
                    props.search && (
                        <>
                            <th>{props.d.cpf_comissario}</th>
                            <th>{props.d.tempo_duracao_minutos}</th>
                            <th>{props.d.aeroporto_origem}</th>
                            <th>{props.d.aeroporto_destino}</th>
                        </>
                    )
                }
            </tr>
            {props.index !== (props.count - 1) && (
                <tr className={styles.spacer}>
                    <td colSpan={100}></td>
                </tr>
            )}
        </>
    )
}