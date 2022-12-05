import { Input } from '@/components';
import { usePocketbase, useRapydAxios } from '@/hooks';
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
  const rapydAxios = useRapydAxios();
  const pocketbase = usePocketbase();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: yupResolver(schema) });

  const registerMutation = useMutation(
    ['wallet'],
    async (data: RegisterFormData) => {
      const { data: rapydData } = await rapydAxios.post(`/user`, {
        ewallet_reference_id: data.discordTag,
      });
      console.log(rapydData);

      const res = await pocketbase.collection('users').create({
        email: data.email,
        username: data.discordTag,
        password: data.password,
        passwordConfirm: data.password,
      });
      // const res = await pocketbase.collection('wallets').getList(1, 10);
      console.log(res);
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
        {...register('discordTag')}
        placeholder="Discord tag"
        error={!!errors.discordTag}
        helperText={errors.email ? errors.discordTag?.message : ''}
      />
      <Input
        {...register('password')}
        placeholder="Password"
        error={!!errors.password}
        type="password"
        helperText={errors.password ? errors.password?.message : ''}
      />
      <button>Register</button>
    </form>
  );
}
