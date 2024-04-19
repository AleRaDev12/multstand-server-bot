import { Ctx, On, Wizard, WizardStep } from 'nestjs-telegraf';
import { FinancialTransaction } from './financial-transaction.entity';
import { Inject } from '@nestjs/common';
import { CustomWizardContext } from '../../shared/interfaces';
import { WIZARDS } from '../../shared/wizards';
import { generateMessage, WizardStepType } from '../../helpers';
import { FinancialTransactionsService } from './financial-transactions.service';

const steps: WizardStepType[] = [
  { message: 'Дата транзакции:', field: 'transactionDate', type: 'date' },
  { message: 'Сумма:', field: 'amount', type: 'number' },
  { message: 'Тип транзакции:', field: 'transactionType', type: 'string' },
  { message: 'Описание:', field: 'description', type: 'string' },
];

function WizardStepHandler(stepIndex: number) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const stepIndexCorrected = stepIndex - 2;

    descriptor.value = async function (ctx: CustomWizardContext) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const msg = ctx.update?.message;
      const step = steps[stepIndexCorrected];

      if (!msg?.text) {
        return 'Некорректный ввод. Пожалуйста, введите значение еще раз.';
      }

      switch (step.type) {
        case 'number':
          const number = parseFloat(msg.text);
          if (!isNaN(number)) {
            ctx.wizard.state.financialTransaction[step.field] = number;
          } else {
            return 'Введите корректное числовое значение.';
          }
          break;
        case 'date':
          const date = Date.parse(msg.text);
          if (!isNaN(date)) {
            ctx.wizard.state.financialTransaction[step.field] = new Date(date);
          } else {
            return 'Введите корректную дату.';
          }
          break;
        default:
          ctx.wizard.state.financialTransaction[step.field] = msg.text;
          break;
      }

      if (stepIndexCorrected === steps.length - 1) {
        const financialTransaction =
          await this.financialTransactionsService.create(
            ctx.wizard.state.financialTransaction,
          );
        await ctx.scene.leave();
        return `Финансовая транзакция ${JSON.stringify(financialTransaction, null, 2)} добавлена.`;
      } else {
        ctx.wizard.next();
        return generateMessage(steps[stepIndexCorrected + 1]);
      }
    };

    return descriptor;
  };
}

@Wizard(WIZARDS.ADD_FINANCIAL_TRANSACTION_WIZARD_ID)
export class FinancialTransactionsAddWizard {
  constructor(
    @Inject(FinancialTransactionsService)
    private readonly financialTransactionsService: FinancialTransactionsService,
  ) {}

  @WizardStep(1)
  async start(@Ctx() ctx: CustomWizardContext): Promise<string> {
    ctx.wizard.state.financialTransaction = new FinancialTransaction();
    ctx.wizard.next();
    return generateMessage(steps[0]);
  }

  @On('text')
  @WizardStep(2)
  @WizardStepHandler(2)
  async step2() {}

  @On('text')
  @WizardStep(3)
  @WizardStepHandler(3)
  async step3() {}

  @On('text')
  @WizardStep(4)
  @WizardStepHandler(4)
  async step4() {}

  @On('text')
  @WizardStep(5)
  @WizardStepHandler(5)
  async step5() {}
}
