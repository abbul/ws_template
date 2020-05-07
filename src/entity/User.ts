import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'
import { Length, IsDate, IsNotEmpty, IsOptional, IsBoolean, IsInt, Min, Max } from 'class-validator'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  @Length(2, 50)
  @IsNotEmpty()
  username!: string;

  @Column('varchar', { length: 50 })
  @Length(3, 49)
  firstName!: string;

  @Column('varchar', { length: 50 })
  @Length(3, 49)
  lastName!: string;

  @Column()
  @IsInt()
  @Min(18)
  @Max(99)
  age?: number;

  @Column('varchar', { length: 50, unique: true, nullable: true })
  @IsNotEmpty()
  email!: string;

  @Column('text')
  @Length(5, 600)
  @IsNotEmpty()
  password!: string;

  @Column({
    default: 'ROLE_USER'
  })
  role!: string;

  @Column({ type: 'timestamp', precision: 3, nullable: true })
  @IsDate()
  fechaCreacion?: Date;

  @Column({
    default: true
  })
  isStatus?: boolean;

  @Column({
    default: false
  })
  @IsBoolean()
  isDeleted?: boolean;

  @Column({ type: 'timestamp', precision: 3, nullable: true })
  @IsDate()
  @IsOptional()
  fechaModificacion?: Date;
}
