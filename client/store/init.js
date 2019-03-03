const defaultState = {
  phone: '555.555.5555',
  company: 'Vulpes',

};

export default function(state = defaultState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
