import { useState } from "react";

import { nhost } from '../../nhost'
import { useUserData } from '@nhost/react';
import { useTranslation } from '../../hooks/useTranslation';
import { GET_LAST_COMMENT_NUMBER, UPSERT_COMMENTS } from '../../graphql/queries';
import globalDefaults from "../../context/InitialGlobalData";
import Alert from '../Alert/Alert'
import Button from '../Button/Button';
import UploadImage from '../UploadImage/UploadImage';
import FormField from "../FormField/FormField";

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
      <FormField
        key={'add_comment_name'}
        label={'reviewers_name'}
        name={"user_name"}
        value={UserData.user_name}
        onChange={handleChange}
        type="text"
        t={t}
      />
      <FormField
        key={'add_comment_review'}
        label={'review'}
        name={"comment"}
        value={UserData.comment}
        onChange={handleChange}
        type="text"
        t={t}
      />

      <UploadImage value={imageList} onChange={setImageList} label={t('reviewers_photo')} />

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