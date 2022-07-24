import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

class BaseEntity {
  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @DeleteDateColumn({ select: false })
  deleted_at: Date;
}

export default BaseEntity;
