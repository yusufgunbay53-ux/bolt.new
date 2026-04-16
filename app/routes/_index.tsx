import { json, type MetaFunction } from '@remix-run/cloudflare';
import { ClientOnly } from 'remix-utils/client-only';
import ChatScreen from '~/components/ChatScreen';

export const meta: MetaFunction = () => {
  return [
    { title: 'ANOX - AI Assistant' },
    { name: 'description', content: 'Talk with ANOX, your advanced AI assistant' },
  ];
};

export const loader = () => json({});

export default function Index() {
  return (
    <ClientOnly
      fallback={
        <div className="flex h-screen w-full bg-black items-center justify-center text-white">Yükleniyor...</div>
      }
    >
      {() => <ChatScreen />}
    </ClientOnly>
  );
}
