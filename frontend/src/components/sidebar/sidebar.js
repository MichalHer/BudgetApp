import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from "./sidebar.data";
import { SubMenu } from "./sidebar.menu";
import { IconContext } from "react-icons/lib";


const Nav = styled.div`
    background: #15171c;
    height: 50px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

const NavIcon = styled(Link)`
    margin-top: 1rem;
    margin-left: 1rem;
    font-size: 20;
    height: 35px;
    display: flex;
    justify-content: flex-start;
    align-items;
`;

const SidebarNav = styled.nav`
    background: #15171c;
    width: 250px;
    height: 100vh;
    display: flex;
    justify-content: center;
    position: fixed;
    top: 0;
    left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
    transition: 350ms;
    z-index: 10;
`;

const SidebarWrap = styled.div`
    width: 100%;
`;

export const Sidebar = () => {
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => setSidebar(!sidebar)

    return(
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <Nav>
                <NavIcon to='#'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </NavIcon>
                </Nav>
                <SidebarNav sidebar={sidebar}>
                <SidebarWrap>
                    <NavIcon to='#'>
                    <AiIcons.AiOutlineClose onClick={showSidebar} />
                    </NavIcon>
                    {SidebarData.map((item, index) => {
                    return <SubMenu item={item} key={index} />;
                    })}
                </SidebarWrap>
                </SidebarNav>
            </IconContext.Provider>
        </>
    );
}