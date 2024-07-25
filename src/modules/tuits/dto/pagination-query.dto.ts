import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsNumber()
  @Type(() => Number)
  @IsPositive()
  @IsOptional()
  offset: number;
}
