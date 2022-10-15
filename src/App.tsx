import { Game } from './components/Game'
import { GameProvider } from './components/GameProvider'

function App() {
  return (
    <div flex="~ row" className="justify-center items-start w-100% h-100%">
      <GameProvider gridSize={360}>
        <Game />
      </GameProvider>
    </div>
  )
}

export default App
