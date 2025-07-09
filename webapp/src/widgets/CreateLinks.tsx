import { useState } from 'react'
import { getShortCode } from '../features/links';
import { Form, Button, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { urlSchema } from '../shared/validationSchemas';
import * as yup from 'yup';
import '../App.css'


const CreateLinks = () => {

    type FormData = yup.InferType<typeof urlSchema>;
    const [shortCode, setShortCode] = useState(""); // Для хранения результата
    const [isCopied, setIsCopied] = useState(false);

      const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: yupResolver(urlSchema),
        mode: 'onChange'
    });

    const onSubmit = async (data: FormData) => {
    try {
        const code = await getShortCode(data.url); // API-запрос на получение короткой сссылки
        setShortCode(code);      
        setIsCopied(false);
    } catch (error) {
        console.error("Ошибка:", error);
    } 
    };

    // Функция для копирования в буфер обмена
    const copyToClipboard = () => {
        if (!shortCode) return;
        navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`)
        .then(() => {
            setIsCopied(true);
        });
    };

    return (
    <>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 8 }}>Введите URL</div>
        <div style={{ display:'flex', gap: 20 }}>
        <Form.Item validateStatus={errors.url ? 'error' : ''} help={errors.url?.message}>
            <Controller
            name="url"
            control={control}
            render={({ field }) => (
                <Input style={{ width: 350 }} {...field} placeholder="https://example.com" showCount maxLength={30} /> 
                )}
            />
        </Form.Item>
        <Button  type="primary"  htmlType="submit" disabled={!!errors.url}> Сократить </Button>
        </div>
      </Form>
      {shortCode && (
        <div style={{ marginTop: 10 , display:'flex', gap: 20}}>
          <Input 
            value={`${window.location.origin}/${shortCode}`}
            readOnly
            style={{ marginBottom: 8, width: 350 }}
          />
          <Button onClick={copyToClipboard} type={isCopied ? 'default' : 'primary'} >
            {isCopied ? 'Скопировано!' : 'Копировать'}
          </Button>
        </div>
      )}
    </>
  );
    
}

export default  CreateLinks;
