import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CheckAbilities } from '../../../../providers/ability/abilities.decorator';
import { AbilitiesGuard } from '../../../../providers/ability/abilities.guard';
import { Action } from '../../../../providers/ability/ability.factory';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { StripeMethod } from '../../../../common/lib/Payment/stripe/Stripe';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';

@ApiBearerAuth()
@ApiTags('billing')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @ApiOperation({ summary: 'Manage billing' })
  @ApiResponse({ description: 'returns stripe billing session url' })
  @CheckAbilities({ action: Action.Create, subject: 'OrganizationBilling' })
  @Post('billing')
  async create(@Body() createBillingDto: CreateBillingDto) {
    const customer = createBillingDto.customer;
    const session = await StripeMethod.createBillingSession(customer);

    return {
      url: session.url,
    };
  }

  @Get()
  findAll() {
    return this.billingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.billingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBillingDto: UpdateBillingDto) {
    return this.billingService.update(+id, updateBillingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.billingService.remove(+id);
  }
}
