import { Exclude, Expose } from 'class-transformer';

@Exclude() //derste kullanmamıştık ama çok fazla alan olunca tek tek dersteki gibi yapmak zor olabilir ileride
export class UserResponseDto {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  birthdate: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
