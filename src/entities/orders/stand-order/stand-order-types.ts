export const StandOrderStatus = {
  Preliminary: 'Не оплачен',
  InProgress: 'В работе',
  ReadyToShip: 'Готов к отправке',
  Shipped: 'Отправлен',
  Delivered: 'Доставлен',
  Received: 'Получен',
};

export type StandOrderStatusType =
  (typeof StandOrderStatus)[keyof typeof StandOrderStatus];
export type StandOrderStatusKeyType = keyof typeof StandOrderStatus;
