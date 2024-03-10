import { Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { ADD_ORDER_SCENE_ID } from '../shared/constants';

@Scene(ADD_ORDER_SCENE_ID)
export class AddOrderScene {
  @SceneEnter()
  onSceneEnter(): string {
    return 'Введите сумму заказа:';
  }

  @SceneLeave()
  onSceneLeave(): string {
    return 'Процесс добавления заказа отменен.';
  }
}
