import { useState } from 'react'
import { useUserData, useAuthenticationStatus } from '@nhost/react';

import { useGlobalData } from '../../context/GlobalDataContext'
import Button from '../Button/Button'
import Favorites from '../Favorites/Favorites'
import UserAbout from '../UserAbout/UserAbout'
import Orders from "../Orders/Orders"
import ChangePassword from '../ChangePassword/ChangePassword'
import LogOut from '../LogOut/LogOut'
import AddItem from '../AddItem/AddItem'

import './UserPage.css'

export default function UserPage() {
    const user = useUserData();
    const { isAuthenticated } = useAuthenticationStatus();
    const { globalData } = useGlobalData()
    const [tab, setTab] = useState('Profile')
    const buttonSection = globalData.user_tabs.map((el) =>
        <Button key={el.id}
            isActive={tab === el.id}
            onClick={() => { setTab(el.id) }} >
            {el.desc}
        </Button>
    )

    return (
        <div className='div-user-page'>
            <div className='div-user-page-tabs'>
                {buttonSection}
            </div>
            <div className='div-user-page-content'>
                {tab === 'Profile' && (
                    <UserAbout />
                )}
                {tab === 'MyOrders' && (
                    <Orders />
                )}
                {tab === 'Favorites' && (
                    <Favorites />
                )}
                {(isAuthenticated && user && user.defaultRole === 'admin') ? tab === 'AddItem' && (
                    <AddItem />
                ) : <></>}
                {tab === 'ChangePassword' && (
                    <ChangePassword />
                )}
                {tab === 'LogOut' && (
                    <LogOut />
                )}
            </div>
        </div>
    )
}