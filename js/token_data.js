const tokenData = {
  atropa: {
    name: "Atropa",
    symbol: "ATRO",
    address: "0x" + Math.random().toString(16).slice(2, 42),
    parent: null,
    children: ["atropa2"],
  },
  atropa2: {
    name: "Atropa2",
    symbol: "ATRO2",
    address: "0x" + Math.random().toString(16).slice(2, 42),
    parent: "atropa",
    children: ["atropa3"],
  },
  atropa3: {
    name: "Atropa3",
    symbol: "ATRO3",
    address: "0x" + Math.random().toString(16).slice(2, 42),
    parent: "atropa2",
    children: [],
  },
};

export { tokenData };