"use client"

import { useChat } from "@ai-sdk/react"
import { useRef, useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"

export default function ChatBox() {
  const { messages, sendMessage, status, error } = useChat()
  const [input, setInput] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  const isLoading = status === "submitted" || status === "streaming"

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const text = input
    setInput("")
    try {
      await sendMessage({ text })
    } catch (err) {
      console.error("sendMessage error:", err)
    }
  }

  return (
    <div className="bg-gradient-to-br from-brand-blue to-blue-900 rounded-2xl p-5 text-white mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg">
          🤖
        </div>
        <div>
          <p className="font-semibold">Asistente Virtual</p>
          <p className="text-xs opacity-80">Disponible 24/7</p>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto mb-4 pr-1 scrollbar-thin">
        {messages.length === 0 && (
          <div className="bg-white/10 rounded-xl p-3 text-sm">
            ¡Hola! Soy el asistente virtual de EASYSEGURO. Pregúntame sobre tus seguros, pólizas, siniestros o cualquier duda que tengas.
          </div>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`rounded-xl p-3 text-sm max-w-[85%] ${
              m.role === "user"
                ? "bg-white text-zinc-900 ml-auto"
                : "bg-white/20 text-white"
            }`}
          >
            {m.parts.map((part, i) =>
              part.type === "text" ? (
                m.role === "assistant" ? (
                  <ReactMarkdown
                    key={i}
                    components={{
                      strong: ({ children }) => (
                        <span className="font-semibold text-brand-yellow">{children}</span>
                      ),
                      p: ({ children }) => (
                        <p className="text-sm leading-relaxed">{children}</p>
                      ),
                    }}
                  >
                    {part.text}
                  </ReactMarkdown>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              ) : null
            )}
          </div>
        ))}
        {isLoading && (
          <div className="bg-white/20 rounded-xl p-3 text-sm text-white/70 max-w-[85%]">
            <span className="animate-pulse">Escribiendo...</span>
          </div>
        )}
        {status === "error" && error && (
          <div className="bg-red-500/30 rounded-xl p-3 text-sm text-white/90 max-w-[85%]">
            Error: {error.message}
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 w-full">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu consulta..."
          className="flex-1 min-w-0 px-4 py-2.5 rounded-xl text-sm text-zinc-900 bg-white/90 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-white/50"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="shrink-0 px-4 py-2.5 bg-brand-yellow text-brand-blue rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}
