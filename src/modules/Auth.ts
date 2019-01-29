import { AuthChecker } from "type-graphql";

const customAuthChecker: AuthChecker<boolean> = ({ context }: any) =>
  // roles: [string]
  {
    // here you can read user from context
    // and check his permission in db against `roles` argument
    // that comes from `@Authorized`, eg. ["ADMIN", "MODERATOR"]
    //
    return Boolean(context.session.userId);
  };
export default customAuthChecker;
