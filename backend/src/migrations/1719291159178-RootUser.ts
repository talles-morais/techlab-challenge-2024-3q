import { MigrationInterface, QueryRunner } from "typeorm";
import { User } from "../entities/User.js";
import bcrypt from "bcrypt";

export class RootUser1719291159178 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('root', saltRounds);

    await queryRunner.manager.insert(User, {
      email: "root@root.com",
      username: "root",
      password: hashedPassword,
      profile: "sudo",
    });
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete(User, {
      email: "root@root.com",
    });
  }
}
