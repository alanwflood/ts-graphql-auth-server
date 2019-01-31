import { Resolver, Query, Ctx } from "type-graphql";

import { User } from "../../entities";

@Resolver(User)
export class CurrentUserResolver {
  @Query(() => User, { nullable: true })
  async currentUser(@Ctx() ctx: any): Promise<void | User> {
    return getCurrentUser(ctx.session.userId);
  }
}

export async function getCurrentUser(id: number): Promise<void | User> {
  try {
    if (!id) throw new Error("User not logged in");
    const user = await User.findOne(id);
    if (!user) throw new Error("User not found in database");
    return user;
  } catch (err) {
    return err;
  }
}
