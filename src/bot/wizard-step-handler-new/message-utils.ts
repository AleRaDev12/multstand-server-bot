import { Message } from 'telegraf/typings/core/types/typegram';

export function getMessageText(message?: Message): string | undefined {
  console.log('*-* message', message);
  return message ? ('text' in message ? message.text : undefined) : undefined;
}
