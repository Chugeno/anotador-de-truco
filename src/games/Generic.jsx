import React, { useState, useRef, useEffect } from 'react';
import { Settings, RefreshCw, Trophy, Plus, Minus, RotateCcw, Check, LogOut, ArrowLeft, Crown, Flag } from 'lucide-react';

export default function GenericGame({ onBack }) {
    // State
    const [gameState, setGameState] = useState('setup');
    const [config, setConfig] = useState({ playerCount: 4, maxScore: 0 }); // 0 = Libre
    const [players, setPlayers] = useState([]);
    const [winner, setWinner] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [confirmModal, setConfirmModal] = useState(null);

    // Persistence
    useEffect(() => {
        const savedData = localStorage.getItem('anotador_generic_v2');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.gameState) setGameState(parsed.gameState);
                if (parsed.config) setConfig(parsed.config);
                if (parsed.players) setPlayers(parsed.players);
                if (parsed.winner) setWinner(parsed.winner);
            } catch (e) {
                console.error("Error loading saved data", e);
            }
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (!isLoaded) return;
        const dataToSave = { gameState, config, players, winner };
        localStorage.setItem('anotador_generic_v2', JSON.stringify(dataToSave));
    }, [gameState, config, players, winner, isLoaded]);

    // Logic
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

            return updatedPlayers;
        });
    };

    const hasReachedMeta = config.maxScore > 0 && players.some(p => p.totalScore >= config.maxScore);

    // Identificar ID del líder (solo si se alcanzó la meta o si queremos mostrarlo siempre)
    // El usuario pidió que la corona aparezca cuando alguien llega a la meta
    let leaderIds = [];
    if (hasReachedMeta) {
        const maxCurrentScore = Math.max(...players.map(p => p.totalScore));
        leaderIds = players.filter(p => p.totalScore === maxCurrentScore).map(p => p.id);
    }

    const finishGame = () => {
        if (leaderIds.length > 0) {
            // Si hay empate, elegimos al primero o manejamos empate (el modal actual espera uno)
            const absoluteLeader = players.find(p => p.id === leaderIds[0]);
            setWinner(absoluteLeader);
        }
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

    if (!isLoaded) return <div className="h-full bg-bg" />;

    return (
        <div className="flex flex-col h-full bg-bg text-ink font-sans relative overflow-hidden pb-[env(safe-area-inset-bottom)]">

            {/* Header */}
            <header className="flex-none bg-white border-b-3 border-ink px-4 py-2 flex justify-between items-center z-10 h-16 shrink-0">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 hover:bg-black/5 rounded-full mr-2">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="font-bold text-lg tracking-widest uppercase">
                        Generico
                        {config.maxScore > 0 && <span className="text-xs ml-2 text-white bg-ink px-2 py-0.5 rounded-full inline-block align-middle">META: {config.maxScore}</span>}
                    </h1>
                </div>
                <div className="flex gap-2">
                    {gameState === 'playing' && (
                        <>
                            {hasReachedMeta && (
                                <button
                                    onClick={finishGame}
                                    className="flex items-center gap-2 bg-accent text-white px-3 py-1 border-2 border-ink font-black text-xs hover:translate-y-0.5 active:translate-y-1 transition-all shadow-[2px_2px_0px_var(--ink-color)] mr-2"
                                >
                                    <Flag size={14} strokeWidth={3} />
                                    FINALIZAR
                                </button>
                            )}
                            <button onClick={() => setConfirmModal({ title: "¿Reiniciar a cero?", action: executeRematch })} className="p-2 hover:bg-black/5 active:bg-black/10 rounded-full transition">
                                <RefreshCw size={20} />
                            </button>
                            <button onClick={() => setConfirmModal({ title: "¿Nueva Partida?", action: executeReset })} className="p-2 hover:bg-black/5 active:bg-black/10 rounded-full transition">
                                <Settings size={20} />
                            </button>
                        </>
                    )}
                </div>
            </header>

            {/* SETUP SCREEN */}
            {gameState === 'setup' && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 overflow-y-auto">
                    <div className="w-full max-w-sm bg-white p-8 border-3 border-ink shadow-[8px_8px_0px_var(--ink-color)] my-auto">
                        <h2 className="text-2xl font-black text-center mb-8 border-b-3 border-ink pb-4">NUEVA PARTIDA</h2>
                        <div className="space-y-8">
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Jugadores</label>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setConfig(prev => ({ ...prev, playerCount: Math.max(1, prev.playerCount - 1) }))}
                                        className="w-12 h-12 bg-gray-200 border-2 border-ink flex items-center justify-center hover:bg-gray-300 active:translate-y-1 transition-all"
                                    >
                                        <Minus size={24} />
                                    </button>
                                    <span className="flex-1 text-center text-4xl font-black">{config.playerCount}</span>
                                    <button
                                        onClick={() => setConfig(prev => ({ ...prev, playerCount: Math.min(10, prev.playerCount + 1) }))}
                                        className="w-12 h-12 bg-ink text-white border-2 border-ink flex items-center justify-center hover:bg-black active:translate-y-1 transition-all"
                                    >
                                        <Plus size={24} />
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 uppercase tracking-wide">Meta de Puntos</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={config.maxScore}
                                        onChange={(e) => setConfig(prev => ({ ...prev, maxScore: parseInt(e.target.value) || 0 }))}
                                        className="w-full text-center text-2xl font-black bg-bg border-3 border-ink py-3 focus:outline-none focus:bg-white transition-colors"
                                        placeholder="0"
                                    />
                                    <div className="absolute right-3 top-4 text-xs font-bold text-gray-400 pointer-events-none">
                                        {config.maxScore === 0 ? "LIBRE" : "PTS"}
                                    </div>
                                </div>
                            </div>
                            <button onClick={startGame} className="w-full bg-accent text-white font-black py-4 mt-4 border-3 border-ink shadow-[4px_4px_0px_var(--ink-color)] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-lg">
                                Comenzar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* PLAYING SCREEN */}
            {gameState === 'playing' && (
                <div className="flex-1 min-h-0 flex overflow-x-auto snap-x snap-mandatory">
                    {players.map((player) => (
                        <PlayerColumn
                            key={player.id}
                            player={player}
                            maxScore={config.maxScore}
                            winnerId={winner?.id}
                            hasCrown={leaderIds.includes(player.id)}
                            onAddScore={addScore}
                            onUpdateName={updateName}
                            onUndo={undoLastScore}
                            totalPlayers={players.length}
                        />
                    ))}
                </div>
            )}

            {/* MODAL GANADOR */}
            {winner && (
                <div className="absolute inset-0 z-40 bg-white/90 flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                    <div className="bg-white border-4 border-ink p-8 shadow-[12px_12px_0px_var(--ink-color)] max-w-sm w-full text-center rotate-1">
                        <Trophy size={64} className="mx-auto mb-4 text-amber-500 stroke-[3px]" />
                        <h2 className="text-3xl font-black mb-2 uppercase">¡Ganó!</h2>
                        <p className="text-4xl text-accent font-black mb-8 border-b-4 border-accent inline-block pb-2">{winner.name}</p>

                        <div className="flex flex-col gap-3">
                            <button onClick={() => setWinner(null)} className="py-3 px-6 bg-gray-100 border-3 border-ink font-bold hover:bg-gray-200 uppercase tracking-wider">
                                Ver Tablero
                            </button>
                            <button onClick={executeRematch} className="py-3 px-6 bg-ink text-white border-3 border-ink font-bold hover:bg-black uppercase tracking-wider">
                                Reiniciar
                            </button>
                            <button onClick={executeReset} className="py-3 px-6 bg-transparent text-ink border-3 border-transparent hover:underline uppercase text-sm font-bold">
                                Salir al Menú
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CONFIRMACION */}
            {confirmModal && (
                <div className="absolute inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
                    <div className="bg-white border-3 border-ink shadow-[8px_8px_0px_var(--ink-color)] p-6 w-full max-w-xs text-center">
                        <h3 className="text-xl font-bold mb-6">{confirmModal.title}</h3>
                        <div className="flex gap-4">
                            <button onClick={() => setConfirmModal(null)} className="flex-1 py-3 bg-gray-200 border-2 border-ink font-bold hover:bg-gray-300">NO</button>
                            <button onClick={confirmModal.action} className="flex-1 py-3 bg-accent text-white border-2 border-ink font-bold hover:bg-red-700">SI</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PlayerColumn({ player, maxScore, winnerId, hasCrown, onAddScore, onUpdateName, onUndo, totalPlayers }) {
    const [inputValue, setInputValue] = useState('');
    const [isEditingName, setIsEditingName] = useState(false);

    // Auto-scroll
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [player.scores]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue || inputValue === '-') return;
        onAddScore(player.id, inputValue);
        setInputValue('');
    };

    const isWinner = winnerId === player.id;
    const progress = maxScore > 0 ? Math.min((Math.max(0, player.totalScore) / maxScore) * 100, 100) : 0;

    // Dynamic width based on players (responsive)
    const minWidth = totalPlayers <= 2 ? 'min-w-[50%]' : (totalPlayers === 3 ? 'min-w-[33%]' : 'min-w-[140px]');

    return (
        <div className={`flex-1 ${minWidth} flex flex-col h-full snap-start border-r-3 border-ink last:border-r-0 transition-colors ${isWinner ? 'bg-amber-50' : 'bg-white'}`}>

            {/* Header Column */}
            <div className={`flex-none p-3 border-b-3 border-ink flex flex-col items-center gap-2 ${isWinner ? 'bg-amber-100' : ''}`}>
                {isEditingName ? (
                    <input
                        autoFocus
                        type="text"
                        className="w-full text-center text-sm font-bold bg-white border-2 border-ink py-1 uppercase"
                        value={player.name}
                        onChange={(e) => onUpdateName(player.id, e.target.value)}
                        onBlur={() => setIsEditingName(false)}
                        onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                    />
                ) : (
                    <div onClick={() => setIsEditingName(true)} className="w-full text-center font-bold text-sm uppercase truncate cursor-pointer hover:bg-black/5 py-1 border-2 border-transparent hover:border-dashed hover:border-ink/20 flex items-center justify-center gap-1">
                        {hasCrown && <Crown size={14} className="text-amber-500 fill-amber-500 shrink-0" />}
                        <span className="truncate">{player.name}</span>
                        {hasCrown && <Crown size={14} className="text-amber-500 fill-amber-500 shrink-0" />}
                    </div>
                )}

                <div className={`text-5xl font-black ${player.totalScore < 0 ? 'text-accent' : 'text-ink'}`}>
                    {player.totalScore}
                </div>

                {maxScore > 0 && (
                    <div className="w-full h-2 bg-gray-200 border border-ink mt-1 relative overflow-hidden">
                        <div className="absolute top-0 left-0 h-full bg-accent transition-all duration-300" style={{ width: `${progress}%` }} />
                    </div>
                )}
            </div>

            {/* Scores List */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-2 space-y-1">
                {player.scores.map((score, idx) => (
                    <div key={idx} className="flex justify-between items-center text-sm border-b border-gray-100 py-1 font-mono">
                        <span className={`font-bold ${score.points < 0 ? 'text-accent' : 'text-gray-500'}`}>
                            {score.points > 0 ? `+${score.points}` : score.points}
                        </span>
                        <span className="font-bold text-ink">{score.total}</span>
                    </div>
                ))}
            </div>

            {/* Input Footer */}
            <div className="flex-none p-2 border-t-3 border-ink bg-gray-50">
                <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                    <div className="flex">
                        <button
                            type="button"
                            onClick={() => setInputValue(v => v.startsWith('-') ? v.slice(1) : '-' + v)}
                            className={`w-10 border-2 border-ink border-r-0 font-bold text-lg flex items-center justify-center ${inputValue.startsWith('-') ? 'bg-accent text-white' : 'bg-white text-ink'}`}
                        >
                            ±
                        </button>
                        <input
                            type="number"
                            placeholder="0"
                            className="w-full min-w-0 border-2 border-ink px-1 text-center text-xl font-bold focus:outline-none rounded-none"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={() => onUndo(player.id)}
                            disabled={player.scores.length === 0}
                            className="px-3 border-2 border-ink bg-white text-ink disabled:opacity-30 hover:bg-red-100"
                        >
                            <RotateCcw size={16} />
                        </button>
                        <button
                            type="submit"
                            disabled={!inputValue || inputValue === '-'}
                            className="flex-1 bg-ink text-white font-bold py-2 uppercase text-sm disabled:opacity-50"
                        >
                            OK
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}
