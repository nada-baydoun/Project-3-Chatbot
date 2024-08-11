"use client"

import { Chatbot } from "@/components/component/chatbot";
import { useState, useEffect } from 'react';
import { checkServerHealth } from '../lib/serverCheck';

export default function Home() {
  return (
    <main className="flex items-center justify-center h-screen w-full bg-gray-50">
      <Chatbot />
    </main>
  );
}

export function ChatComponent() {
  const [isServerReady, setIsServerReady] = useState(false);

  useEffect(() => {
    async function checkServer() {
      const isHealthy = await checkServerHealth();
      setIsServerReady(isHealthy);
    }
    checkServer();
  }, []);

  if (!isServerReady) {
    return <div>Loading... Please wait while we connect to the server.</div>;
  }

}