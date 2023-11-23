import { Injectable } from '@nestjs/common';
import { CreateDynamicVariableDto } from './dto/create-dynamic-variable.dto';
import { UpdateDynamicVariableDto } from './dto/update-dynamic-variable.dto';

@Injectable()
export class DynamicVariableService {
  create(createDynamicVariableDto: CreateDynamicVariableDto) {
    return 'This action adds a new dynamicVariable';
  }

  findAll() {
    const dynamicVariables = [
      // contact
      '${contact.name}',
      '${contact.fname}',
      '${contact.lname}',
      '${contact.email}',
      '${contact.phone_number}',
      '${contact.country}',
      // system
      '${system.current_datetime}',
      '${system.current_date}',
      '${system.current_time}',
    ];

    return dynamicVariables;
  }

  findOne(id: number) {
    return `This action returns a #${id} dynamicVariable`;
  }

  update(id: number, updateDynamicVariableDto: UpdateDynamicVariableDto) {
    return `This action updates a #${id} dynamicVariable`;
  }

  remove(id: number) {
    return `This action removes a #${id} dynamicVariable`;
  }
}
