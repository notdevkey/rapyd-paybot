import { Input } from '@/components';
import { usePocketbase } from '@/hooks';
import { yupResolver } from '@hookform/resolvers/yup';
import { getRequestHeaders } from '@rapyd-paybot/rapyd';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
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
  // const rapydAxios = useRapydAxios();
  const pocketbase = usePocketbase();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: yupResolver(schema) });

  const registerMutation = useMutation(
    ['wallet'],
    async (data: RegisterFormData) => {
      const requestData = {
        ewallet_reference_id: data.discordTag,
      };
      const headers = getRequestHeaders(
        'post',
        '/user',
        requestData,
        process.env.NEXT_PUBLIC_SECRET_KEY,
        process.env.NEXT_PUBLIC_ACCESS_KEY
      );
      const { data: rapydData } = await axios.post(
        `https://sandboxapi.rapyd.net/v1/user`,
        requestData,
        { headers }
      );
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
