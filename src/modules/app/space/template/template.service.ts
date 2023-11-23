import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { WhatsAppClient } from 'src/common/lib/whatsapp/client/WhatsAppClient';
import { WorkspaceChannelRepository } from 'src/common/repository/workspace-channel/workspace-channel.repository';
import { PrismaService } from '../../../../providers/prisma/prisma.service';
import { CreateTemplateDto } from './dto/create-template.dto';
import { UpdateTemplateDto } from './dto/update-template.dto';

@Injectable()
export class TemplateService extends PrismaClient {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(
    { user_id, workspace_id, workspace_channel_id },
    createTemplateDto: CreateTemplateDto,
  ) {
    workspace_channel_id = Number(workspace_channel_id);
    workspace_id = Number(workspace_id);
    const name = createTemplateDto.name;
    const components = createTemplateDto.components;
    const category = createTemplateDto.category;
    const language = createTemplateDto.language;

    // get tenant id
    // const tenant_id = await UserRepository.getTenantId(user_id);

    // get workspace channel details
    const channelDetails = await WorkspaceChannelRepository.getDetails({
      id: workspace_channel_id,
      user_id: user_id,
      workspace_id: workspace_id,
    });

    // create whatsapp template
    const whatsappClient = new WhatsAppClient({
      token: channelDetails.access_token,
      phoneNumberId: channelDetails.phone_number_id,
      accountId: channelDetails.account_id,
    });

    // call whatsapp api
    const createMessageTemplate = await whatsappClient.createMessageTemplate({
      category: category,
      components: components,
      name: name,
      language: language,
    });

    return createMessageTemplate;
  }

  async findAll({ user_id, workspace_id, workspace_channel_id }) {
    workspace_channel_id = Number(workspace_channel_id);
    workspace_id = Number(workspace_id);

    // get workspace channel details
    const channelDetails = await WorkspaceChannelRepository.getDetails({
      id: workspace_channel_id,
      user_id: user_id,
      workspace_id: workspace_id,
    });

    // create whatsapp template
    const whatsappClient = new WhatsAppClient({
      token: channelDetails.access_token,
      phoneNumberId: channelDetails.phone_number_id,
      accountId: channelDetails.account_id,
    });

    // call whatsapp api
    const createMessageTemplate = await whatsappClient.getMessageTemplates();

    return createMessageTemplate;
  }

  async findOne(id: number, { user_id, workspace_id, workspace_channel_id }) {
    workspace_channel_id = Number(workspace_channel_id);
    workspace_id = Number(workspace_id);

    // get workspace channel details
    const channelDetails = await WorkspaceChannelRepository.getDetails({
      id: workspace_channel_id,
      user_id: user_id,
      workspace_id: workspace_id,
    });

    // create whatsapp template
    const whatsappClient = new WhatsAppClient({
      token: channelDetails.access_token,
      phoneNumberId: channelDetails.phone_number_id,
      accountId: channelDetails.account_id,
    });

    // call whatsapp api
    const findMessageTemplate = await whatsappClient.getMessageTemplates();

    return findMessageTemplate;
  }

  update(id: number, updateTemplateDto: UpdateTemplateDto) {
    return `This action updates a #${id} template`;
  }

  remove(id: number) {
    return `This action removes a #${id} template`;
  }
}
