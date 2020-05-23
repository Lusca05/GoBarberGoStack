import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Appointment from '../infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '../repositories/IAppointmentsRepository';
/**
 * Anotaçoes: DTO(data transfer object)
 *
 * Recebimento das infomaçoes
 * Tratativa de erros e excessoes
 * Acesso ao repositorio
 */

interface IRequest {
  provider_id: string;
  date: Date;
}
/**
 * SOLID
 *
 * Single Responsability Principle
 * Dependency Invertion Principle
 *
 *
 *
 * Dependency Inversion
 */
@injectable()
class CreateAppointmentService {
  // apenas um metodo em cada service, pode ser chamado de varias formas (execute, run, etc)
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({ date, provider_id }: IRequest): Promise<Appointment> {
    const appointmentDate = startOfHour(date);

    const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
      appointmentDate,
    );

    if (findAppointmentInSameDate) {
      throw new AppError('This appointment is already booked');
    }

    const appointment = await this.appointmentsRepository.create({
      provider_id,
      date: appointmentDate,
    });

    return appointment;
  }
}

export default CreateAppointmentService;
