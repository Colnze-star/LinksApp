import * as yup from 'yup';

export const urlSchema = yup.object({
  url: yup
    .string()
    .required('Поле обязательно для заполнения')
    .url('Введите корректный URL (начинается с http:// или https://)')
    .max(2048, 'URL не должен превышать 2048 символов')
    .test(
      'no-spaces',
      'URL не должен содержать пробелов',
      value => !value?.includes(' ')
    )
});