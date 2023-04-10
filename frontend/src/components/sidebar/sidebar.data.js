import React from 'react';
import * as RiIcons from 'react-icons/ri'
import * as AiIcons from 'react-icons/ai'
import * as IoIcons from 'react-icons/io'
import * as MdIcons from 'react-icons/md'


// Follow this pattern:
// {
//     title: "Dashboard",
//     path: "/dashboard",
//     icon: <MdIcons.MdDashboard />,
//     iconClosed: <RiIcons.RiArrowDownSFill />,
//     iconOpened: <RiIcons.RiArrowUpSFill />,
//     subNav: [
//         {
//             title: "Users",
//             path: "/overview/users",
//             icon: <IoIcons.IoIosPaper />
//         }
//     ]
// },

export const SidebarData = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdIcons.MdDashboard />
    },
    {
        title: "Accounts",
        path: "/accounts",
        icon: <MdIcons.MdAccountBalanceWallet />
    },
    {
        title: "Categories",
        path: "/categories",
        icon: <MdIcons.MdCategory />
    },
    {
        title: "Operations",
        path: "/operations",
        icon: <MdIcons.MdBalance />
    },
    {
        title: "Predictions",
        path: "/predictions",
        icon: <IoIcons.IoIosPaper />
    },
    {
        title: "Transfers",
        path: "/transfers",
        icon: <AiIcons.AiOutlineArrowsAlt />
    }
]
