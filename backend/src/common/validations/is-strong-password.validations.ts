import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsStrongPassword(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          // Password strength(min 8 character long, 1 Uppercase, 1 Lowercase, special character, Number)
          const passwordRegex = new RegExp(
            '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})',
          );
          return passwordRegex.test(value);
        },
        defaultMessage(): string {
          return 'Password is not strong enough. It should contain at least 8 characters, 1 uppercase, 1 lowercase, 1 special character, and 1 number.';
        },
      },
    });
  };
}
