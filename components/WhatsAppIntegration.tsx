'use client';

import { useWhatsAppQrCode } from '@/lib/api/hooks';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export function WhatsAppIntegration() {
  const { qrCode, loading, error, backendUnavailable, refresh } = useWhatsAppQrCode();

  // Different UI based on status
  let content;
  if (loading) {
    content = (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="w-40 h-40 bg-gray-200 animate-pulse rounded-lg mb-4" />
        <p className="text-gray-500">Loading QR code...</p>
      </div>
    );
  } else if (backendUnavailable) {
    content = (
      <div className="text-center p-6">
        <p className="text-amber-500 mb-4">WhatsApp integration unavailable</p>
        <p className="text-sm text-gray-500 mb-4">
          The WhatsApp integration feature is not available at this time. This may be a configuration issue.
        </p>
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center p-6">
        <p className="text-red-500 mb-4">Error loading WhatsApp QR code</p>
        <p className="text-sm text-gray-500 mb-4">
          There was a problem connecting to the WhatsApp service.
        </p>
        <Button onClick={refresh} variant="outline">Try Again</Button>
      </div>
    );
  } else if (qrCode) {
    content = (
      <div className="flex flex-col items-center">
        <div className="border-4 border-green-500 rounded-lg p-2 mb-4">
          <Image 
            src={qrCode} 
            alt="WhatsApp QR Code" 
            width={200} 
            height={200} 
            className="w-48 h-48"
          />
        </div>
        <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-2">
          <li>Open WhatsApp on your phone</li>
          <li>Tap Menu or Settings and select Linked Devices</li>
          <li>Tap on "Link a Device"</li>
          <li>Point your phone to this screen to scan the QR code</li>
        </ol>
      </div>
    );
  } else {
    content = (
      <div className="text-center p-6">
        <p className="text-gray-500 mb-4">
          No QR code available. The WhatsApp service might not be configured correctly.
        </p>
        <Button onClick={refresh} variant="outline">Refresh</Button>
      </div>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-green-50">
        <CardTitle className="flex items-center">
          <svg viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" className="text-green-600 mr-2" fill="currentColor">
            <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-.343-.73-.343-2.31-1.106-2.238-3.129-2.215-3.956.006-.257.332-1.899.332-1.899.089-.68.203-1.63-.825-1.63h-1.14c-.704 0-1.026.43-1.14.773-1.076 3.27 1.794 6.39 2.902 7.445.237.227 1.178.89 1.178 1.117.012.245-.412.934-.615 1.314-.752 1.387-1.872 2.574-3.217 3.148a.8.8 0 0 1-.333.077c-.612 0-1.264-1.372-1.923-1.372a.92.92 0 0 0-.151.018c-.302.09-.666.24-.668.444-.002.214.279.562.71.884.318.237.626.442.93.606.54.298 1.093.506 1.655.664.315.09.651.172.99.219.497.083.996.088 1.496.01a7.185 7.185 0 0 0 2.348-.779 8.308 8.308 0 0 0 3.3-3.076 8.567 8.567 0 0 0 1.243-4.276c.026-.222-.18-.442-.401-.442a5.956 5.956 0 0 1-1.041-.112c-.23-.063-.495-.248-.695-.43-.558-.499-.622-1.137-.622-1.336 0-.199.238-.922.238-1.519v-.695c0-1.008-.363-1.568-1.21-1.97-.372-.175-.957-.223-1.374-.223-.949.033-1.905.266-2.703.863-.619.466-.971 1.132-.971 1.884a3.63 3.63 0 0 0 1.879 3.24c.34.193.753.376 1.13.385.68.017 1.008-.517 1.086-.801.031-.119-.062-.411-.062-.411-.207-.779-1.051-1.189-1.618-1.189a1.72 1.72 0 0 0-1.207.577c-.302.363-.457.771-.457 1.158 0 .562.43 1.045.915 1.094a.961.961 0 0 0 .811-.427c.542.458 1.107.873 1.698 1.235.026.345.272.697.614.697.177 0 .331-.1.374-.361.068-.451.075-1.15-.168-1.553a4.694 4.694 0 0 0-1.31-1.298 5.095 5.095 0 0 0-1.86-.934 1.816 1.816 0 0 0-.716-.133 2.901 2.901 0 0 0-1.85.749c-.525.424-.964 1.067-1.166 1.702a3.64 3.64 0 0 0-.156 1.05c0 1.33.812 2.463 1.966 2.846a3.977 3.977 0 0 0 1.751.206 3.598 3.598 0 0 0 2.404-1.34c.253-.312.466-.673.508-1.043a3.629 3.629 0 0 0-.189-1.405 3.284 3.284 0 0 0-.758-1.212 1.222 1.222 0 0 1-.147-.192 2.67 2.67 0 0 1-.135-.294" />
          </svg>
          WhatsApp Integration
        </CardTitle>
        <CardDescription>
          Connect your account with WhatsApp to receive notifications and join event groups
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {content}
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3">
        <p className="text-xs text-gray-500">
          By connecting your WhatsApp, you'll be able to receive event notifications and join event chat groups directly.
        </p>
      </CardFooter>
    </Card>
  );
} 