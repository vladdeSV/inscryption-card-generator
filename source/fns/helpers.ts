export const getGemCostResourceId = (gems: ('orange' | 'green' | 'blue')[]): 'mox-b' | 'mox-bg' | 'mox-g' | 'mox-go' | 'mox-o' | 'mox-ob' | 'mox-ogb' | undefined => {
  let ogb = 0b000
  for (const gem of gems) {
    const costMap = { 'orange': 0b100, 'green': 0b010, 'blue': 0b001 }
    ogb |= costMap[gem]
  }

  switch (ogb) {
    case 0b001: {
      return 'mox-b'
    }
    case 0b010: {
      return 'mox-g'
    }
    case 0b100: {
      return 'mox-o'
    }
    case 0b011: {
      return 'mox-bg'
    }
    case 0b101: {
      return 'mox-ob'
    }
    case 0b110: {
      return 'mox-go'
    }
    case 0b111: {
      return 'mox-ogb'
    }
  }

  return undefined
}
