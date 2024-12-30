"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageCircle, Send, X } from "lucide-react";
import Image from "next/image";

const WelcomeMessage = ({ isVisible, onShow }: { isVisible: boolean, onShow?: () => void }) => {
  useEffect(() => {
    if (isVisible && onShow) {
      onShow();
    }
  }, [isVisible, onShow]);

  if (!isVisible) return null;
  
  return (
    <div className="fixed bottom-20 right-4 w-[200px] md:w-auto bg-primary text-primary-foreground p-2 rounded-lg shadow-lg">
      ¿Necesitas atención personalizada?, inicia una conversación
    </div>
  );
};

const ChatWindow = ({
  isOpen,
  onClose,
  onSendMessage,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: () => void;
}) => {
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  return (
    <Card className="fixed bottom-20 right-4 w-80 shadow-lg">
      <CardHeader className="flex flex-row items-center">
        <Image src={'/logos/bot-icon.webp'} alt="bot-icon" width={50} height={50} className="rounded-full mr-4" loading="lazy"/>
        <CardTitle>Autovidrios BOT</CardTitle>
        <Button variant="ghost" className="ml-auto" onClick={onClose}>
          X
        </Button>
      </CardHeader>
      <CardContent>
        <p>¿Necesitas atención personalizada?, inicia una conversación</p>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
          className="flex w-full space-x-2"
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

const ContactForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <Card className="fixed bottom-20 right-4 w-80 shadow-lg">
      <CardHeader>
        <CardTitle>Para entregar tu mensaje llena estos campos</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-4"
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nombre"
          />
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Número de teléfono"
          />
          <Button type="submit" className="w-full">
            Enviar
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default function Chatbot() {
  const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Crear el elemento de audio
    audioRef.current = new Audio("/livechat.mp3");
    
    // Mostrar el mensaje después de 5 segundos
    const showTimer = setTimeout(() => {
      setIsWelcomeVisible(true);
    }, 5000);

    // Ocultar el mensaje después de 5 segundos adicionales
    const hideTimer = setTimeout(() => {
      setIsWelcomeVisible(false);
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const playNotificationSound = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log("Error reproduciendo el sonido:", error);
      });
    }
  };

  const handleIconClick = () => {
    setIsChatOpen(true);
    setIsWelcomeVisible(false);
  };

  const handleSendMessage = () => {
    setShowContactForm(true);
  };

  const handleSubmitContact = () => {
    setShowContactForm(false);
    setShowThankYou(true);
  };

  return (
    <>
      <WelcomeMessage 
        isVisible={isWelcomeVisible} 
        onShow={playNotificationSound}
      />
      {isChatOpen && !showContactForm && !showThankYou && (
        <ChatWindow
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          onSendMessage={handleSendMessage}
        />
      )}
      {showContactForm && <ContactForm onSubmit={handleSubmitContact} />}
      {showThankYou && (
        <Card className="fixed bottom-20 right-4 w-80 shadow-lg">
          <CardContent>
            <p className="text-center py-4">
              Nos pondremos en contacto contigo pronto. ¡Gracias!
            </p>
          </CardContent>
        </Card>
      )}
      <Button
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0"
        onClick={handleIconClick}
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
      {isChatOpen && (
        <Button
          className="border-none bg-none fixed bottom-4 right-16 mr-4 rounded-full w-12 h-12 p-0"
          variant={"outline"}
          onClick={() => {
            setIsChatOpen(false);
            setShowContactForm(false);
            setShowThankYou(false);
          }}
        >
          <X />
        </Button>
      )}
    </>
  );
}