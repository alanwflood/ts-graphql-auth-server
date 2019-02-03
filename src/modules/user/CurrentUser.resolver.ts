import { Resolver, Query, Ctx } from "type-graphql";

import { User } from "../../entities";
import { getCurrentUser } from "./currentUser/getCurrentUser";

@Resolver(User)
export class CurrentUserResolver {
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() ctx: any): Promise<void | User> {
    return getCurrentUser(ctx.session.userId);
  }
}
