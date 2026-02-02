import React, { useState, useEffect } from 'react';
import { ArrowLeft, RotateCcw } from 'lucide-react';

const MAX_PUNTOS = 30;

export default function Truco({ onBack }) {
    const [ptsNos, setPtsNos] = useState(0);
    const [ptsEllos, setPtsEllos] = useState(0);
    const [winner, setWinner] = useState(null);

    const sumar = (equipo) => {
        if (winner) return;
        if (equipo === 'nos' && ptsNos < MAX_PUNTOS) {
            const newPts = ptsNos + 1;
            setPtsNos(newPts);
            checkWinner(newPts, ptsEllos);
        } else if (equipo === 'ellos' && ptsEllos < MAX_PUNTOS) {
            const newPts = ptsEllos + 1;
            setPtsEllos(newPts);
            checkWinner(ptsNos, newPts);
        }
        vibrate(30);
    };

    const restar = (equipo) => {
        if (winner) return;
        if (equipo === 'nos' && ptsNos > 0) setPtsNos(ptsNos - 1);
        if (equipo === 'ellos' && ptsEllos > 0) setPtsEllos(ptsEllos - 1);
        vibrate(10);
    };

    const checkWinner = (nos, ellos) => {
        if (nos >= MAX_PUNTOS) setWinner("¡GANAMOS!");
        else if (ellos >= MAX_PUNTOS) setWinner("GANARON ELLOS");
    };

    const reiniciar = () => {
        setPtsNos(0);
        setPtsEllos(0);
        setWinner(null);
    };

    const vibrate = (ms) => {
        if (navigator.vibrate) navigator.vibrate(ms);
    };

    return (
        <div className="flex flex-col h-full bg-bg text-ink font-sans relative pb-[env(safe-area-inset-bottom)]">
            {/* Header */}
            <div className="relative border-b-3 border-ink p-4 flex items-center justify-center shrink-0">
                <button onClick={onBack} className="absolute left-4 p-2 hover:bg-black/5 rounded-full">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl md:text-2xl tracking-widest text-center m-0">TRUCO</h1>
            </div>

            {/* Tablero */}
            <div className="flex flex-1 overflow-hidden p-4 gap-4">
                <Equipo nombre="NOSOTROS" puntos={ptsNos} onSumar={() => sumar('nos')} onRestar={() => restar('nos')} />
                <Equipo nombre="ELLOS" puntos={ptsEllos} onSumar={() => sumar('ellos')} onRestar={() => restar('ellos')} />
            </div>

            {/* Modal Ganador */}
            {winner && (
                <div className="absolute inset-0 bg-bg/95 flex flex-col items-center justify-center z-50 p-6 animate-in fade-in zoom-in duration-200">
                    <h2 className="text-4xl md:text-6xl text-accent border-4 border-ink p-8 -rotate-3 bg-white shadow-[10px_10px_0px_var(--ink-color)] text-center mb-10">
                        {winner}
                    </h2>
                    <button
                        onClick={reiniciar}
                        className="bg-ink text-white border-none py-4 px-8 text-xl tracking-widest font-bold hover:scale-105 transition-transform"
                    >
                        NUEVA PARTIDA
                    </button>
                </div>
            )}
        </div>
    );
}

function Equipo({ nombre, puntos, onSumar, onRestar }) {
    return (
        <div className="flex-1 flex flex-col items-center border-3 border-ink bg-white rounded overflow-hidden">
            <div className="w-full bg-ink text-white text-center py-3 text-lg md:text-xl tracking-wider shrink-0">
                {nombre} ({puntos})
            </div>

            {/* Zona Puntos */}
            <div className="flex-1 w-full p-2 flex flex-col items-center justify-between overflow-y-auto">
                <div className="flex flex-col w-full h-full justify-evenly items-center">
                    {/* Render first 15 points (Malas) */}
                    <div className="flex flex-col w-full items-center justify-evenly flex-1">
                        {[0, 1, 2].map(i => (
                            <Cuadrado key={i} puntos={Math.max(0, Math.min(5, puntos - (i * 5)))} />
                        ))}
                    </div>

                    {/* Separator */}
                    <div className="w-[90%] border-t-2 border-dashed border-accent my-2 text-center text-accent text-xs shrink-0 leading-[0]">
                        <span className="bg-white px-2">BUENAS</span>
                    </div>

                    {/* Render next 15 points (Buenas) */}
                    <div className="flex flex-col w-full items-center justify-evenly flex-1">
                        {[3, 4, 5].map(i => (
                            <Cuadrado key={i} puntos={Math.max(0, Math.min(5, puntos - (i * 5)))} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Controles */}
            <div className="w-full flex border-t-3 border-ink shrink-0 h-20 md:h-24">
                <button
                    onClick={onRestar}
                    className="flex-1 bg-[#e0ded6] text-ink text-4xl font-black border-r-3 border-ink active:brightness-90 flex items-center justify-center"
                >
                    -
                </button>
                <button
                    onClick={onSumar}
                    className="flex-1 bg-accent text-white text-4xl font-black active:brightness-90 flex items-center justify-center"
                >
                    +
                </button>
            </div>
        </div>
    );
}

function Cuadrado({ puntos }) {
    // Original CSS logic: 
    // .val-1 .p-top
    // .val-2 .p-top, .p-right
    // ...
    const isActive = puntos > 0;

    return (
        <div className={`relative w-[35px] h-[35px] md:w-[50px] md:h-[50px] transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-15'}`}>
            {/* Top */}
            <div className={`absolute top-0 left-0 w-full h-[4px] bg-ink ${puntos >= 1 ? 'block' : 'hidden'}`} />
            {/* Right */}
            <div className={`absolute top-0 right-0 w-[4px] h-full bg-ink ${puntos >= 2 ? 'block' : 'hidden'}`} />
            {/* Bottom */}
            <div className={`absolute bottom-0 left-0 w-full h-[4px] bg-ink ${puntos >= 3 ? 'block' : 'hidden'}`} />
            {/* Left */}
            <div className={`absolute top-0 left-0 w-[4px] h-full bg-ink ${puntos >= 4 ? 'block' : 'hidden'}`} />
            {/* Diagonal */}
            <div
                className={`absolute h-[4px] bg-accent top-0 left-0 origin-top-left rotate-45 ${puntos >= 5 ? 'block' : 'hidden'}`}
                style={{ width: '141%' }} // sqrt(2) * 100%
            />
        </div>
    );
}
