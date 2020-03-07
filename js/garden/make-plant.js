const grow = ( seed ) => {
  console.log( 'grow with seed', seed );
};

export const makePlant = ( seed ) => {
  return {
      grow: () => grow( seed ),
  };
};