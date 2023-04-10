import React from 'react';
import * as RiIcons from 'react-icons/ri'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import * as MdIcons from 'react-icons/md'

export const SidebarData = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdIcons.MdDashboard />,
        // iconClosed: <RiIcons.RiArrowDownSFill />,
        // iconOpened: <RiIcons.RiArrowUpSFill />,
        // subNav: [
        //     {
        //         title: "Users",
        //         path: "/overview/users",
        //         icon: <IoIcons.IoIosPaper />
        //     }
        // ]
    },
    {
        title: "Accounts",
        path: "/accounts",
        icon: <MdIcons.MdAccountBalanceWallet />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,
        // subNav: [
        //     {
        //         title: "Reports1",
        //         path: "/reports/1",
        //         icon: <IoIcons.IoIosPaper />
        //     },
        //     {
        //         title: "Reports2",
        //         path: "/reports/2",
        //         icon: <IoIcons.IoIosPaper />
        //     }
        // ]
    },
    {
        title: "Categories",
        path: "/categories",
        icon: <MdIcons.MdCategory />,
    },
    {
        title: "Operations",
        path: "/operations",
        icon: <MdIcons.MdBalance />,
    },
    {
        title: "Predictions",
        path: "/predictions",
        icon: <IoIcons.IoIosPaper />,
    },
    {
        title: "Transfers",
        path: "/transfers",
        icon: <AiIcons.AiOutlineArrowsAlt />,
    }
]
