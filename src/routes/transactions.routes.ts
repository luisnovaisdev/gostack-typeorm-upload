import { Router } from 'express';
import multer from 'multer';
import { getCustomRepository } from 'typeorm';
import multerConfig from '../config/upload';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import Transaction from '../models/Transaction';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();
const upload = multer(multerConfig);

transactionsRouter.get('/', async (request, response) => {
  // TODO
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const balance = await transactionsRepository.getBalance();

  const transactions = await transactionsRepository.find({
    relations: ['category'],
  });

  const formatedTransactions = transactions.map((transaction: Transaction) => {
    const formatedTransaction = transaction;
    delete formatedTransaction.category_id;
    delete formatedTransaction.created_at;
    delete formatedTransaction.updated_at;
    delete formatedTransaction.category.created_at;
    delete formatedTransaction.category.updated_at;

    return transaction;
  });

  return response.json({ transactions: formatedTransactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const transactionsService = new CreateTransactionService();

  const transaction = await transactionsService.execute({
    transitionTitle: title,
    value,
    type,
    categoryTitle: category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();

  await deleteTransaction.execute({ id });

  return response.status(204).send();
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute({
      filePath: request.file.path,
    });

    return response.json(transactions);
  },
);

export default transactionsRouter;
