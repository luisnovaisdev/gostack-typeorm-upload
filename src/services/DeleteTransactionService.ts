import { getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    // TODO
    const transactionsRepository = getRepository(Transaction);

    const checkIfTransactionExist = await transactionsRepository.findOne(id);

    if (!checkIfTransactionExist) {
      throw new AppError('Transaction does not exist', 404);
    }

    await transactionsRepository.delete(id);
  }
}

export default DeleteTransactionService;
