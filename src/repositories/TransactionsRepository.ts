import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const transactions = await this.find();
    const balance = transactions.reduce(
      function (total: Balance, currentValue) {
        const newBalance = total;
        if (currentValue.type === 'income') {
          newBalance.income += Number(currentValue.value);
        } else {
          newBalance.outcome += Number(currentValue.value);
        }
        newBalance.total = total.income - total.outcome;
        return newBalance;
      },
      { income: 0, outcome: 0, total: 0 },
    );

    return balance;
  }
}

export default TransactionsRepository;
