import { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom";

import { nhost } from '../../nhost'
import { useGlobalData } from '../../context/GlobalDataContext'
import { GET_COMMENTS_DATA, GET_COMMENTS_DATA_BY_ID} from '../../graphql/queries';
import SwiperItemImg from '../SwiperItemimg/SwiperItemImg';
import Modal from "../Modal/Modal";

import './Comments.css'

export default function Comments(...props) {
    const defaulComments = []
    const [comments, setComments] = useState(defaulComments)
    const [currentPage, setCurrentPage] = useState(1);
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const item_id = props[0].Item
                const query = item_id ? GET_COMMENTS_DATA_BY_ID : GET_COMMENTS_DATA;
                const variables = item_id ? { item_id } : {};
                const result = await nhost.graphql.request(query, variables)
                if (result.error) throw result.error
                result.data.comments.forEach(el => {
                    el.src_arr = el.src!==''?el.src?.split(","):''
                })

                setComments(result.data.comments)
            } catch (error) {
                console.error('Comments data load error:', error)
            }
        }
        fetchComments()
    }, [props])

    const [isModal, setIsModal] = useState(false)
    const handleOpen = () => setIsModal(true);
    const handleClose = () => setIsModal(false);
    const { globalData } = useGlobalData()
    const Items = { ...globalData.Items }
    const сommentPerPage = 10;
    const totalPages = Math.ceil(comments.length / сommentPerPage);
    const paginatedComments = comments.slice(
        (currentPage - 1) * сommentPerPage,
        currentPage * сommentPerPage
    );
    const Comment = paginatedComments.map((el) => (
        <div className='div-items-comments-parent' key={`${el.user_name}-${el.item_id}-${el.id}`}>
            <div className='div-items-comments-user'>{el.user_name} - {el.date}</div>
            <div className='div-items-comments-context'><p>{el.comment}</p></div>
            {el.src_arr!==''&&el.src_arr?.map((img, index) =>
                <img
                    key={index + el.id}
                    className='img-comments'
                    src={img || ""}
                    alt=""
                    onClick={handleOpen}
                />)}
            {el.src_arr&&el.src_arr!=='' ? (<Modal open={isModal} onClose={handleClose} isItemImg={true}>
                <SwiperItemImg data={el.src_arr} />
            </Modal>) : (<></>)}

            {props[0].Item ? (
                <></>
            ) : (
                <div className='div-items-comments'>
                    <NavLink to={Items[el.item_id]?.link || "#"}>
                        <img
                            className='img-item-comments'
                            src={Items[el.item_id]?.src.split(",")[0] || ""}
                            alt=""
                        />
                    </NavLink>
                    <NavLink
                        to={Items[el.item_id]?.link || "#"}
                        style={{
                            color: '#000000',
                            textDecoration: 'none',
                        }}
                    >
                        <div>{Items[el.item_id]?.description || ""}</div>
                    </NavLink>
                </div>
            )}

        </div>
    ))
    return (
        <>
            <div className='div-items-comments-container'>
                {Comment}
                {totalPages > 1 && (
                    <div className="pagination">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>

        </>
    )
}