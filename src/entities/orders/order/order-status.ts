export const OrderStatus = {
  Preliminary: 'Предварительный',
  PartiallyPaid: 'Оплачен частично',
  FullyPaid: 'Оплачен полностью',
  Delivered: 'Доставлен',
  ReceivedReview: 'Получен отзыв',
  BeingFixed: 'Исправляется',
  Cancelled: 'Отменён',
};

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
