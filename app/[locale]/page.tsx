'use client';

import * as React from "react"
import { useEffect } from "react";
import { useRouter } from "next/navigation";


export default function Index() {

  const router = useRouter();

  useEffect(() => {
    window.location.href = "/start"
    //router.push("/start");
  }, [])

  return (

    <div className='container flex items-center justify-center ' style={{
      backgroundImage: 'url(/img/bg-start.png)',
      backgroundSize: 'cover', backgroundPosition: 'center',
      height: '91vh', width: '100%'
    }}>

    </div>

  );
}