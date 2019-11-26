import { handlers } from '../handlers';

export const router = {
  ping: handlers.ping,
  users: handlers.users,
  tokens: handlers.tokens,
  menus: handlers.menus,
};
