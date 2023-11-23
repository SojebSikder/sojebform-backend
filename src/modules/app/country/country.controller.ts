import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountryService } from './country.service';

@ApiTags('country')
@Controller('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @ApiOperation({ summary: 'Get all countries' })
  @Get()
  async findAll() {
    const countries = await this.countryService.findAll();
    return {
      data: countries,
    };
  }
}
