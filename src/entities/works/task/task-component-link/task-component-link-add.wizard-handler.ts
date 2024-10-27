import { TaskComponentLinkAddWizard } from './task-component-link-add.wizard';
import { Task } from '../task.entity';
import { Component } from '../../../parts/component/component.entity';
import { CustomWizardContext, WizardStepType } from '../../../../shared/types';
import { wizardStepHandler } from '../../../../bot/wizard-step-handler/wizardStepHandler';
import { sendMessage } from '../../../../shared/sendMessages';
import { replyWithCancelButton } from '../../../../bot/wizard-step-handler/utils';
import { getMessage } from '../../../../shared/helpers';

interface TaskComponentState {
  selectedTask: Task | null;
  selectedComponents: Component[];
}

const steps: WizardStepType[] = [
  { message: 'Выберите задачу:', type: 'taskSelect' },
  { message: 'Выберите компоненты (через запятую):', type: 'componentSelect' },
];

export const TaskComponentLinkAddWizardHandler =
  wizardStepHandler<TaskComponentState>({
    initState: () => ({
      selectedTask: null,
      selectedComponents: [],
    }),

    save: async function (this: TaskComponentLinkAddWizard, state) {
      const task = state.selectedTask;
      task.components = state.selectedComponents;
      await this.taskService.updateComponents(task);
    },

    print: async (ctx, state) => {
      const componentNames = state.selectedComponents
        .map((c) => c.name)
        .join(', ');
      await sendMessage(
        ctx,
        `Задача "${state.selectedTask.shownName}" связана с компонентами: ${componentNames}`,
      );
    },

    initialSteps: steps,

    async handleSpecificAnswer(
      this: TaskComponentLinkAddWizard,
      ctx: CustomWizardContext,
      stepAnswer: WizardStepType,
      state: TaskComponentState,
    ): Promise<boolean> {
      switch (stepAnswer.type) {
        case 'taskSelect':
          return handleTaskSelect.call(this, ctx, state);
        case 'componentSelect':
          return handleComponentSelect.call(this, ctx, state);
        default:
          return true;
      }
    },

    async handleSpecificRequest(
      this: TaskComponentLinkAddWizard,
      ctx: CustomWizardContext,
      stepRequest: WizardStepType,
    ): Promise<boolean> {
      switch (stepRequest.type) {
        case 'taskSelect':
          const tasksList = await this.taskService.getFormattedList(
            ctx.session.userRole,
          );
          await replyWithCancelButton(
            ctx,
            `${stepRequest.message}\n${tasksList}`,
          );
          return true;

        case 'componentSelect':
          console.log(
            '*-* componentSelect ctx.session.userRole',
            ctx.session.userRole,
          );
          const components = await this.componentService.findAll();
          await replyWithCancelButton(
            ctx,
            `${stepRequest.message}\n${components.map((component, index) => `№${index + 1}. ${component.format(ctx.session.userRole, 'line')}`).join('\n')}`,
          );
          return true;

        default:
          return true;
      }
    },
  });

async function handleTaskSelect(
  this: TaskComponentLinkAddWizard,
  ctx: CustomWizardContext,
  state: TaskComponentState,
): Promise<boolean> {
  const message = getMessage(ctx);
  const selectedNumber = parseInt(message.text);

  const tasks = await this.taskService.findAll();
  const task = tasks[selectedNumber - 1];

  if (!task) {
    await replyWithCancelButton(ctx, 'Задача не найдена. Выберите из списка.');
    return false;
  }

  state.selectedTask = task;
  return true;
}

async function handleComponentSelect(
  this: TaskComponentLinkAddWizard,
  ctx: CustomWizardContext,
  state: TaskComponentState,
): Promise<boolean> {
  const message = getMessage(ctx);
  const selectedNumbers = message.text
    .split(',')
    .map((num) => parseInt(num.trim()))
    .filter((num) => !isNaN(num));

  if (selectedNumbers.length === 0) {
    await replyWithCancelButton(
      ctx,
      'Пожалуйста, введите номера компонентов через запятую.',
    );
    return false;
  }

  const components = await this.componentService.findAll();
  const selectedComponents = selectedNumbers
    .map((num) => components[num - 1])
    .filter(Boolean);

  if (selectedComponents.length === 0) {
    await replyWithCancelButton(
      ctx,
      'Ни один из выбранных компонентов не найден.',
    );
    return false;
  }

  state.selectedComponents = selectedComponents;
  return true;
}
