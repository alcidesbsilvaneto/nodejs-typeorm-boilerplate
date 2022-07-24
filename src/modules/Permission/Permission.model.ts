import BaseEntity from "@modules/BaseEntity";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("permissions")
class Permission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;
}

export default Permission;
