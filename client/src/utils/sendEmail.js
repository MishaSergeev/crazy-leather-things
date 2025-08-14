export async function sendEmail(email, subject, orderData, type, mailTo, t, currency, globalData) {
  try {
    const htmlHeader =
      `<div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        ${mailTo === 'admin' ? `
          <p style="margin-top: 10px; margin-bottom: 10px;">
            Номер замовлення: ${orderData.order_number}
            <br>Ім'я замовника: ${orderData.user_name}
            <br>Номер телефону: ${orderData.delivery_phone}
            <br>Електронна пошта: ${orderData.delivery_email}
            <br>Як краще зв'язатись: ${orderData.delivery_connection}
            ${type==="Order"?
            `<br>Опис до замовлення: ${orderData.description}
            <br>Спосіб оплати: ${orderData.payment_method}
            <br>Спосіб доставки: ${orderData.delivery_method}
            <br>Номер відділення: ${orderData.delivery_branch}
            <br>Країна: ${orderData.delivery_country}
            <br>Місто: ${orderData.delivery_city}
            <br>Вулиця: ${orderData.delivery_street}
            <br>Будинок: ${orderData.delivery_building}
            <br>Квартира: ${orderData.delivery_apartment}
            <br>Індекс: ${orderData.delivery_zip}`:``}
          </p>` : 
          `<h2> ${t('email_title')}</h2>
              <p style="margin-top: 10px; margin-bottom: 10px;">
              ${t('email_body_1')}${orderData.user_name}
              <br>${t('email_body_2')}${orderData.order_number}
              <br>${t('email_body_3')}</p>`}`

    const htmlBody = type === 'Order'
      ? `<table style="border-collapse: collapse; width: 100%;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">${t('iten_img')}</th>
              <th style="border: 1px solid #ddd; padding: 8px;">${t('iten_name')}</th>
              <th style="border: 1px solid #ddd; padding: 8px;">${t('iten_qty')}</th>
              <th style="border: 1px solid #ddd; padding: 8px;">${t('iten_price')}</th>
            </tr>
          </thead>
          <tbody>
            ${Object.keys(JSON.parse(orderData.items)).map(key => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">
                <img src="${globalData.Items[key].src.split(',')[0]}" alt="${key}" width="100" />
              </td>
              <td style="border: 1px solid #ddd; padding: 8px;">${globalData.Items[key].description}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${JSON.parse(orderData.items)[key]}</td>
              <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${globalData.Items[key].price} ${currency}</td>
            </tr>
            `).join('')}
          </tbody>
        </table>
        <br><p style="margin-top: 5px;">${t('email_body_4')}${orderData.description}</p>
        <br><p style="margin-top: 5px;">${t('sum')} <strong>${orderData.sum} ${currency}</strong></p>`
      : `<br><p style="margin-top: 5px;">${t('email_body_4')}${orderData.comment}</p>
            ${orderData.src.length > 0 ? orderData.src.split(',').map(el =>
        `<img src="${el}" alt="${el}" style="margin-right: 5px; width: 100px;" />`).join('') : ``}`

    const htmlFooter = `${mailTo === 'admin' ? ``
      : `<p style="margin-top: 20px;">${t('email_footer_1')}<br>${t('email_footer_2')}<br>${t('email_footer_3')}</p>`}
      </div>`;
    const html = htmlHeader + htmlBody + htmlFooter

    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, subject, html }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error("Error:", data.error);
    }
  } catch (err) {
    console.error("Error sending email:", err);
  }
  return
}