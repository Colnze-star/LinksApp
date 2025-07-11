import { useState } from 'react'
import { Form, Button, Input } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { urlSchema } from '../shared/validationSchemas';
import { api } from '../features/api';
import type { Link, FormUrl } from '../model/link';
import '../App.css'
  
const CreateLinks = () => {

  const [shortCode, setShortCode] = useState(""); 
  const [isCopied, setIsCopied] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
    } = useForm<FormUrl>({
        resolver: yupResolver(urlSchema),
        mode: 'onChange'
    });

   const onSubmit = async (data: FormUrl) => {
   try {
        const response = await api.post<Link>('/links', { 
        originalUrl: data.url 
      });
    
    if (response.data.shortCode) {
      setShortCode(response.data.shortCode);
      console.log("Короткий код:", response.data.shortCode);
    
      const fullShortUrl = `http://localhost:8080/${response.data.shortCode}`;
      console.log("Полная короткая ссылка:", fullShortUrl);
    } else {
      throw new Error("Сервер не вернул shortCode");
    }
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
    <main className='main'>
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <div style={{ marginBottom: 8 }}>Введите URL</div>
        <div style={{ display:'flex', gap: 20 }}>
        <Form.Item validateStatus={errors.url ? 'error' : ''} help={errors.url?.message}>
            <Controller
            name="url"
            control={control}
            render={({ field }) => (
                <Input style={{ width: 500 }} {...field} placeholder="https://example.com" showCount maxLength={2048} /> 
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
            style={{ marginBottom: 8, width: 500 }}
          />
          <Button onClick={copyToClipboard} type={isCopied ? 'default' : 'primary'} >
            {isCopied ? 'Скопировано!' : 'Копировать'}
          </Button>
        </div>
      )}
    </main>
  );
      
}

export default  CreateLinks;
