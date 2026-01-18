import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import validator from 'validator';

type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class User {
  @Prop({
    required: [true, 'First name is required'],
    trim: true,
    minLength: [3, 'First name should must contain atleast 3 characters.'],
  })
  firstName: string;

  @Prop({
    required: [true, 'Last name is required'],
    trim: true,
    minLength: [3, 'Last name should must contain atleast 3 characters.'],
  })
  lastName: string;

  @Prop({
    required: [true, 'Email is required.'],
    trim: true,
    unique: [true, 'Email is already taken.'],
    validate: [
      {
        validator: (value: string) => validator.isEmail(value),
        message: 'Enter valid email id.',
      },
    ],
  })
  email: string;

  @Prop({
    required: [true, 'Password is required.'],
    trim: true,
    minLength: [8, 'Password must be of atleast 8 characters.'],
    validate: [
      {
        validator: (value: string) =>
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
            value,
          ),
        message:
          'Passowrd must contail atleast one character, one number and one special character.',
      },
    ],
  })
  password: string;

  @Prop({
    required: [true, 'Confirm password is required.'],
    trim: true,
    minLength: [8, 'Password must be of atleast 8 characters.'],
    validate: [
      {
        validator: function (this: User, value) {
          return value === this.password;
        },
        message: 'Confirm password should be same as Passoword.',
      },
    ],
  })
  passwordConfirm?: string;

  @Prop({
    default: 1,
  })
  isActive: number;

  @Prop({
    default: null,
  })
  deletedAt: Date;
}
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function (this: UserDocument) {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
});
