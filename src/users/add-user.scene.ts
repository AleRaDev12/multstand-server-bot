import { Scene, SceneEnter, SceneLeave } from 'nestjs-telegraf';
import { ADD_USER_SCENE_ID } from '../shared/constants';

@Scene(ADD_USER_SCENE_ID)
export class AddUserScene {
  @SceneEnter()
  onSceneEnter(): string {
    return 'Введите номер телефона:';
  }

  @SceneLeave()
  onSceneLeave(): string {
    return 'Процесс добавления пользователя отменен.';
  }
}
