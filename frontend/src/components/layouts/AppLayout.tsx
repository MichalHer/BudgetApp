import React from 'react';
import { Sidebar } from '../sidebar/sidebar';
import { Outlet } from 'react-router-dom';

export interface IAppLayoutComponentProps {};

const AppLayoutComponent: React.FunctionComponent<IAppLayoutComponentProps> = (props) => {
    return (
        <>
            <Sidebar />
            <div className='p-5'>
                <Outlet />
            </div>
        </>
    );
};

export default AppLayoutComponent;