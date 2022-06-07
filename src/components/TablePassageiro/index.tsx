
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles.module.css'
import { api } from '../../service/api';

type IProps = {
    columns: string[]
    data: any[]
    setAlterPassageiro: Dispatch<SetStateAction<number>>
    alterPassageiro: number
}

export default function TablePassageiro({ setAlterPassageiro, alterPassageiro, columns, data }: IProps) {

    const [count] = useState(data.length);
    const [passageiros, setPassageiros] = useState(data);
    const [rowSelected, setRowSelected] = useState<string[]>([]);
    const [allSelected, setAllSelected] = useState(false);
    const [search, setSearch] = useState('');


    function handleDelete() {
        rowSelected.map((cpf) => {
            api.delete((`deletar-passageiro/${cpf}`)).then(() => {
                setAlterPassageiro(c => c + 1);
            })
        })
    }

    useEffect(() => {
        if(search) {
            api.get(`buscar-passageiro/${search}`).then((response) => {
                setPassageiros(response.data)
            })
        } else {
            setPassageiros(data);
        }
    }, [data, search, alterPassageiro])

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
                            {columns.map((column) => (
                                <th scope="col" key={column}>{column}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {passageiros.map((d, index) => (
                        <Row 
                            key={d.id}
                            count={count}
                            d={d}
                            index={index}
                            rowSelected={rowSelected}
                            setRowSelected={setRowSelected}
                            allSelected={allSelected}
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
                <th>{props.d.cpf}</th>
                <td>{props.d.nome}</td>
                <td>{props.d.sexo}</td>
                <td>{props.d.rg}</td>
                <td>{convertData(props.d.data_nascimento)}</td>
            </tr>
            {props.index !== (props.count - 1) && (
                <tr className={styles.spacer}>
                    <td colSpan={100}></td>
                </tr>
            )}
        </>
    )
}