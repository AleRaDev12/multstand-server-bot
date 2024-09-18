/**
 * This is a simple solution to handle the "Error code 429, Error: Too many requests" problem.
 * Currently, we delay sending any message by a fixed amount of time.
 *
 * Future improvement:
 * Instead of delaying every message, we could store the timestamp of the last sent message.
 * Then, only delay the next message if it's being sent too soon after the previous one.
 * If enough time has passed, the message would be sent immediately without any delay.
 *
 * This approach would be more efficient and would allow for bursts of messages
 * when there hasn't been any recent activity, while still preventing rate limit errors.
 */

import { Scenes, Telegram } from 'telegraf';
import { Message } from 'telegraf/typings/core/types/typegram';
import ApiClient from 'telegraf/typings/core/network/client';
import { Tail } from 'rxjs';

const RATE_LIMIT = 10; // messages per second
const DELAY = 1000 / RATE_LIMIT; // delay in milliseconds
const MAX_MESSAGE_LENGTH = 4096;
const MESSAGES_DIVIDER =
  '\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n\n';

type Shorthand<FName extends Exclude<keyof Telegram, keyof ApiClient>> = Tail<
  Parameters<Telegram[FName]>
>;

type SendMessageArgs = Shorthand<'sendMessage'>;

export async function sendMessage(
  ctx: Scenes.SceneContext,
  ...args: SendMessageArgs
): Promise<Message.TextMessage> {
  await delay(DELAY);
  return ctx.reply(...args);
}

export async function sendMessages(
  ctx: Scenes.SceneContext,
  messages: string[],
): Promise<void> {
  let currentMessage = '';

  for (const message of messages) {
    if (canAddMessageToCurrentBatch(currentMessage, message)) {
      currentMessage = addMessageToBatch(currentMessage, message);
    } else {
      await sendCurrentBatchAndResetIfNeeded(ctx, currentMessage);
      currentMessage = await handleLongMessage(ctx, message);
    }
  }

  await sendCurrentBatchAndResetIfNeeded(ctx, currentMessage);
}

function canAddMessageToCurrentBatch(
  currentMessage: string,
  newMessage: string,
): boolean {
  return (
    currentMessage.length + newMessage.length + MESSAGES_DIVIDER.length <=
    MAX_MESSAGE_LENGTH
  );
}

function addMessageToBatch(currentMessage: string, newMessage: string): string {
  return currentMessage + (currentMessage ? MESSAGES_DIVIDER : '') + newMessage;
}

async function sendCurrentBatchAndResetIfNeeded(
  ctx: Scenes.SceneContext,
  currentMessage: string,
): Promise<void> {
  if (currentMessage) {
    await sendMessage(ctx, currentMessage);
  }
}

async function handleLongMessage(
  ctx: Scenes.SceneContext,
  message: string,
): Promise<string> {
  if (message.length > MAX_MESSAGE_LENGTH) {
    const chunks = splitLongMessage(message);
    for (const chunk of chunks) {
      await sendMessage(ctx, chunk);
    }
    return '';
  }
  return message;
}

function splitLongMessage(message: string): string[] {
  const words = message.split(' ');
  return words.reduce((chunks: string[], word: string) => {
    const currentChunk = chunks[chunks.length - 1] || '';
    if (currentChunk.length + word.length + 1 <= MAX_MESSAGE_LENGTH) {
      chunks[chunks.length - 1] =
        (currentChunk ? currentChunk + ' ' : '') + word;
    } else {
      chunks.push(word);
    }
    return chunks;
  }, []);
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
