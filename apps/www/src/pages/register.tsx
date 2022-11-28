import { Input } from '@/components';
import { useRapydAxios } from '@/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const schema = yup.object().shape({
  discordTag: yup.string().required().min(5).max(50),
  email: yup.string().email().required(),
  password: yup.string().required().min(6).max(50),
});

interface RegisterFormData {
  discordTag: string;
  email: string;
  password: string;
}

export default function Register() {
  const axios = useRapydAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: yupResolver(schema) });

  const registerMutation = useMutation(
    ['wallet'],
    async (data: RegisterFormData) => {
      // TODO: send wallet register data
      const res = await axios.post(`${process.env.BASE_URI}`, {});
    }
  );

  const onRegister = useCallback(
    (data: RegisterFormData) => {
      registerMutation.mutate(data);
    },
    [registerMutation]
  );

  return (
    <form onSubmit={handleSubmit(onRegister)}>
      <Input
        {...register('email')}
        placeholder="Email"
        error={!!errors.email}
        helperText={errors.email ? errors.email?.message : ''}
      />
      <Input
        {...register('email')}
        placeholder="Email"
        error={!!errors.email}
        helperText={errors.email ? errors.email?.message : ''}
      />
    </form>
  );
}
