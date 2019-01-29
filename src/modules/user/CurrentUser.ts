import { Resolver, Query, Ctx } from "type-graphql";

import { User } from "../../entities";

@Resolver(User)
export class CurrentUserResolver {
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() ctx: any): Promise<void | User> {
    if (ctx.session.userId) {
      const id = ctx.session.userId;
      return User.findOne({ where: { id } });
    }
  }
}
