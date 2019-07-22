let list1 = []
for (let i = 0; i < 6; i++) {
  for (let j = 6; j < 13; j++) {
    list1.push(`${j}:${i}`)
  }
}

const Model = [
  '1:1',
  '2:1',
  '1:4',
  '2:4',
  ...list1
]

let list2 = []
for (let i = 2; i < 7; i += 2) {
  for (let j = 2; j < 6; j++) {
    list2.push(`${j}:${i}`)
  }
}
for (let i = 1; i < 8; i++) {
  for (let j = 12; j < 21; j++) {
    list2.push(`${j}:${i}`)
  }
}

const HPCModel = [
  ...list2,
  '9:2',
  '23:2',
  '24:2',
  '25:2',
  '23:4',
  '24:4',
  '23:6',
  '24:6',
  '25:6'
]

const seaState = [
  '6:1',
  '6:2',
  '11:1',
  '11:2',
  '11:3',
  '14:0',
  '19:0',
  '19:1',
  '23:0',
  '23:1',
  '26:1',
  '27:1',
  '28:1',
  '29:1',
  '30:1',
  '31:1',
  '35:1',
  '35:2',
  '35:3',
  '35:4',
  '35:5',
  '35:6',
  '35:7'
]

const list3 = []
for (let i = 2; i < 4; i++) {
  for (let j = 2; j < 5; j++) {
    list3.push(`${j}:${i}`)
  }
}
for (let i = 2; i < 4; i++) {
  for (let j = 6; j < 9; j++) {
    list3.push(`${j}:${i}`)
  }
}
for (let i = 6; i < 10; i++) {
  for (let j = 2; j < 6; j++) {
    list3.push(`${j}:${i}`)
  }
}

for (let i = 0; i < 15; i++) {
  for (let j = 13; j < 19; j++) {
    list3.push(`${j}:${i}`)
  }
}

const PSIData = [
  ...list3,
  '2:12',
  '3:12',
  '4:12',
  '5:12'
]

const list4 = []
for (let i = 5; i < 7; i++) {
  for (let j = 1; j < 10; j++) {
    list4.push(`${j}:${i}`)
  }
}
for (let i = 0; i < 10; i++) {
  for (let j = 13; j < 21; j++) {
    list4.push(`${j}:${i}`)
  }
}

const Rock = [
  ...list4,
  '1:2',
  '2:2',
  '3:2',
  '4:2',
  '5:2',
  '2:5',
  '3:5',
  '4:5',
  '5:5'
]

const list5 = []
for (let i = 5; i < 7; i++) {
  for (let j = 1; j < 10; j++) {
    list5.push(`${j}:${i}`)
  }
}
for (let i = 0; i < 7; i++) {
  for (let j = 13; j < 24; j++) {
    list5.push(`${j}:${i}`)
  }
}

const unRock = [
  '1:2',
  '2:2',
  '3:2',
  '4:2',
  '5:2',
  '2:5',
  '3:5',
  '4:5',
  '5:5',
  '2:6',
  '3:6',
  '4:6',
  '5:6',
  ...list5,
  '23:3'
]

export default {
  Model,
  seaState,
  Rock,
  unRock,
  'HPC Model': HPCModel,
  'PSI Data': PSIData
}
