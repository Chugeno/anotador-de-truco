import React, { useState, useRef, useEffect } from 'react';
import { Settings, RefreshCw, Trophy, Plus, Minus, RotateCcw, Edit2, Check, ArrowDown, ArrowUp, X, LogOut, Menu } from 'lucide-react';

export default function App() {
    // Estado inicial
    const [gameState, setGameState] = useState('setup');
    const [config, setConfig] = useState({ playerCount: 4, maxScore: 0 });
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Estado para el modal de confirmación personalizado
    const [confirmModal, setConfirmModal] = useState(null); // { title, action }

    // --- LÓGICA DE GUARDADO ---
    useEffect(() => {
        const savedData = localStorage.getItem('anotador_data_v1');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.gameState) setGameState(parsed.gameState);
                if (parsed.config) setConfig(parsed.config);
                if (parsed.players) setPlayers(parsed.players);
                if (parsed.winner) setWinner(parsed.winner);
            } catch (e) {
                console.error("Error al cargar", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        const dataToSave = { gameState, config, players, winner };
        localStorage.setItem('anotador_data_v1', JSON.stringify(dataToSave));
    }, [gameState, config, players, winner, isLoaded]);
    // ---------------------------

    const startGame = () => {
        const newPlayers = Array.from({ length: config.playerCount }, (_, i) => ({
            id: i,
            name: `J ${i + 1}`,
            scores: [],
            totalScore: 0
        }));
        setPlayers(newPlayers);
        setWinner(null);
        setGameState('playing');
    };

    // Acciones reales (Ejecutan el cambio)
    const executeReset = () => {
        setGameState('setup');
        setPlayers([]);
        setWinner(null);
        setConfirmModal(null);
    };

    const executeRematch = () => {
        const resetPlayers = players.map(p => ({
            ...p,
            scores: [],
            totalScore: 0
        }));
        setPlayers(resetPlayers);
        setWinner(null);
        setGameState('playing');
        setConfirmModal(null);
    };

    // Solicitudes (Abren confirmación)
    const requestReset = () => {
        setConfirmModal({
            title: "¿Salir y nueva partida?",
            action: executeReset
        });
    };

    const requestRematch = () => {
        setConfirmModal({
            title: "¿Reiniciar a cero?",
            action: executeRematch
        });
    };

    const handleConfigChange = (e) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    };

    const addScore = (playerId, points) => {
        const pointValue = parseInt(points);
        if (isNaN(pointValue)) return;

        setPlayers(prevPlayers => {
            const updatedPlayers = prevPlayers.map(player => {
                if (player.id !== playerId) return player;
                const newTotal = player.totalScore + pointValue;
                const newScoreEntry = { round: player.scores.length + 1, points: pointValue, total: newTotal };
                return { ...player, scores: [...player.scores, newScoreEntry], totalScore: newTotal };
            });

            if (config.maxScore > 0 && pointValue > 0) {
                const potentialWinner = updatedPlayers.find(p => p.totalScore >= config.maxScore);
                if (potentialWinner) setWinner(potentialWinner);
            }
            return updatedPlayers;
        });
    };

    const updateName = (id, newName) => {
        setPlayers(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
    };

    const undoLastScore = (playerId) => {
        setPlayers(prevPlayers => prevPlayers.map(player => {
            if (player.id !== playerId || player.scores.length === 0) return player;
            const newScores = [...player.scores];
            newScores.pop();
            const newTotal = newScores.reduce((acc, curr) => acc + curr.points, 0);
            return { ...player, scores: newScores, totalScore: newTotal };
        }));
        if (winner && winner.id === playerId) setWinner(null);
    };

    if (!isLoaded) return <div className="h-screen w-full bg-slate-50" />;

    const needsScroll = players.length > 4;

    return (
        <div className="bg-slate-50 text-slate-800 h-[100dvh] w-full flex flex-col font-sans overflow-hidden relative">

            {/* HEADER */}
            <header className="flex-none bg-white border-b border-slate-200 px-3 py-2 flex justify-between items-center shadow-sm z-10 h-14">
                <h1 className="font-bold text-lg tracking-tight text-slate-700 flex items-center gap-2">
                    Anotador
                    {gameState === 'playing' && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
                </h1>
                <div className="flex gap-2">
                    {gameState === 'playing' && (
                        <>
                            <button onClick={requestRematch} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full active:bg-slate-200 transition">
                                <RefreshCw size={18} />
                            </button>
                            <button onClick={requestReset} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full active:bg-slate-200 transition">
                                <Settings size={18} />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* SETUP SCREEN */}
            {gameState === 'setup' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
                    <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl border border-slate-100 my-auto">
                        <h2 className="text-2xl font-bold text-center mb-8 text-slate-800">Nueva Partida</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Jugadores</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setConfig(prev => ({ ...prev, playerCount: Math.max(1, prev.playerCount - 1) }))}
                                        className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 active:scale-95 transition"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="flex-1 text-center text-3xl font-bold text-slate-800">{config.playerCount}</span>
                                    <button
                                        onClick={() => setConfig(prev => ({ ...prev, playerCount: Math.min(10, prev.playerCount + 1) }))}
                                        className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 active:scale-95 transition"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2 uppercase tracking-wider">Meta de Puntos</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        name="maxScore"
                                        value={config.maxScore}
                                        onChange={handleConfigChange}
                                        className="w-full text-center text-xl font-semibold bg-slate-50 border-2 border-slate-200 rounded-xl py-3 focus:outline-none focus:border-slate-400 transition"
                                        placeholder="0"
                                    />
                                    <div className="absolute right-3 top-4 text-xs text-slate-400 font-medium">
                                        {config.maxScore === 0 ? "Libre" : "Pts"}
                                    </div>
                                </div>
                            </div>
                            <button onClick={startGame} className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl mt-4 shadow-lg hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2">
                                Comenzar <Check size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PLAYING SCREEN */}
            {gameState === 'playing' && (
                <div className="flex-1 min-h-0 flex overflow-hidden relative">
                    <div className={`flex-1 flex h-full ${needsScroll ? 'overflow-x-auto snap-x snap-mandatory justify-start' : 'justify-center'}`}>
                        {players.map((player) => (
                            <PlayerColumn
                                key={player.id}
                                player={player}
                                maxScore={config.maxScore}
                                winnerId={winner?.id}
                                onAddScore={addScore}
                                onUpdateName={updateName}
                                onUndo={undoLastScore}
                                totalPlayers={players.length}
                            />
                        ))}
                        {needsScroll && <div className="w-1 flex-shrink-0"></div>}
                    </div>
                </div>
            )}

            {/* --- MODALES --- */}

            {/* 1. Modal Ganador */}
            {winner && (
                <div className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-xs w-full text-center transform scale-100 animate-in zoom-in duration-300 border border-slate-200">
                        <div className="mx-auto w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mb-4 ring-4 ring-yellow-50">
                            <Trophy size={32} fill="currentColor" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">¡Ganador!</h2>
                        <p className="text-xl text-slate-600 mb-6 font-medium">{winner.name}</p>

                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                {/* Botón Seguir: Cierra el modal pero deja la partida */}
                                <button onClick={() => setWinner(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition">
                                    Ver
                                </button>
                                {/* Botón Reiniciar: Accion Directa */}
                                <button onClick={executeRematch} className="flex-1 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-600 active:scale-95 transition flex items-center justify-center gap-1">
                                    <RefreshCw size={18} /> Reiniciar
                                </button>
                            </div>
                            {/* Botón Salir: Accion Directa */}
                            <button onClick={executeReset} className="w-full py-3 mt-1 text-slate-400 font-semibold hover:text-slate-600 hover:bg-slate-50 rounded-xl transition flex items-center justify-center gap-2 text-sm">
                                <LogOut size={16} /> Salir al Menú
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. Modal Confirmación Genérico (Para botones del header) */}
            {confirmModal && (
                <div className="absolute inset-0 z-50 bg-black/20 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl p-5 shadow-lg max-w-xs w-full animate-in zoom-in-95 duration-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">{confirmModal.title}</h3>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setConfirmModal(null)}
                                className="flex-1 py-2 bg-slate-100 text-slate-600 font-semibold rounded-lg hover:bg-slate-200"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmModal.action}
                                className="flex-1 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600"
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

function PlayerColumn({ player, maxScore, winnerId, onAddScore, onUpdateName, onUndo, totalPlayers }) {
    const [inputValue, setInputValue] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [player.scores]);

    const handleSubmitScore = (e) => {
        e.preventDefault();
        if (!inputValue || inputValue === '-') return;
        onAddScore(player.id, inputValue);
        setInputValue('');
    };

    const toggleSign = () => {
        setInputValue(prev => {
            if (!prev) return '-';
            if (prev === '-') return '';
            if (prev.startsWith('-')) return prev.substring(1);
            return '-' + prev;
        });
        inputRef.current?.focus();
    };

    const isWinner = winnerId === player.id;
    const progress = maxScore > 0 ? Math.min((Math.max(0, player.totalScore) / maxScore) * 100, 100) : 0;

    const isCompact = totalPlayers >= 3;
    const columnClass = totalPlayers <= 4 ? 'flex-1 min-w-0' : 'flex-none w-[140px]';

    return (
        <div className={`flex flex-col h-full snap-start border-r border-slate-200 transition-colors duration-500 ${columnClass} ${isWinner ? 'bg-yellow-50/50' : 'bg-white'}`}>

            {/* HEADER */}
            <div className={`flex-none p-2 border-b border-slate-100 flex flex-col items-center gap-1 ${isWinner ? 'bg-yellow-100/50' : ''}`}>
                {isEditingName ? (
                    <input
                        autoFocus
                        type="text"
                        className="w-full text-center text-xs font-bold bg-white border border-slate-300 rounded px-0 py-1 focus:outline-none focus:border-slate-500"
                        value={player.name}
                        onChange={(e) => onUpdateName(player.id, e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                    />
                ) : (
                    <div onClick={() => setIsEditingName(true)} className="flex items-center justify-center w-full cursor-pointer hover:bg-slate-100 px-1 py-1 rounded transition group">
                        <span className="font-bold text-slate-700 text-xs truncate text-center w-full">{player.name}</span>
                    </div>
                )}

                <div className={`font-black tracking-tighter transition-colors leading-none ${isCompact ? 'text-2xl' : 'text-4xl'} ${isWinner ? 'text-yellow-600' : (player.totalScore < 0 ? 'text-red-500' : 'text-slate-800')}`}>
                    {player.totalScore}
                </div>

                {maxScore > 0 && (
                    <div className="w-full h-1 bg-slate-100 rounded-full mt-1 overflow-hidden">
                        <div className={`h-full transition-all duration-500 ${isWinner ? 'bg-yellow-500' : 'bg-slate-800'}`} style={{ width: `${progress}%` }} />
                    </div>
                )}
            </div>

            {/* LISTA */}
            <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto p-1 space-y-1 scroll-smooth">
                {player.scores.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-200 opacity-40">
                        <div className="w-px h-full border-l border-dashed border-slate-300 absolute left-1/2 -translate-x-1/2 pointer-events-none"></div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between text-[9px] uppercase text-slate-400 px-1 mb-1 font-bold tracking-wider opacity-70">
                            <span>Ptos</span>
                            <span>Tot</span>
                        </div>
                        {player.scores.map((score, index) => (
                            <div key={index} className="flex justify-between items-center bg-slate-50 rounded px-1.5 py-1.5 text-xs border border-slate-100 relative group">
                                {index !== player.scores.length - 1 && (
                                    <div className="absolute left-1/2 bottom-0 w-px h-full bg-slate-200 -z-10 translate-y-1/2"></div>
                                )}
                                <div className="flex items-center gap-0.5 font-mono font-medium min-w-[30%]">
                                    <span className={`${score.points < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                                        {score.points > 0 ? `+${score.points}` : score.points}
                                    </span>
                                </div>
                                <span className={`font-bold text-right min-w-[30%] ${score.total < 0 ? 'text-red-500' : 'text-slate-700'}`}>
                                    {score.total}
                                </span>
                            </div>
                        ))}
                    </>
                )}
            </div>

            {/* FOOTER */}
            <div className="flex-none p-1.5 bg-white border-t border-slate-200 pb-safe">
                <form onSubmit={handleSubmitScore} className="flex flex-col gap-1.5">
                    <div className="flex gap-1 h-9">
                        <button
                            type="button"
                            onClick={toggleSign}
                            className={`w-8 rounded-md border font-bold text-base flex items-center justify-center flex-shrink-0 transition-colors ${inputValue.startsWith('-') ? 'bg-red-50 text-red-500 border-red-200' : 'bg-slate-50 text-slate-400 border-slate-200'}`}
                        >
                            ±
                        </button>
                        <input
                            ref={inputRef}
                            type="number"
                            inputMode="decimal"
                            placeholder="0"
                            className={`w-full min-w-0 bg-slate-50 border border-slate-200 rounded-md px-1 text-center text-lg font-semibold focus:outline-none focus:ring-1 focus:border-transparent p-0 ${inputValue.startsWith('-') ? 'text-red-500 focus:ring-red-200 placeholder:text-red-200' : 'text-slate-800 focus:ring-slate-800 placeholder:text-slate-200'}`}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-1 h-9">
                        <button
                            type="button"
                            onClick={() => onUndo(player.id)}
                            disabled={player.scores.length === 0}
                            className="w-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-md hover:bg-red-50 hover:text-red-500 hover:border-red-100 disabled:opacity-20 flex-shrink-0"
                        >
                            <RotateCcw size={14} />
                        </button>

                        <button
                            type="submit"
                            disabled={!inputValue || inputValue === '-'}
                            className={`flex-1 text-white rounded-md font-bold text-xs uppercase tracking-wide disabled:opacity-50 transition-all flex items-center justify-center ${inputValue.startsWith('-') ? 'bg-red-500' : 'bg-slate-800'}`}
                        >
                            {isCompact ? <Check size={18} strokeWidth={3} /> : (inputValue.startsWith('-') ? 'Restar' : 'Sumar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}