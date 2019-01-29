import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from "typeorm";
import { ObjectType, Field, ID, Root, registerEnumType } from "type-graphql";

export enum UserRole {
  Admin = "admin",
  Moderator = "moderator",
  User = "user"
}

registerEnumType(UserRole, {
  name: "Role",
  description: "User's role, which dictates authorisation"
});

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column("text", { unique: true })
  email: string;

  @Field({ description: "First name and last name concatenated" })
  name(@Root() parent: User): string {
    return `${parent.firstName} ${parent.lastName}`;
  }

  @Column()
  password: string;

  @Field(() => UserRole)
  @Column("enum", { enum: UserRole, default: UserRole.User })
  role: UserRole;

  @Column("bool", { default: false })
  confirmed: boolean;

  @Column({ nullable: true, type: "timestamp" })
  confirmedAt: Date;
}
