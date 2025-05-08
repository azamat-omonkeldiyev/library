import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, IsUUID, Max, Min, MinLength } from "class-validator";

export class CreateBookDto {
    @ApiProperty({example:"UFQ"})
    @IsString()
    @MinLength(2)
    title: string

    @ApiProperty({example: 1996})
    @IsNumber()
    @Max(2025)
    @Min(800)
    year: number

    @ApiProperty({example: 48000})
    @IsNumber()
    @Min(1000)
    price: number

    @ApiProperty({example: "UUID"})
    @IsUUID()
    authorId: string
}
