import { useContext, useEffect, useState } from "react"
import { BlurryBackgroundBox } from "../../components/BlurryBackgroundBox"
import { RoomCard } from "../../components/RoomCard"
import { BackgroundCanvas } from "../../components/canvas"
import { GlobalContext } from "../../context"
import { HomeBackgroundAnimation } from "../../hooks"
import { useNavigate } from "react-router-dom"

export const Home = () => {

    const { BgCanvasRef } = HomeBackgroundAnimation()
    const { gameState, socket, setGameState } = useContext(GlobalContext)
    const [PlayerName, setPlayerName] = useState<string | null>(null)
    const Navigate = useNavigate()

    useEffect(() => {
        if (!socket) return
        // Join the game
        setPlayerName(prompt('Enter your name:'))
        // Handle server events
        socket.on('gameState', (gameState: any) => {
            setGameState(gameState);
            console.log(gameState)
        });
    }, [socket])

    return (
        <section className="">
            <BackgroundCanvas Ref={BgCanvasRef} style={{ width: "100%", height: "100%", zIndex: "10" }} />

            <BlurryBackgroundBox children={

                <>
                    <h1 className="mb-6 font-bold ">SELECT YOUR ROOM</h1>

                    {gameState ? gameState.rooms.map((e: any, i: number) => {
                        return <RoomCard key={i} roomName={e.name} roomPlayers={e.players} onClick={() => {
                            socket.emit('join', { PlayerName, i })
                            Navigate("/game")
                        }} />
                    })
                        : null
                    }
                </>

            } />
        </section>
    )
}
