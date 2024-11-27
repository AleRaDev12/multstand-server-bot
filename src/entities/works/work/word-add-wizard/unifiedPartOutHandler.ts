import { WizardStepCustomHandlerType } from '../../../../bot/wizard-step-handler-new';
import { sendMessages } from '../../../../shared/sendMessages';
import { replyWithCancelButton } from '../../../../bot/wizard-step-handler/utils';
import {
  getFieldValue,
  setFieldValue,
} from '../../../../bot/wizard-step-handler-new/wizard-handler';
import { z } from 'zod';
import { CurrentWizard, CurrentWizardContext } from './types';
import { Task } from '../../task/task.entity';
import {
  formatWithListIndexes,
  getMessageText,
} from '../../../../shared/helpers';
import { Component } from '../../../parts/component/component.entity';

// Represents a parsed component selection with its count
type ComponentSelection = {
  index: number;
  count: number;
};

export async function unifiedPartOutHandler(
  wizard: CurrentWizard,
  ctx: CurrentWizardContext,
  type: WizardStepCustomHandlerType,
) {
  if (type === 'request') {
    const linkedComponents = await getTaskLinkedComponents(ctx);

    if (!linkedComponents?.length) {
      await ctx.reply('Ошибка. Связанные компоненты не найдены.');
      return true;
    }

    const formattedComponents = linkedComponents.map((component) =>
      component.format(ctx.session.userRole, 'line'),
    );

    await sendMessages(
      ctx,
      formatWithListIndexes(formattedComponents),
      'nothing',
    );
    return true;
  }

  const message = getMessageText(ctx);

  // Parse the input into component selections
  let selections: ComponentSelection[];
  try {
    selections = parseComponentSelections(message);
  } catch (error) {
    await replyWithCancelButton(
      ctx,
      `Ошибка формата: ${error.message}\nИспользуйте формат: [номер]-[количество], [номер]-[количество]`,
    );
    return false;
  }

  // Get the available components
  const linkedComponents = await getTaskLinkedComponents(ctx);
  if (!linkedComponents?.length) {
    await ctx.reply('Ошибка. Связанные компоненты не найдены.');
    return false;
  }

  // Validate component selections and check stock
  try {
    await validateComponentSelections(selections, linkedComponents, wizard);
  } catch (error) {
    await replyWithCancelButton(ctx, error.message);
    return false;
  }

  // Store the selections in the wizard state
  const componentSelections = selections.map((selection) => ({
    component: linkedComponents[selection.index - 1],
    count: selection.count,
  }));

  setFieldValue(ctx, 'componentSelections', componentSelections);

  return true;
}

function parseComponentSelections(input: string): ComponentSelection[] {
  // Remove spaces and optional commas from start/end
  const cleanInput = input.trim().replace(/^,|,$/g, '');

  // Split by commas and process each selection
  const selections = cleanInput.split(',').map((part) => {
    // Clean up extra spaces
    const trimmedPart = part.trim();

    // Match the pattern: number-number
    const match = trimmedPart.match(/^(\d+)\s*-\s*(\d+)$/);
    if (!match) {
      throw new Error(`Неверный формат "${trimmedPart}"`);
    }

    const [_, indexStr, countStr] = match;
    const index = parseInt(indexStr);
    const count = parseInt(countStr);

    if (index < 1) {
      throw new Error('Номер компонента должен быть больше 0');
    }
    if (count < 1) {
      throw new Error('Количество должно быть больше 0');
    }

    return { index, count };
  });

  // Check for duplicate component indices
  const indices = new Set(selections.map((s) => s.index));
  if (indices.size !== selections.length) {
    throw new Error('Обнаружены дублирующиеся номера компонентов');
  }

  return selections;
}

async function validateComponentSelections(
  selections: ComponentSelection[],
  components: Component[],
  wizard: CurrentWizard,
): Promise<void> {
  // Validate component indices
  for (const selection of selections) {
    if (selection.index > components.length) {
      throw new Error(`Компонент #${selection.index} не найден в списке`);
    }
  }

  // Check stock availability for each component
  for (const selection of selections) {
    const component = components[selection.index - 1];
    const remaining = await wizard.partsService.getTotalRemainingCount(
      component.id,
    );

    if (remaining.inStock < selection.count) {
      throw new Error(
        `Недостаточно компонентов "${component.name}". ` +
          `Запрошено: ${selection.count}, в наличии: ${remaining.inStock}`,
      );
    }
  }
}

async function getTaskLinkedComponents(
  ctx: CurrentWizardContext,
): Promise<Component[] | null> {
  const taskValue = getFieldValue(ctx, 'task');
  const result = z.instanceof(Task).safeParse(taskValue);
  if (!result.success) {
    await ctx.reply('Ошибка при получении задачи.');
    return null;
  }
  const task = result.data;
  return task.components;
}
