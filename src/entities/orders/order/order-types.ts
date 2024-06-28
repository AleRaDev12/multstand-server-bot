export const OrderTypes = {
  Preliminary: 'Предварительный',
  PartiallyPaid: 'Оплачен частично',
  FullyPaid: 'Оплачен полностью',
  Delivered: 'Доставлен',
  ReceivedReview: 'Получен отзыв',
  BeingFixed: 'Исправляется',
  Cancelled: 'Отменён',
};

export type OrderStatusType = (typeof OrderTypes)[keyof typeof OrderTypes];
