
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import styles from './styles.module.css'

type IProps = {
    columns: string[]
    data: any[]
}

export default function Table({ columns, data }: IProps) {

    const [count] = useState(data.length);
    const [rowSelected, setRowSelected] = useState<string[]>([]);
    const [allSelected, setAllSelected] = useState(false);

    function handleDelete() {
        console.log(rowSelected);
    }

    return (
        <section className={styles.container}>
            <div className={styles.content}>
                <header className={styles.header}>
                    <label className={styles.search}>
                        <input type="text" />
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
                        {data.map((d, index) => (
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

    useEffect(() => {
        let has = -1;
        if(props.rowSelected.length > 0 && props.allSelected) {
            has = props.rowSelected.indexOf(props.d.id);
        }

        if(has === -1) {
            if(props.allSelected) {
                setSelected(true);
                props.setRowSelected((c) => [...c, props.d.id]);
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
                                props.setRowSelected((c) => [...c, props.d.id])
                            } else {
                                props.setRowSelected((c) => c.filter((item) => {
                                    return item !== props.d.id
                                }))
                            }
                        }}/>
                    </label>
                </th>
                <th>{props.d.id}</th>
                <td>{props.d.title}</td>
                <td>{props.d.authors}</td>
                <td>{props.d.num_pages}</td>
                <td>{props.d.rating}</td>
            </tr>
            {props.index !== (props.count - 1) && (
                <tr className={styles.spacer}>
                    <td colSpan={100}></td>
                </tr>
            )}
        </>
    )
}