import { IsNotEmpty,  IsUUID } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class VerifyUuid {
    @ApiModelProperty({
        description: 'uuid to verify user',
        format: 'uuid',
        uniqueItems: true,
      })
    @IsNotEmpty()
    @IsUUID()
    readonly verification: string;
}
