import { useEffect, useState } from 'react'
import { useInterval } from 'react-timing-hooks';
import {DeleteSVG, PauseSVG, PlaySVG} from '../assets/menu-svgs.tsx'



function Game() {


    
  const { innerWidth, innerHeight } = window
  const DIV_W = 16;
  const DIV_H = 16;

  const [BOARD, setBOARD] = useState<boolean[][]>()
  const [mouseDown, setMouseDown] = useState<boolean>(false)

  const {
    start,
    pause,
    resume,
    isPaused
  } = useInterval(() => updateBoard(), 250)


  useEffect(() => {
    console.log({w: innerWidth, h: innerHeight})
    setBOARD(new Array( Number((innerHeight/DIV_H).toFixed(0)) ).fill(Array( Number((innerWidth/DIV_W).toFixed(0)) ).fill(false)))
    updateBoard()

    return () => pause()
  }, [])
  
  function updateBoard(): void {
    if(!BOARD || BOARD.length < 1 || mouseDown) return

    const _board: boolean[][] = []
    

    for (let i = 0; i < BOARD.length; ++i) {
      _board.push([])
      for (let j = 0; j < BOARD[0].length; ++j) {

          let sum = 0
          
          if (i > 0) {
              if (j > 0 && BOARD[i-1][j-1])
                  sum += 1

              sum += BOARD[i-1][j] ? 1 : 0
              
              if ((j+1) < BOARD[i].length)
                  sum += +!!BOARD[i-1][j+1]
          }

          if ((i+1) < BOARD.length) {
              if ((j-1) >= 0)
                  sum += +!!BOARD[i+1][j-1]
                  
              sum += +!!BOARD[i+1][j]
              
              if ((j+1) < BOARD[i].length)
                  sum += +!!BOARD[i+1][j+1]
          }

          if (j > 0)
              sum += +!!BOARD[i][j-1]

          if (j+1 < BOARD[0].length)
              sum += +!!BOARD[i][j+1]
          
          
          if (BOARD[i][j]) {
              if ((sum < 2 || sum > 3)) _board[i].push(false);
              else _board[i].push(true);
          } else {
              if (sum == 3) _board[i].push(true)
              else _board[i].push(false)
          }
      }
    }
    
    setBOARD(_board)
  }

  function changeValue( indexI: number, indexJ: number, onlyClicked?: boolean ): void {
    if (!mouseDown && !onlyClicked || !BOARD) return
    const newBoard = [
      ...BOARD.slice(0, indexI),
      [
        ...BOARD[indexI].slice(0, indexJ), 
        !BOARD[indexI][indexJ],
        ...BOARD[indexI].slice(indexJ + 1, BOARD[indexI].length)
      ],
      ...BOARD.slice(indexI+1, BOARD.length)
    ]
    setBOARD(newBoard)
  }


  return (
    
    <div className='h-[100vh] bg-slate-900'>
      <div 
        className='bg-red-500 flex-1'
        onMouseDown={() => setMouseDown(true)}
        onMouseUp={() => setMouseDown(false)}
      >
        {
          BOARD?.map((r, indexI) => 
            <div className='flex flex-row justify-center bg-slate-900 '>
            {r.map((i, indexJ) => 
              <button 
                
                onMouseEnter={() => changeValue(indexI, indexJ)}
                onClick={() => changeValue(indexI, indexJ, true)} 
                className={`h-[16px] w-[16px] text-white text-center transition-all duration-200  ${i ? 'bg-red-800 rounded-full' : 'bg-slate-900'}`}
              >
              </button>
            )}
            </div>
          )
        }
      </div>

      {/* Absolute Buttons */}
      <div className='absolute left-2 top-2 space-x-2'>
        
        <button onClick={isPaused ? start : pause}
          className=' justify-center self-center 
          text-red-300 bg-red-700 px-2 py-1 rounded-md border-2 border-red-900 tracking-tight
          hover:bg-red-800 hover:text-red-600 fill-slate-900
          '
        >
          {isPaused ? PlaySVG : PauseSVG}
        </button>
        <button onClick={() => setBOARD(new Array( Number((innerHeight/DIV_H).toFixed(0)) ).fill(Array( Number((innerWidth/DIV_W).toFixed(0)) ).fill(false)))}
          className=' justify-center self-center 
          text-red-300 bg-red-700 px-2 py-1 rounded-md border-2 border-red-900 tracking-tight
          hover:bg-red-800 hover:text-red-600 fill-slate-900
          '
        >
          {DeleteSVG}
        </button>
      </div>
      
    </div>
  )
}

export default Game