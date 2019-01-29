import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { User } from "../../../entities/user";

// Ensure email is not already in use
@ValidatorConstraint({ async: true })
export class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({ where: { email } }).then(user => {
      return user ? false : true;
    });
  }
}

export function IsEmailUnique(ValidatorOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: ValidatorOptions,
      constraints: [],
      validator: IsEmailUniqueConstraint
    });
  };
}
