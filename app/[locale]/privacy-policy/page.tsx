// Ref: https://www.youtube.com/watch?v=DTGRIaAJYIo

'use client'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Header from '@/components/Header'
import Container from '@/components/Container'
import { ShoppingCart, ShoppingBag } from 'lucide-react'
import { table_text_size } from "@/Settings/settings"
// import ProductList from '@/components/productlist'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"



export default function Home(props: any) {
  console.log(props)

  if (props.params.locale == 'en') {
    return (
      <div className='container flex items-start mt-12 justify-center '>
        <Card className="w-[850px]">
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>Last Updated: 2023-09-26</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl mb-4 mt-4">1. Introduction</div>

            <div className='ml-4'>
              Welcome to SarcCHECK app, which is provided by uCare Medical Electronics Co., Ltd. ("we," "our," or "us").
              We are committed to protecting the privacy and security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal data in compliance with the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
            </div>

            <div className="text-xl mb-4 mt-4">
              2. Information We Collect
            </div>
            <div className='ml-4'>
              Personal Information
              <ul>
                <li>- Name </li>
                <li>- Email address </li>
                <li>- Phone number </li>
                <li>- Age </li>
                <li>- Gender </li>
                <li>- Height </li>
                <li>- Weight </li>
              </ul>
            </div>

            <div className="text-xl mb-4 mt-4">
              3. How We Use Your Information
            </div>
            <div className='ml-4'>
              We may use your personal information for the following purposes:
              <ul>
                <li>- To provide and maintain our app's functionality and services.</li>
                <li>- To personalize and improve your experience with our app.</li>
                <li>- To respond to your inquiries, requests, or support needs.</li>
                <li>- To communicate with you, including sending important notices, updates, and promotional materials.</li>
                <li>- To prevent, investigate, and address security issues or potential fraud.</li>
                <li>- To comply with legal obligations and enforce our Terms of Service.</li>
              </ul>
            </div>

            <div className="text-xl mb-4 mt-4">
              4. Disclosure of Your Information
            </div>
            <div className='ml-4'>
              We may disclose your personal information to third parties under the following circumstances:
              <ul>
                <li>- With your consent.</li>
                <li>- To service providers and business partners who assist us in delivering our services.</li>
                <li>- In response to a legal request, such as a court order or subpoena.</li>
                <li>- To protect our rights, privacy, safety, or property, as well as that of our users and others.</li>
                <li>- In connection with a merger, sale, or acquisition of all or part of our company.</li>
              </ul>
            </div>

            <div className="text-xl mb-4 mt-4">
              5. Cookies and Tracking Technologies
            </div>
            <div className='ml-4'>
              Our app may use cookies and similar tracking technologies to collect and store information. You can manage your preferences for these technologies through your device settings or browser.
            </div>

            <div className="text-xl mb-4 mt-4">
              6. Your Rights
            </div>
            <div className='ml-4'>
              Subject to applicable laws, you have the following rights regarding your personal information:
              <ul>
                <li>- The right to access and request a copy of your personal information.</li>
                <li>- The right to correct inaccurate or incomplete data.</li>
                <li>- The right to delete your personal information (subject to certain exceptions).</li>
                <li>- The right to object to the processing of your personal information.</li>
                <li>- The right to data portability.</li>
                <li>- The right to opt-out of certain marketing communications.</li>
              </ul>
              To exercise your rights, please contact us at privacy@ucaremedi.com.
            </div>

            <div className="text-xl mb-4 mt-4">
              7. Security
            </div>
            <div className='ml-4'>
              We take reasonable measures to protect your personal information from unauthorized access and disclosure.

            </div>

            <div className="text-xl mb-4 mt-4">
              8. Changes to this Privacy Policy
            </div>
            <div className='ml-4'>
              We may update this Privacy Policy from time to time. Please review it periodically for any changes.
            </div>

            <div className="text-xl mb-4 mt-4">
              9. Contact Us
            </div>
            <div className='ml-4'>
              If you have questions or concerns about this Privacy Policy or our data practices, please contact us at privacy@ucaremedi.com.
            </div>

          </CardContent>
          <CardFooter className="flex items-center justify-end">
            <Button className={'flex bg-primary ' + table_text_size}
              onClick={async () => {
                // window.location.reload();
                window.location.href = '/start';
              }}
            >
              I understand
            </Button>
          </CardFooter>
        </Card>
      </div >
    )
  } else if (props.params.locale == 'zh-tw') {

    return (
      <div className='container flex items-start mt-12 justify-center '>
        <Card className="w-[850px]">
          <CardHeader>
            <CardTitle>隱私政策</CardTitle>
            <CardDescription>最後更新日期: 2023-09-26</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl mb-4 mt-4">1. 介紹</div>

            <div className='ml-4'>
              歡迎使用 宇康醫電股份有限公司（以下簡稱「我們」、「我們的」或「我們」）的產品 SarcCHECK 應用程式。我們致力於保護您的個人信息的隱私和安全。本隱私政策解釋了我們如何在遵守《通用數據保護條例》（GDPR）和《加利福尼亞消費者隱私法》（CCPA）的規定下收集、使用、披露和保護您的個人數據。
            </div>

            <div className="text-xl mb-4 mt-4">
              2. 我們收集的信息
            </div>
            <div className='ml-4'>
              我們可能收集以下類型的個人信息：
              <ul>
                <li>- 姓名 </li>
                <li>- 電子郵件地址 </li>
                <li>- 電話號碼 </li>
                <li>- 年齡 </li>
                <li>- 性別 </li>
                <li>- 身高 </li>
                <li>- 體重 </li>
              </ul>
            </div>

            <div className="text-xl mb-4 mt-4">
              3. 我們如何使用您的信息
            </div>
            <div className='ml-4'>
              我們可能會出於以下目的使用您的個人信息：
              <ul>
                <li>- 維護我們應用程式的功能和服務。</li>
                <li>- 個性化和改進您在我們應用程式中的體驗。</li>
                <li>- 回應您的查詢、請求或支援需求。</li>
                <li>- 與您溝通，包括發送重要通知、更新和促銷材料。</li>
                <li>- 防止、調查和處理安全問題或潛在欺詐行為。</li>
                <li>- 遵守法律義務並執行我們的服務條款。</li>
              </ul>
            </div>

            <div className="text-xl mb-4 mt-4">
              4. 您的信息披露
            </div>
            <div className='ml-4'>
              我們在以下情況下可能向第三方披露您的個人信息：
              <ul>
                <li>- 在獲得您的同意時。</li>
                <li>- 向協助我們提供服務的服務提供商和合作夥伴。</li>
                <li>- 作為對法律請求的回應，例如法院命令或傳票。</li>
                <li>- 保護我們的權利、隱私、安全或財產，以及我們的用戶和其他人的權利。</li>
                <li>- 在公司合併、出售或收購的情況下。</li>
              </ul>
            </div>

            <div className="text-xl mb-4 mt-4">
              5. Cookie和跟蹤技術
            </div>
            <div className='ml-4'>
              我們的應用程式可能使用Cookie和類似的跟蹤技術來收集和存儲信息。您可以通過設備設置或瀏覽器來管理這些技術的偏好設置。
            </div>

            <div className="text-xl mb-4 mt-4">
              6. 您的權利
            </div>
            <div className='ml-4'>
              根據適用法律，您對您的個人信息擁有以下權利：
              <ul>
                <li>- 查看並請求您的個人信息的副本。</li>
                <li>- 更正不準確或不完整的數據。</li>
                <li>- 刪除您的個人信息（受某些例外情況限制）。</li>
                <li>- 反對處理您的個人信息。</li>
                <li>- 數據可攜性的權利。</li>
                <li>- 選擇退出某些市場營銷通信。</li>
              </ul>
              要行使您的權利，請聯繫我們，電子郵件地址為 privacy@ucaremedi.com。
            </div>

            <div className="text-xl mb-4 mt-4">
              7. 安全性
            </div>
            <div className='ml-4'>
              我們採取合理的措施來保護您的個人信息，以防止未經授權的訪問和披露。
            </div>

            <div className="text-xl mb-4 mt-4">
              8. 本隱私政策的更改
            </div>
            <div className='ml-4'>
              我們可能會定期更新本隱私政策。請定期查閱以瞭解任何更改。
            </div>

            <div className="text-xl mb-4 mt-4">
              9. 聯繫我們
            </div>
            <div className='ml-4'>
              如果您對本隱私政策或我們的數據處理方式有任何問題或疑慮，請聯繫我們，電子郵件地址為 privacy@ucaremedi.com。
            </div>

          </CardContent>
          <CardFooter className="flex items-center justify-end">
            <Button className={'flex bg-primary ' + table_text_size}
              onClick={async () => {
                // window.location.reload();
                window.location.href = '/start';
              }}
            >
              我了解
            </Button>
          </CardFooter>
        </Card>


      </div >
    );
  } else {

  }
}