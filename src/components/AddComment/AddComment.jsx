import { useState } from "react";
import { gql } from 'graphql-request'

import { nhost } from '../../nhost'
import { useUserData } from '@nhost/react';
import { useTranslation } from '../hooks/useTranslation';
import globalDefaults from "../../context/InitialGlobalData";
import Alert from '../Alert/Alert'
import Button from '../Button/Button';
import UploadImage from '../UploadImage/UploadImage';

const GET_LAST_COMMENT_NUMBER = gql`
  query GetLastOrderNumber {
    comments(order_by: { id: desc }, limit: 1) {
      id
    }
  }
`;
const UPSERT_COMMENTS = gql`
  mutation UpsertComment(
    $id: Int!,
    $user_id: uuid!,
    $item_id: String!,
    $user_name: String!,
    $comment: String!,
    $src: String!
) {
    insert_comments(
      objects: {
        id: $id
        user_id: $user_id
        item_id: $item_id
        user_name: $user_name
        comment: $comment
        src: $src
      }
    ) {
      affected_rows
    }
  }
`;
export default function AddComment(...props) {
  const [alert, setAlert] = useState(null)
  const user = useUserData()
  const t = useTranslation();

  const [UserData, setUserData] = useState({
    user_name: globalDefaults.User.last_name + ' ' + globalDefaults.User.first_name,
    user_id: globalDefaults.User.id,
    item_id: props[0].Item,
    comment: '',
    src: '',
  });
  const [imageList, setImageList] = useState([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async () => {
    if (!user) return;
    try {
      const { data } = await nhost.graphql.request(GET_LAST_COMMENT_NUMBER);
      const lastNumber = data?.comments?.[0]?.id || 0;
      const nextCommentNumber = lastNumber + 1;
      const src = imageList.join(",")
      const updateRes = await nhost.graphql.request(UPSERT_COMMENTS, {
        id: nextCommentNumber,
        ...UserData,
        src: src
      });
      console.log('updateRes', updateRes)
      if (updateRes.data) {
        setAlert({ type: 'success', message: 'Відгук збереженний!' });
      } else {
        setAlert({ type: 'error', message: 'Помилка при збереженні!' });
      }
    } catch (error) {
      console.error("Помилка при збереженні:", error);
      setAlert({ type: 'error', message: 'Помилка при збереженні!' })
    }
  };
  return (
    <>
      <div> {t('your_name')}
        <input name="user_name" value={UserData.user_name} onChange={handleChange} />
      </div>
      <div>
        {t('review')}
        <input name="comment" value={UserData.comment} onChange={handleChange} />
      </div>

      <UploadImage value={imageList} onChange={setImageList} />

      <Button onClick={handleSubmit}>{t('submit_comment')}</Button>
      {alert && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
    </>
  )
}