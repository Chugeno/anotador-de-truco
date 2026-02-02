import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Eye, Heart, Sword, Disc, Hand, Zap, Info, Play, Trophy } from 'lucide-react';

export default function Rules({ onBack }) {
    const [selectedGame, setSelectedGame] = useState(null);
    const [expanded, setExpanded] = useState('como-jugar');

    const games = [
        {
            id: 'truco',
            title: 'TRUCO ARGENTINO',
            subtitle: 'El clásico de engaño',
            icon: <Sword size={32} />,
            color: 'bg-accent',
            ready: true
        },
        {
            id: 'generala',
            title: 'GENERALA',
            subtitle: 'Dados y azar',
            icon: <Disc size={32} />,
            color: 'bg-amber-500',
            ready: false
        },
        {
            id: 'poker',
            title: 'POKER (Texas)',
            subtitle: 'Estrategia pura',
            icon: <Trophy size={32} />,
            color: 'bg-emerald-600',
            ready: false
        }
    ];

    const trucoSections = [
        {
            id: 'como-jugar',
            title: '¿CÓMO SE JUEGA?',
            icon: <Info size={24} />,
            content: (
                <div className="space-y-4 text-base leading-relaxed text-gray-800 font-medium">
                    <p>El Truco es un juego de <span className="font-black text-ink">engaño y estrategia</span>. Se juega con una baraja española de 40 cartas.</p>
                    <div className="bg-white p-4 border-2 border-ink shadow-[4px_4px_0px_var(--ink-color)]">
                        <p className="font-bold border-b-2 border-ink mb-2 uppercase text-xs text-ink">La Dinámica:</p>
                        <ul className="list-disc ml-5 space-y-2">
                            <li>Se reparten <span className="font-black underline text-accent">3 cartas</span> a cada uno.</li>
                            <li>Se juega a <span className="font-black text-ink">3 manos</span>.</li>
                            <li>Gana el equipo que gane <span className="font-black text-ink">2 de las 3 manos</span>.</li>
                        </ul>
                    </div>
                    <p>Si hay empate ("parda") en la 1° mano, gana quien gane la 2°. Si empatan las tres, gana el que es "mano" (el que empezó).</p>
                </div>
            )
        },
        {
            id: 'jerarquia',
            title: 'JERARQUÍA DE CARTAS',
            icon: <Zap size={24} />,
            content: (
                <div className="space-y-4">
                    <p className="text-sm font-bold opacity-70 underline uppercase">Poder de las cartas:</p>
                    <div className="grid grid-cols-1 gap-2">
                        <HierarchyItem power="1°" name="Ancho de Espada" cards="1 de Espadas" emoji="🗡️" />
                        <HierarchyItem power="2°" name="Ancho de Basto" cards="1 de Bastos" emoji="🌳" />
                        <HierarchyItem power="3°" name="Siete de Espada" cards="7 de Espadas" emoji="🗡️" />
                        <HierarchyItem power="4°" name="Siete de Oro" cards="7 de Oros" emoji="🪙" />
                        <HierarchyItem power="5°" name="Tres" cards="Todos los 3" />
                        <HierarchyItem power="6°" name="Dos" cards="Todos los 2" />
                        <HierarchyItem power="7°" name="Anchos Falsos" cards="1 de Oro y Copa" />
                        <HierarchyItem power="8°" name="Figuras" cards="12, 11, 10" />
                        <HierarchyItem power="9°" name="Sietes Falsos" cards="7 de Copa y Basto" />
                        <HierarchyItem power="10°" name="Comunes" cards="6, 5, 4" />
                    </div>
                </div>
            )
        },
        {
            id: 'senas',
            title: 'SEÑAS',
            icon: <Eye size={24} />,
            content: (
                <div className="grid grid-cols-2 gap-3">
                    <SenaItem sena="Cejas arriba" result="Ancho Espada" emoji="🤨" />
                    <SenaItem sena="Guiño de ojo" result="Ancho Basto" emoji="😉" />
                    <SenaItem sena="Boca derecha" result="7 Espada" emoji="👄➡️" />
                    <SenaItem sena="Boca izquierda" result="7 Oro" emoji="👄⬅️" />
                    <SenaItem sena="Morder labio" result="Los 3" emoji="👄🦷" />
                    <SenaItem sena="Pucherito" result="Los 2" emoji="😙" />
                    <SenaItem sena="Abrir boca" result="Anchos F" emoji="😮" />
                    <SenaItem sena="Inclinar cabeza" result="Envido" emoji="🤔" />
                    <SenaItem sena="Inflar moflete" result="Envido" emoji="😗" />
                    <SenaItem sena="Arrugar nariz" result="Flor" emoji="👃" />
                </div>
            )
        },
        {
            id: 'envido',
            title: 'EL ENVIDO',
            icon: <Heart size={24} />,
            content: (
                <div className="space-y-4 text-base leading-relaxed text-gray-800">
                    <div className="bg-white p-4 border-3 border-ink shadow-[4px_4px_0px_var(--ink-color)]">
                        <p className="font-bold border-b-2 border-ink mb-2 uppercase text-xs text-ink">Ejemplo de cuenta:</p>
                        <div className="flex gap-4 items-center">
                            <div className="bg-bg p-2 border border-ink text-center">
                                <p className="text-xs">7🗡️ + 3🗡️</p>
                                <p className="font-black">30 PTS</p>
                            </div>
                            <p className="text-xs">Si tenés <span className="font-bold">2 del mismo palo</span>: sumale 20 al valor de ambas (las figuras valen 0).</p>
                        </div>
                    </div>

                    <table className="w-full border-collapse border-3 border-ink text-sm">
                        <thead>
                            <tr className="bg-ink text-white uppercase text-[10px]">
                                <th className="p-2 border border-white">CANTO</th>
                                <th className="p-2 border border-white bg-accent">QUERIDO</th>
                                <th className="p-2 border border-white">NO Q.</th>
                            </tr>
                        </thead>
                        <tbody className="text-center font-bold">
                            <tr className="border-b border-ink/20">
                                <td className="p-2 text-left">Envido</td>
                                <td className="p-2 bg-accent/5">2 pts</td>
                                <td className="p-2 opacity-60">1 pt</td>
                            </tr>
                            <tr className="border-b border-ink/20">
                                <td className="p-2 text-left">Real Envido</td>
                                <td className="p-2 bg-accent/5">3 pts</td>
                                <td className="p-2 opacity-60">1 pt</td>
                            </tr>
                            <tr className="border-b border-ink/30">
                                <td className="p-2 text-left">E + E</td>
                                <td className="p-2 bg-accent/5">4 pts</td>
                                <td className="p-2 opacity-60">2 pts</td>
                            </tr>
                            <tr className="border-b border-ink/30">
                                <td className="p-2 text-left">E + R.E</td>
                                <td className="p-2 bg-accent/5">5 pts</td>
                                <td className="p-2 opacity-60">2 pts</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="bg-amber-50 p-4 border-2 border-dashed border-ink text-sm italic">
                        <p className="font-bold text-accent mb-1 not-italic uppercase text-xs">Falta Envido:</p>
                        <p>• Si están en las <span className="font-black">malas</span>: el que gana suma los puntos necesarios para llegar a 15.</p>
                        <p>• Si están en las <span className="font-black">buenas</span>: el que gana gana el partido.</p>
                    </div>
                </div>
            )
        },
        {
            id: 'truco',
            title: 'EL TRUCO',
            icon: <Sword size={24} />,
            content: (
                <div className="space-y-4 text-base leading-relaxed text-gray-800">
                    <p>Es la apuesta por las cartas. Se puede cantar en cualquier momento antes de la última carta.</p>
                    <table className="w-full border-collapse border-3 border-ink text-sm">
                        <thead>
                            <tr className="bg-ink text-white uppercase text-[10px]">
                                <th className="p-2 border border-white">Canto</th>
                                <th className="p-2 border border-white bg-accent">Gana</th>
                                <th className="p-2 border border-white">No Q.</th>
                            </tr>
                        </thead>
                        <tbody className="text-center font-bold">
                            <tr className="border-b border-ink/20">
                                <td className="p-2 text-left">Truco</td>
                                <td className="p-2 bg-accent/5">2 pts</td>
                                <td className="p-2 opacity-60">1 pt</td>
                            </tr>
                            <tr className="border-b border-ink/20">
                                <td className="p-2 text-left">Retruco</td>
                                <td className="p-2 bg-accent/5">3 pts</td>
                                <td className="p-2 opacity-60">2 pts</td>
                            </tr>
                            <tr className="border-b border-ink/20">
                                <td className="p-2 text-left">Vale Cuatro</td>
                                <td className="p-2 bg-accent/5">4 pts</td>
                                <td className="p-2 opacity-60">3 pts</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )
        }
    ];

    const handleBack = () => {
        if (selectedGame) {
            setSelectedGame(null);
        } else {
            onBack();
        }
    };

    return (
        <div className="flex flex-col h-full bg-bg text-ink font-sans relative overflow-hidden pb-[env(safe-area-inset-bottom)]">
            {/* Header */}
            <div className="relative border-b-3 border-ink p-4 flex items-center justify-center shrink-0 bg-white shadow-sm z-10">
                <button onClick={handleBack} className="absolute left-4 p-2 hover:bg-black/5 rounded-full transition-colors active:scale-90">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl md:text-2xl font-black tracking-widest text-center m-0 uppercase">
                    {selectedGame ? selectedGame : 'REGLAMENTOS'}
                </h1>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {!selectedGame ? (
                    <div className="grid grid-cols-1 gap-4 py-4 animate-in fade-in zoom-in-95 duration-200">
                        <div className="bg-ink text-white p-6 border-3 border-ink shadow-[6px_6px_0px_var(--accent-color)] mb-4 -rotate-1">
                            <h2 className="text-3xl font-black tracking-tighter leading-none mb-2 underline decoration-accent decoration-4 underline-offset-4">
                                BIBLIOTECA DE REGLAS
                            </h2>
                            <p className="text-xs font-bold uppercase opacity-80 italic">Aprendé a jugar como un pro</p>
                        </div>

                        {games.map(game => (
                            <button
                                key={game.id}
                                onClick={() => game.ready && setSelectedGame(game.id)}
                                className={`group relative w-full flex items-center gap-6 p-6 border-4 border-ink bg-white shadow-[6px_6px_0px_var(--ink-color)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all text-left ${!game.ready && 'opacity-60 grayscale'}`}
                            >
                                <div className={`p-4 border-3 border-ink ${game.color} text-white shadow-[3px_3px_0px_var(--ink-color)] shrink-0`}>
                                    {game.icon}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-black tracking-tight leading-none mb-1 uppercase">{game.title}</h3>
                                    <p className="text-xs font-bold uppercase opacity-60">{game.subtitle}</p>
                                </div>
                                {game.ready ? (
                                    <Play size={24} className="group-hover:translate-x-1 transition-transform" />
                                ) : (
                                    <span className="bg-ink text-white text-[10px] px-2 py-1 font-black absolute top-2 right-2">PRÓXIMAMENTE</span>
                                )}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4 animate-in slide-in-from-right-4 duration-300">
                        {selectedGame === 'truco' && (
                            <>
                                <div className="bg-accent text-white p-4 border-3 border-ink shadow-[6px_6px_0px_var(--ink-color)] mb-4 rotate-1">
                                    <h2 className="text-2xl font-black tracking-tighter">TRUCO ARGENTINO</h2>
                                    <p className="text-xs font-bold uppercase opacity-80 italic">La guía definitiva</p>
                                </div>

                                {trucoSections.map(section => (
                                    <div key={section.id} className="border-3 border-ink bg-white shadow-[4px_4px_0px_var(--ink-color)]">
                                        <button
                                            onClick={() => setExpanded(expanded === section.id ? null : section.id)}
                                            className="w-full flex items-center justify-between p-5 text-left hover:bg-black/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className={`${expanded === section.id ? 'text-accent' : 'text-ink'}`}>{section.icon}</span>
                                                <span className="font-black tracking-wider text-base uppercase">{section.title}</span>
                                            </div>
                                            {expanded === section.id ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                        </button>
                                        {expanded === section.id && (
                                            <div className="p-5 border-t-3 border-ink bg-gray-50 animate-in slide-in-from-top-2 duration-200">
                                                {section.content}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                )}

                <div className="h-24" /> {/* Spacer */}
            </div>

            <footer className="absolute bottom-6 left-0 right-0 p-4 text-center pointer-events-none">
                <span className="bg-white border-2 border-ink px-3 py-1 text-[10px] font-bold shadow-[2px_2px_0px_var(--ink-color)] opacity-60">
                    * Lo que dice el mazo, se respeta *
                </span>
            </footer>
        </div>
    );
}

function HierarchyItem({ power, name, cards, emoji }) {
    return (
        <div className="flex items-center gap-4 bg-white border-2 border-ink p-3 text-sm">
            <span className="font-black bg-ink text-white px-2 py-1 w-12 text-center shrink-0">{power}</span>
            <div className="flex-1 leading-none">
                <p className="font-black uppercase text-base">{name} {emoji}</p>
                <p className="opacity-60 text-[10px] font-bold mt-1 uppercase tracking-tight">{cards}</p>
            </div>
        </div>
    );
}

function SenaItem({ sena, result, emoji }) {
    return (
        <div className="border-3 border-ink p-4 bg-white flex flex-col items-center justify-center text-center gap-2 hover:bg-accent/5 transition-colors group">
            <span className="text-4xl group-hover:scale-110 transition-transform">{emoji}</span>
            <p className="text-[10px] font-bold leading-tight uppercase min-h-[1.5rem] flex items-center text-gray-600">{sena}</p>
            <div className="w-full border-t-2 border-ink/10 pt-1">
                <p className="text-[11px] font-black text-accent uppercase tracking-tighter">{result}</p>
            </div>
        </div>
    );
}
