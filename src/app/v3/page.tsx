import TacticalMapWarsaw from '../../components/TacticalMapWarsaw';

export default function V3Page() {
    return (
        <main className="min-h-screen bg-black text-white relative flex flex-col items-center justify-center p-6">
            <h1 className="text-4xl font-bold mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                FlowAssist V3 / Tactical Protocol
            </h1>

            <div className="w-full max-w-6xl">
                <TacticalMapWarsaw />
            </div>

            <div className="mt-12 text-center text-gray-500 text-sm max-w-lg">
                <p>DEV NOTE: This is an isolated V3 environment for testing Voice-to-Map interactions.</p>
                <p>Status: <span className="text-green-500">MAP ACTIVE</span> | Voice: <span className="text-yellow-500">PENDING</span></p>
            </div>
        </main>
    );
}
