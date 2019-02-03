import { User } from "../../../entities";

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
