import { useEffect, useState } from "react"
import { NavLink } from "react-router-dom"
import clsx from "clsx"

import { nhost } from "../../nhost"
import { useGlobalData } from "../../context/GlobalDataContext"
import { useTranslation } from '../../hooks/useTranslation';
import { GET_COMMENTS_DATA, GET_COMMENTS_DATA_BY_ID } from "../../graphql/queries"
import SwiperItemImg from "../SwiperItemimg/SwiperItemImg"
import Modal from "../Modal/Modal"

import classes from "./Comments.module.css"

export default function Comments(...props) {
    const [comments, setComments] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [isModal, setIsModal] = useState(false)
    const [gallery, setGallery] = useState([])

    const t = useTranslation();
    const { globalData } = useGlobalData()
    const Items = { ...globalData.Items }

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const item_id = props[0].Item
                const query = item_id ? GET_COMMENTS_DATA_BY_ID : GET_COMMENTS_DATA
                const variables = item_id ? { item_id } : {}
                const result = await nhost.graphql.request(query, variables)

                if (result.error) throw result.error

                result.data.comments.forEach((el) => {
                    el.src_arr = el.src !== "" ? el.src?.split(",") : ""
                })

                setComments(result.data.comments)
            } catch (error) {
                console.error("Comments data load error:", error)
            }
        }
        fetchComments()
    }, [props])

    const handleClose = () => setIsModal(false)

    const commentsPerPage = 10
    const totalPages = Math.ceil(comments.length / commentsPerPage)
    const paginatedComments = comments.slice(
        (currentPage - 1) * commentsPerPage,
        currentPage * commentsPerPage
    )

    const Comment = paginatedComments.map((el) => (
        <div
            className={classes.div_items_comments_parent}
            key={`${el.user_name}-${el.item_id}-${el.id}`}
        >
            <div className={classes.div_items_comments_user}>
                {el.user_name} - {el.date}
            </div>
            <div className={classes.div_items_comments_context}>
                <p>{el.comment}</p>
            </div>

            {Array.isArray(el.src_arr) &&
                el.src_arr.length > 0 &&
                el.src_arr?.map((img, index) => (
                    <img
                        key={index + el.id}
                        className={classes.img_comments}
                        src={img || ""}
                        alt=""
                        onClick={() => {
                            setGallery(el.src_arr)
                            setIsModal(true)
                        }}
                    />
                ))}

            {el.src_arr && el.src_arr !== "" ? (
                <Modal open={isModal} onClose={handleClose} isItemImg={true}>
                    <SwiperItemImg data={gallery} />
                </Modal>
            ) : (
                <></>
            )}

            {props[0].Item ? (
                <></>
            ) : (
                <div className={classes.div_items_comments}>
                    <NavLink to={Items[el.item_id]?.link || "#"}>
                        <img
                            className={classes.img_item_comments}
                            src={Items[el.item_id]?.src.split(",")[0] || ""}
                            alt=""
                        />
                    </NavLink>
                    <NavLink
                        to={Items[el.item_id]?.link || "#"}
                        style={{ color: "#000000", textDecoration: "none" }}
                    >
                        <div>{Items[el.item_id]?.description || ""}</div>
                    </NavLink>
                </div>
            )}
        </div>
    ))

    return (
        <>
            <h2 className={classes.div_comments_title}>{t('comments-title')}</h2>
            <div className={classes.div_items_comments_container}>
                {Comment}
                {totalPages > 1 && (
                    <div className={classes.pagination}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={clsx(
                                    classes.pagination_btn,
                                    page === currentPage && classes.active
                                )}
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
