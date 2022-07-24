import Permission from "@modules/Permission/Permission.model";
import Role from "@modules/Role/Role.model";
import BaseEntity from "@modules/BaseEntity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from "typeorm";

@Entity("users")
class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ select: false })
  password_hash: string;

  @Column({ nullable: true, select: false })
  password_reset_token: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToMany(() => Role)
  @JoinTable({
    name: "user_roles",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "role_id" }],
  })
  roles: Role[];

  @ManyToMany(() => Permission)
  @JoinTable({
    name: "user_permissions",
    joinColumns: [{ name: "user_id" }],
    inverseJoinColumns: [{ name: "permission_id" }],
  })
  permissions: Permission[];
}

export default User;
