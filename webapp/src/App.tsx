import { useState, useEffect } from 'react'
import { getLinks, getShortCode } from './mocks/links';
// import type { Link } from './model/link';
import Links from './components/Links';
import './App.css'


function App() {

  const [inputUrl, setInputUrl] = useState(""); // Для хранения введенного URL
  const [shortCode, setShortCode] = useState(""); // Для хранения результата
  const [isCopied, setIsCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    if (!inputUrl) return; 
    try {
      const code = await getShortCode(inputUrl); // API-запрос на получение короткой сссылки
      setShortCode(code);
      console.log("Введенный код: ",inputUrl);
      console.log("Сокращенный код: ", code);  
      setIsCopied(false);   
    } catch (error) {
      console.error("Ошибка:", error);
    } 
  };

  // Функция для копирования в буфер обмена
  const copyToClipboard = () => {
    if (!shortCode) return;
    navigator.clipboard.writeText(`${window.location.origin}/${shortCode}`)
    setIsCopied(true);
  };
    
  return (

    <main> 
       <form  onSubmit={handleSubmit} >
        {/* пока валидации нет */}
        <input  value={inputUrl} onChange={(e) => setInputUrl(e.target.value)} placeholder="Введите URL" type="text"  /> 
          <button type="submit" > Сократить </button>
      </form>
       <input
          type="text" value={`${shortCode}`} placeholder="Ваш короткий URL" readOnly />
        <button onClick={copyToClipboard} type="button" >  {isCopied ? 'Скопировано!' : 'Копировать'} </button>
        <Links />
    </main>
 
  );
}

export default App
