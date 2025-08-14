import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserData, useAuthenticationStatus } from '@nhost/react';

import { useIsMobile } from '../../hooks/useIsMobile';
import Favorites from '../Favorites/Favorites'
import UserAbout from '../UserAbout/UserAbout'
import Orders from "../Orders/Orders"
import ChangePassword from '../ChangePassword/ChangePassword'
import TabsSection from '../TabsSection/TabsSection';
import LogOut from '../LogOut/LogOut'
import AddItem from '../AddItem/AddItem'

import './UserPage.css'

export default function UserPage() {
    const user = useUserData();
    const { isAuthenticated } = useAuthenticationStatus();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [tab, setTab] = useState('Profile')
    const isMobile = useIsMobile();

    useEffect(() => {
        if (isMobile && location.state?.openMenu) {
            setIsMobileMenuOpen(true);
            navigate(location.pathname, { replace: true, state: {} });
        }
        if (location.state?.initialTab) {
            setTab(location.state.initialTab);
        }
    }, [isMobile, location.pathname, location.state, navigate]);

    return (
        <div className='div-user-page'>
            {isMobile ? <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <TabsSection
                    active={tab}
                    onChange={(tab) => {
                        setTab(tab);
                        setIsMobileMenuOpen(false);
                    }}
                    space="UserPage"
                    direction="vertical"
                    onClose={() => setIsMobileMenuOpen(false)}
                />
            </div> :
                <div className='div-user-page-tabs'>
                    <TabsSection
                        active={tab}
                        onChange={(current) => setTab(current)}
                        direction="vertical"
                        space='UserPage' />
                </div>}
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