import { Command } from '../interfaces/Command';
import { hello } from './hello';
import { requestPayment } from './requestPayment';

export const CommandList: Command[] = [requestPayment, hello];
