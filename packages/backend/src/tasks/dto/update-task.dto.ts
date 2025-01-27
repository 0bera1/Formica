import { IsString, IsOptional, IsEnum } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['in-progress', 'completed'])
  status?: string;
}
