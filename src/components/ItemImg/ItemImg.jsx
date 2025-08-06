import { useState } from 'react'
import { useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";

import ItemFavoriteButton from "../ItemFavoriteButton/ItemFavoriteButton";
import SwiperItem from '../SwiperItem/SwiperItem';
import SwiperItemImg from '../SwiperItemimg/SwiperItemImg';
import Modal from '../Modal/Modal';

import './ItemImg.css'

export default function ItemImg({ ...props }) {
    const [isModal, setIsModal] = useState(false)
    const location = useLocation();
    const handleOpen = () => {
        if (location.pathname === "/") {
            setIsModal(false);
        } else {
            setIsModal(true);
        }
    }
    const handleClose = () => setIsModal(false);
    const src = props.data?.src?.split(",")
    return (
        <>
            <ItemFavoriteButton data={props.data} />
            <NavLink to={props.data.link}
                style={{
                    display: 'contents'
                }}
            >
                <SwiperItem onClick={handleOpen} data={src} id={props.data.id} />
            </NavLink>
            <Modal open={isModal} onClose={handleClose} isItemImg={true}>
                <SwiperItemImg data={src} id={props.data.id} />
                <h3 className='h3-item-description'>{props.data.description}</h3>
            </Modal>
        </>
    )
}