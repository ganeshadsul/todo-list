import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ListDocument = HydratedDocument<List>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class List {
  @Prop({
    required: [true, 'Title is requried'],
    trim: true,
    minLength: [3, 'Title should must have atleast 3 characters.'],
  })
  title: string;

  @Prop({
    required: [true, 'Description is requried'],
    trim: true,
    minLength: [100, 'Description should must have atleast 3 characters'],
  })
  description: string;

  @Prop({
    default: false,
  })
  isImportant: boolean;

  @Prop({
    default: 0,
  })
  isCompleted: number;

  @Prop({
    required: [true, 'User id is required.'],
    type: Types.ObjectId,
    ref: 'User',
  })
  createdBy: Types.ObjectId;

  @Prop({
    required: [true, 'User id is required.'],
    type: Types.ObjectId,
    ref: 'User',
  })
  updatedBy: Types.ObjectId;

  @Prop({
    default: null,
  })
  deletedAt: Date;
}

export const ListSchema = SchemaFactory.createForClass(List);
