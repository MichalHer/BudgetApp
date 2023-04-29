import React from 'react';

export interface ITableComponentProps {
    table_headers: Array<string>
    table_content: Array<object>
};



const TableComponent: React.FunctionComponent<ITableComponentProps> = (props) => {
    return (
        <div className="table table-responsive">
            <table className="table table-dark table-borderless table-striped">
                <thead>
                    <tr>
                        {
                            props.table_headers.map(column_name => {
                                return (<th>{column_name}</th>)
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        props.table_content.map(obj => {
                            return(
                                <tr>
                                    {
                                        Object.keys(obj).map(key=>{
                                            return (<td>{obj[key as keyof typeof obj]}</td>)
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    );
};

export default TableComponent;