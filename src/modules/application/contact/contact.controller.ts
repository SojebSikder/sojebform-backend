import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Contact')
@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @ApiOperation({ summary: 'Create contact' })
  @Post()
  async create(@Body() createContactDto: CreateContactDto) {
    try {
      const contact = await this.contactService.create(createContactDto);
      return contact;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }

  // temp, remove later

  @Post('create-stripe-customer')
  async createStripeCustomer(@Body() body: { email: string }) {
    const result = await this.contactService.createStripeCustomer(body.email);
    return result;
  }

  @Post('create-onboarding-link')
  async createOnboardingLink(@Body() body: { account_id: string }) {
    const result = await this.contactService.createOnBordingLink(body.account_id);
    return result;
  }

  @Post('create-payout')
  async createPayout(
    @Body() body: { account_id: string; amount: number; currency: string },
  ) {
    try {
      const result = await this.contactService.createPayout(
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
}
