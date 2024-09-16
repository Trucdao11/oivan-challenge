import { CanActivateFn } from '@angular/router';

export const houseGuard: CanActivateFn = (route, state) => {
  const storedUserInfo = localStorage.getItem('userInfo');
  return   storedUserInfo ? true : false;;
};
