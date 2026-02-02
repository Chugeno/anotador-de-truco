import React, { useState } from 'react';
import Truco from './games/Truco';
import GenericGame from './games/Generic';
import Generala from './games/Generala';
import Rules from './Rules';
import { BookOpen, Grip, Swords, Disc } from 'lucide-react';

export default function App() {
  const [activeGame, setActiveGame] = useState(null);

  // Simple Router
  if (activeGame === 'truco') {
    return <Truco onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'generic') {
    return <GenericGame onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'generala') {
    return <Generala onBack={() => setActiveGame(null)} />;
  }

  if (activeGame === 'rules') {
    return <Rules onBack={() => setActiveGame(null)} />;
  }

  /* MENU PRINCIPAL */
  return (
    <div className="flex-1 h-full bg-bg text-ink font-sans flex flex-col p-6 pt-10 items-center justify-start gap-8 overflow-y-auto">

      {/* Header / Logo */}
      <div className="text-center space-y-4">
        <div className="inline-block border-4 border-ink p-4 rotate-2 bg-white shadow-[8px_8px_0px_var(--ink-color)] mb-4">
          <Swords size={64} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl md:text-5xl font-black tracking-widest uppercase border-b-4 border-ink pb-4">
          Anotador<br />Universal
        </h1>
        <p className="text-sm font-bold tracking-widest opacity-60">ELIGE TU JUEGO</p>
      </div>

      {/* Grid de Juegos */}
      <div className="w-full max-w-md grid grid-cols-1 gap-4">

        {/* Botón Truco */}
        <MenuButton
          onClick={() => setActiveGame('truco')}
          title="TRUCO"
          subtitle="A 15 y 30 PB"
          icon={<Swords size={32} />}
        />

        {/* Botón Generala */}
        <MenuButton
          onClick={() => setActiveGame('generala')}
          title="GENERALA"
          subtitle="Números y Figuras"
          icon={<Disc size={32} />}
        />

        {/* Botón Genérico / Puntos */}
        <MenuButton
          onClick={() => setActiveGame('generic')}
          title="ANOTADOR LIBRE"
          subtitle="Puntos Personalizados"
          icon={<Grip size={32} />}
        />

        {/* Botón Reglamentos */}
        <MenuButton
          onClick={() => setActiveGame('rules')}
          title="REGLAMENTOS"
          subtitle="Guía rápida y Señas"
          icon={<BookOpen size={32} />}
          disabled={false}
          variant="solid"
        />

      </div>

      <footer className="mt-auto pt-8 text-[10px] font-bold tracking-widest opacity-40 text-center">
        HECHO PARA JUGAR
      </footer>
    </div>
  );
}

function MenuButton({ onClick, title, subtitle, icon, disabled, variant = 'solid' }) {
  const isSolid = variant === 'solid';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
                group relative w-full flex items-center gap-4 p-4 text-left transition-all duration-200
                border-3 border-ink
                ${isSolid
          ? 'bg-white hover:bg-accent hover:text-white shadow-[6px_6px_0px_var(--ink-color)] hover:shadow-[2px_2px_0px_var(--ink-color)] hover:translate-x-[4px] hover:translate-y-[4px]'
          : 'bg-transparent hover:bg-black/5 opacity-60 hover:opacity-100 border-dashed'
        }
            `}
    >
      <div className={`p-3 border-2 border-ink rounded-full ${isSolid ? 'bg-bg group-hover:bg-white group-hover:text-ink' : 'bg-white'}`}>
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-black tracking-wider leading-none mb-1">{title}</h3>
        <p className={`text-xs font-bold tracking-wide ${isSolid ? 'opacity-60 group-hover:opacity-90' : 'opacity-50'}`}>
          {subtitle}
        </p>
      </div>

      {/* Arrow decorativa */}
      {isSolid && (
        <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-2xl font-black">
          →
        </div>
      )}
    </button>
  );
}
