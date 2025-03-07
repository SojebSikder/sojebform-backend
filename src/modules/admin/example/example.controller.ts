import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Admin/Example')
@Controller('admin/example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @ApiOperation({ summary: 'Test AI' })
  @Post('testai')
  async testai(@Body() body: { prompt: string }) {
    try {
      const result = await this.exampleService.testai(body.prompt);
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Create Stripe Customer' })
  @Post('create-stripe-customer')
  async createStripeCustomer(@Body() body: { email: string }) {
    const result = await this.exampleService.createStripeCustomer(body.email);
    return result;
  }

  @ApiOperation({ summary: 'Create Stripe Connected Account' })
  @Post('create-stripe-connected-account')
  async createStripeConnectedAccount(@Body() body: { email: string }) {
    const result = await this.exampleService.createStripeConnectedAccount(
      body.email,
    );
    return result;
  }
  @ApiOperation({ summary: 'Create Onboarding Link' })
  @Post('create-onboarding-link')
  async createOnboardingLink(@Body() body: { account_id: string }) {
    const result = await this.exampleService.createOnBordingLink(
      body.account_id,
    );
    return result;
  }

  @ApiOperation({ summary: 'Create Payout' })
  @Post('create-payout')
  async createPayout(
    @Body() body: { account_id: string; amount: number; currency: string },
  ) {
    try {
      const result = await this.exampleService.createPayout(
        body.account_id,
        body.amount,
        body.currency,
      );
      return result;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  @ApiOperation({ summary: 'Create Example' })
  @Post()
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }

  @ApiOperation({ summary: 'Find All Examples' })
  @Get()
  findAll() {
    return this.exampleService.findAll();
  }

  @ApiOperation({ summary: 'Find One Example' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update Example' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExampleDto: UpdateExampleDto) {
    return this.exampleService.update(+id, updateExampleDto);
  }

  @ApiOperation({ summary: 'Remove Example' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exampleService.remove(+id);
  }
}
