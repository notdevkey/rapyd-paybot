import { Command } from '../interfaces/Command';
import { hello } from './hello';
import { requestPayment } from './requestPayment';
import { registerAccount } from './registerAccount';
import { respondPayment } from './respondPayment';

export const CommandList: Command[] = [requestPayment, hello, registerAccount, respondPayment];
