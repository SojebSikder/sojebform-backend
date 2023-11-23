import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CheckAbilities } from 'src/providers/ability/abilities.decorator';
import { AbilitiesGuard } from 'src/providers/ability/abilities.guard';
import { Action } from 'src/providers/ability/ability.factory';
import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
import { UpdateCheckoutDto } from './dto/update-checkout.dto';

@ApiBearerAuth()
@ApiTags('Checkout')
@UseGuards(JwtAuthGuard, AbilitiesGuard)
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @ApiOperation({ summary: 'Checkout' })
  @CheckAbilities({ action: Action.Create, subject: 'OrganizationBilling' })
  @Post()
  async create(
    @Req() req: Request,
    @Body() createCheckoutDto: CreateCheckoutDto,
  ) {
    const user = req.user;

    const checkout = await this.checkoutService.create(
      user.userId,
      createCheckoutDto,
    );

    if (checkout.error) {
      return checkout;
    }

    return {
      url: checkout.data,
    };
  }

  @Get()
  findAll() {
    return this.checkoutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.checkoutService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCheckoutDto: UpdateCheckoutDto,
  ) {
    return this.checkoutService.update(+id, updateCheckoutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.checkoutService.remove(+id);
  }
}
