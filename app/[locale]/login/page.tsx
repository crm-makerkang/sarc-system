'use client';
import { useTranslations } from 'next-intl';
//import { table_text_size } from "@/Settings/settings"
import { Loader2, Settings } from "lucide-react"
import * as React from "react"
import { useEffect } from 'react';
import axios from "axios";

import { Button } from "@/components/ui/button"
// toast not working here, don't know why: import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Index() {
  const t = useTranslations('sarc');
  // toast not working here, don't know why: const { toast } = useToast();

  const [user, setUser] = React.useState({
    name: "",
    password: "",

  })
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [logining, setLogining] = React.useState(false);

  const [settings, setSettings] = React.useState({
    table_text_size: "",
    rows_per_page: "",
  })


  useEffect(() => {
    const getSettings = async () => {
      const res = await axios.get('/api/settings/')
      console.log(res.data);
      setSettings({
        table_text_size: JSON.parse(res.data.message).table_text_size,
        rows_per_page: JSON.parse(res.data.message).rows_per_page
      })

    }

    getSettings();

  }, [])

  const login = async () => {
    setLogining(true);
    setUser(user);
    const res = await axios.post('/api/login/',
      {
        username: user.name,
        password: user.password
      })
    console.log(res.data);
    if (res.data.success) {
      window.location.href = "/start";
    } else {
      console.log("login failed");
      alert(t('login-failed-msg'));
      setLogining(false);
      // toast not working here, don't know why: toast(res.data.message);
    }
  }

  return (
    <div className='container flex items-center justify-center' style={{
      backgroundImage: 'url(/img/bg-md.png)',
      backgroundSize: 'cover', backgroundPosition: 'center',
      height: '91vh', width: '100%'
    }}>

      {/* <span className='float h-1/2 w-1/2 bg-red-500 opacity-50 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='flex items-center justify-center align-center'>
          <Loader2 className="animate-spin  -ml-2 mr-2 h-32 w-32 opacity-75 "></Loader2>
          AAA
        </div>
      </span> */}

      <Card className="w-[550px]">
        <CardHeader>
          <CardTitle className='mb-8'>{t('login')}</CardTitle>
          {/* <CardDescription className={settings.table_text_size}>{t('login-msg')}</CardDescription> */}

          {logining && (
            <div className='float h-16 w-16 absolute top-1/2 left-1/2 -translate-x-8 -translate-y-8'>
              <Loader2 className="animate-spin  -ml-2 mr-2 h-16 w-16 opacity-75 "></Loader2>
            </div>
          )}

        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label className={settings.table_text_size} htmlFor="name">{t('name')}</Label>
                <Input className={settings.table_text_size} autoFocus
                  id="name"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                  placeholder={t('your-name')}

                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className={settings.table_text_size} htmlFor="name">{t('password')}</Label>
                <input className={"p-2 border border-gray-300 rounded-lg mb-4 "
                  + "focus:outline-none focus:border-gray-600 text-black " + settings.table_text_size}
                  id="password"
                  type="password"
                  value={user.password}
                  onChange={(e) => {
                    setUser({ ...user, password: e.target.value });
                  }}
                  placeholder={t('your-password')}
                  onKeyUp={(e) => {
                    if (e.key == "Enter") {
                      console.log("Enter")
                      login();
                    };
                  }}
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          {/* <Button className={settings.table_text_size} variant="ghost">{t('cancel')}</Button> */}
          <Button className={'bg-primary ' + settings.table_text_size} id="login-btn" onClick={login} >
            {t('login')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}