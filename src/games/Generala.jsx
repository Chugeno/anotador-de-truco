import React, { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Trash2, RotateCcw, Trophy, Check, X, Disc } from 'lucide-react';

const CATEGORIES = [
    { id: '1', label: '1', type: 'number', base: 1 },
    { id: '2', label: '2', type: 'number', base: 2 },
    { id: '3', label: '3', type: 'number', base: 3 },
    { id: '4', label: '4', type: 'number', base: 4 },
    { id: '5', label: '5', type: 'number', base: 5 },
    { id: '6', label: '6', type: 'number', base: 6 },
    { id: 'escalera', label: 'ESCALERA', type: 'figure', points: 20, bonus: 5 },
    { id: 'full', label: 'FULL', type: 'figure', points: 30, bonus: 5 },
    { id: 'poker', label: 'PÓKER', type: 'figure', points: 40, bonus: 5 },
    { id: 'generala', label: 'GENERALA', type: 'figure', points: 50, bonus: 0 },
    { id: 'doble', label: 'D. GENERALA', type: 'figure', points: 100, bonus: 0 },
];

export default function Generala({ onBack }) {
    const [players, setPlayers] = useState([]);
    const [gameStarted, setGameStarted] = useState(false);
    const [newPlayerName, setNewPlayerName] = useState('');
    const [activeCell, setActiveCell] = useState(null); // { playerId, categoryId }

    // Cargar desde localStorage
    useEffect(() => {
        const saved = localStorage.getItem('generala_state');
        if (saved) {
            const { players: savedPlayers, gameStarted: savedStarted } = JSON.parse(saved);
            setPlayers(savedPlayers);
            setGameStarted(savedStarted);
        }
    }, []);

    // Guardar en localStorage
    useEffect(() => {
        if (players.length > 0) {
            localStorage.setItem('generala_state', JSON.stringify({ players, gameStarted }));
        }
    }, [players, gameStarted]);

    const addPlayer = () => {
        if (!newPlayerName.trim()) return;
        const player = {
            id: Date.now(),
            name: newPlayerName.trim(),
            scores: {} // { categoryId: { val: number, status: 'normal'|'servido'|'tachado' } }
        };
        setPlayers([...players, player]);
        setNewPlayerName('');
    };

    const removePlayer = (id) => {
        setPlayers(players.filter(p => p.id !== id));
    };

    const resetGame = () => {
        if (confirm('¿Reiniciar toda la partida?')) {
            setPlayers(players.map(p => ({ ...p, scores: {} })));
            localStorage.removeItem('generala_state');
        }
    };

    const updateScore = (playerId, categoryId, value, status = 'normal') => {
        setPlayers(players.map(p => {
            if (p.id === playerId) {
                return {
                    ...p,
                    scores: {
                        ...p.scores,
                        [categoryId]: value === null ? undefined : { val: value, status }
                    }
                };
            }
            return p;
        }));
        setActiveCell(null);
    };

    const calculateTotal = (scores) => {
        return Object.values(scores).reduce((acc, score) => {
            if (!score || score.status === 'tachado') return acc;
            return acc + score.val;
        }, 0);
    };

    if (!gameStarted) {
        return (
            <div className="flex flex-col h-full bg-bg p-6 font-sans">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={onBack} className="p-2 border-2 border-ink bg-white shadow-[2px_2px_0px_var(--ink-color)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-black tracking-tight uppercase">Configurar Generala</h1>
                </div>

                <div className="space-y-6 max-w-md mx-auto w-full">
                    <div className="bg-white border-3 border-ink p-6 shadow-[6px_6px_0px_var(--ink-color)]">
                        <label className="block text-xs font-black uppercase opacity-60 mb-2">NOMBRE DEL JUGADOR</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newPlayerName}
                                onChange={(e) => setNewPlayerName(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                                placeholder="Ej: Nacho"
                                className="flex-1 border-3 border-ink p-3 font-bold focus:outline-none focus:ring-4 focus:ring-accent/20"
                            />
                            <button
                                onClick={addPlayer}
                                className="bg-accent text-white p-3 border-3 border-ink shadow-[4px_4px_0px_var(--ink-color)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            >
                                <UserPlus size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {players.map(p => (
                            <div key={p.id} className="flex items-center justify-between bg-white border-3 border-ink p-4 shadow-[4px_4px_0px_var(--ink-color)] animate-in slide-in-from-left-4 duration-200">
                                <span className="font-black text-lg uppercase">{p.name}</span>
                                <button onClick={() => removePlayer(p.id)} className="text-red-500 p-1 hover:bg-red-50 rounded">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {players.length >= 1 && (
                        <button
                            onClick={() => setGameStarted(true)}
                            className="w-full bg-ink text-white p-5 text-xl font-black tracking-widest shadow-[8px_8px_0px_var(--accent-color)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all uppercase"
                        >
                            Comenzar Juego
                        </button>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-bg font-sans max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b-4 border-ink p-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-3">
                    <button onClick={() => setGameStarted(false)} className="p-2 border-2 border-ink active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_var(--ink-color)] active:shadow-none">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="leading-tight">
                        <h1 className="font-black text-xl uppercase tracking-tighter">GENERALA</h1>
                        <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">Anotador</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={resetGame} className="p-2 border-2 border-ink hover:bg-accent/10 transition-colors shadow-[2px_2px_0px_var(--ink-color)] active:shadow-none active:translate-y-0.5 active:translate-x-0.5">
                        <RotateCcw size={20} />
                    </button>
                </div>
            </header>

            {/* Grid Content */}
            <div className="flex-1 overflow-x-auto overflow-y-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr>
                            <th className="sticky left-0 top-0 z-30 bg-white p-3 border-r-4 border-b-4 border-ink min-w-[120px] text-left">
                                <span className="text-xs font-black opacity-30 uppercase">Categoría</span>
                            </th>
                            {players.map(p => (
                                <th key={p.id} className="sticky top-0 z-10 bg-white p-3 border-r-4 border-b-4 border-ink min-w-[100px] text-center">
                                    <p className="font-black text-sm uppercase truncate max-w-[80px]">{p.name}</p>
                                    <p className="text-xs font-medium text-accent">{calculateTotal(p.scores)} pts</p>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {CATEGORIES.map(cat => (
                            <tr key={cat.id} className="group">
                                <td className="sticky left-0 z-10 bg-white p-3 border-r-4 border-b-2 border-ink font-black text-xs uppercase tracking-tight group-hover:bg-accent/5">
                                    <div className="flex items-center gap-2">
                                        {cat.type === 'figure' ? <Disc size={12} className="text-accent" /> : <span className="w-3 h-3 border border-ink opacity-30" />}
                                        {cat.label}
                                    </div>
                                </td>
                                {players.map(p => (
                                    <ScoreCell
                                        key={p.id}
                                        playerId={p.id}
                                        category={cat}
                                        score={p.scores[cat.id]}
                                        onClick={() => setActiveCell({ playerId: p.id, categoryId: cat.id })}
                                    />
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Score Modal / Overlay */}
            {activeCell && (
                <ScorePicker
                    cell={activeCell}
                    category={CATEGORIES.find(c => c.id === activeCell.categoryId)}
                    playerName={players.find(p => p.id === activeCell.playerId).name}
                    onClose={() => setActiveCell(null)}
                    onSelect={updateScore}
                />
            )}
        </div>
    );
}

function ScoreCell({ playerId, category, score, onClick }) {
    let display = "-";
    let classes = "bg-white p-3 border-r-4 border-b-2 border-ink text-center cursor-pointer hover:bg-accent/5 transition-colors";

    if (score) {
        if (score.status === 'tachado') {
            display = <X size={20} className="mx-auto text-red-500 opacity-60" />;
            classes += " bg-gray-50";
        } else {
            display = (
                <div className="relative inline-block">
                    <span className="text-lg font-black">{score.val}</span>
                    {score.status === 'servido' && <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-accent animate-pulse" />}
                </div>
            );
            if (score.status === 'servido') classes += " bg-accent/5";
        }
    }

    return (
        <td onClick={onClick} className={classes}>
            <div className="flex items-center justify-center min-h-[40px]">
                {display}
            </div>
        </td>
    );
}

function ScorePicker({ cell, category, playerName, onClose, onSelect }) {
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white border-4 border-ink w-full max-w-sm shadow-[12px_12px_0px_rgba(0,0,0,1)] animate-in slide-in-from-bottom-8 duration-300">
                <div className="p-4 border-b-3 border-ink flex justify-between items-center bg-accent text-white">
                    <div className="leading-none">
                        <h3 className="font-black text-lg uppercase">{category.label}</h3>
                        <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{playerName}</p>
                    </div>
                    <button onClick={onClose} className="p-2 border-2 border-white rounded-full bg-white/20">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6">
                    {category.type === 'number' ? (
                        <div className="grid grid-cols-3 gap-3">
                            {[1, 2, 3, 4, 5].map(q => (
                                <button
                                    key={q}
                                    onClick={() => onSelect(cell.playerId, category.id, q * category.base, 'normal')}
                                    className="p-4 border-3 border-ink font-black text-xl hover:bg-accent hover:text-white shadow-[4px_4px_0px_var(--ink-color)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                                >
                                    {q}
                                </button>
                            ))}
                            <TachadoButton onClick={() => onSelect(cell.playerId, category.id, 0, 'tachado')} />
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <button
                                onClick={() => onSelect(cell.playerId, category.id, category.points, 'normal')}
                                className="w-full p-4 border-3 border-ink flex items-center justify-between font-black hover:bg-accent/10 shadow-[4px_4px_0px_var(--ink-color)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                            >
                                <span>ARMADO</span>
                                <span className="bg-ink text-white px-2 py-1 text-sm">{category.points}</span>
                            </button>
                            {category.bonus > 0 && (
                                <button
                                    onClick={() => onSelect(cell.playerId, category.id, category.points + category.bonus, 'servido')}
                                    className="w-full p-4 border-3 border-accent flex items-center justify-between font-black text-accent bg-accent/5 hover:bg-accent hover:text-white shadow-[4px_4px_0px_var(--accent-color)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                                >
                                    <span className="flex items-center gap-2 italic"><Zap size={16} /> SERVIDO</span>
                                    <span className="bg-accent text-white px-2 py-1 text-sm">{category.points + category.bonus}</span>
                                </button>
                            )}
                            {category.id === 'generala' && (
                                <button
                                    onClick={() => onSelect(cell.playerId, category.id, category.points, 'normal')}
                                    className="w-full p-4 border-3 border-ink flex items-center justify-between font-black hover:bg-accent/10 shadow-[4px_4px_0px_var(--ink-color)]"
                                >
                                    <span>ARMADA</span>
                                    <span className="bg-ink text-white px-2 py-1 text-sm">{category.points}</span>
                                </button>
                            )}
                            <TachadoButton onClick={() => onSelect(cell.playerId, category.id, 0, 'tachado')} />
                        </div>
                    )}

                    <button
                        onClick={() => onSelect(cell.playerId, category.id, null)}
                        className="w-full mt-6 p-2 text-xs font-black uppercase opacity-40 hover:opacity-100 transition-opacity"
                    >
                        Borrar Anotación
                    </button>
                </div>
            </div>
        </div>
    );
}

function TachadoButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="p-4 border-3 border-red-500 font-black text-red-500 hover:bg-red-500 hover:text-white shadow-[4px_4px_0px_#ef4444] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-1"
        >
            <X size={20} /> <span className="text-xs">TACHAR</span>
        </button>
    );
}

function Zap({ size, className }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
        </svg>
    );
}
