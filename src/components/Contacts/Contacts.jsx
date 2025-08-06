import { SiInstagram } from 'react-icons/si'
import { Facebook } from '@mui/icons-material'
import { SiEtsy } from 'react-icons/si';

import { useTranslation } from '../../hooks/useTranslation'

import './Contacts.css'

export default function Contacts() {
  const t = useTranslation()

  return (
    <div className="div-contacts-container">
      <img src="https://ydlylvuihkcjzlsgityq.storage.eu-west-2.nhost.run/v1/files/39e24b73-3213-4727-aa88-60277170afdb" alt="Olga" className="img-contacts-photo" />

      <h2 className="h2-contacts-name">{t('contacts_name')}</h2>
      <p className="p-contacts-role">{t('contacts_role')}</p>
      <p className="p-contacts-description">{t('contacts_description')}</p>

      <div className="div-contacts-links">
        <a
          href="https://www.instagram.com/crazy_leather_things/"
          target="_blank"
          rel="noopener noreferrer"
          className="a-contacts-link"
        >
          <SiInstagram className="icon-contacts-social" />
          Instagram
        </a>

        <a
          href="https://www.facebook.com/CrazyLeatherThings/"
          target="_blank"
          rel="noopener noreferrer"
          className="a-contacts-link"
        >
          <Facebook className="icon-contacts-social" />
          Facebook Page
        </a>

        <a
          href="https://www.facebook.com/olga.klymenko.376/media_set?set=a.292161304649404&type=3"
          target="_blank"
          rel="noopener noreferrer"
          className="a-contacts-link"
        >
          <Facebook className="icon-contacts-social" />
          Photo Album
        </a>
        <a
          href="https://www.etsy.com/shop/CrazyLeatherThings"
          target="_blank"
          rel="noopener noreferrer"
          className="a-contacts-link"
        >
          <SiEtsy className="icon-contacts-social" />
          Etsy Store
        </a>
      </div>
    </div>
  )
}