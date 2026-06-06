import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService.js';

export const useLogin = () => useMutation({ mutationFn: authService.login });
export const useRegister = () => useMutation({ mutationFn: authService.register });
export const useForgotPassword = () => useMutation({ mutationFn: authService.forgotPassword });
