import { Injectable } from '@nestjs/common';
import { CreateExampleDto } from './dto/create-example.dto';
import { UpdateExampleDto } from './dto/update-example.dto';

import { InjectQueue } from '@nestjs/bull/dist/decorators';
import { Queue } from 'bull';
import { Sojebvar } from 'src/common/lib/Sojebvar/Sojebvar';
@Injectable()
export class ExampleService {
  constructor(@InjectQueue('message-queue') private queue: Queue) {}
  create(createExampleDto: CreateExampleDto) {
    return 'This action adds a new example';
  }

  async findAll() {
    // add queue example
    const job = await this.queue.add('sendMessage', {
      message: 'hello sojeb',
    });

    // end testing
    const text = 'my name is ${name} and I am ${age} years old';
    Sojebvar.addVariable({
      name: 'sojeb',
      age: 20,
    });
    const data = Sojebvar.parse(text);
    return { test: data };
  }

  findOne(id: number) {
    return `This action returns a #${id} example`;
  }

  update(id: number, updateExampleDto: UpdateExampleDto) {
    return `This action updates a #${id} example`;
  }

  remove(id: number) {
    return `This action removes a #${id} example`;
  }
}
