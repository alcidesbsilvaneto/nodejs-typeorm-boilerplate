import { EntitySubscriberInterface, EventSubscriber, InsertEvent } from "typeorm";
import UserHelper from "./User.helper";
import User from "./User.model";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo() {
    return User;
  }

  async beforeInsert(event: InsertEvent<User>) {
    const user = event.entity;
    await UserHelper.checkEmailAndGeneratePassword(user);
  }
}
