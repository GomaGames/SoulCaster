const resolution_levels = {
  3 : '512kbps',
  2 : '128kbps',
  1 : '16kbps',
  0 : 'none',
};

const rge = {
  1 : {
    id : 1,
    cost : {
      health : 0,
      money : 50
    },
    effect : {
      resolution : -1
    },
    resolution_levels, 
    text : LEVEL_DEGRADE => `Your maximum resolution has been bandwidth capped by ${resolution_levels[LEVEL_DEGRADE]}. Pay 50g to restore?`
  },
  2 : {
    id : 2,
    cost : {
      health : 100,
      money : 0
    },
    effect : {
      resolution : -1
    },
    resolution_levels, 
    text : LEVEL_DEGRADE => `Your maximum resolution has been bandwidth capped by ${resolution_levels[LEVEL_DEGRADE]}. Pay 100 health to restore?`
  },
  3 : {
    id : 3,
    cost : {
      health : 200,
      money : 200
    },
    effect : {
      resolution : -1
    },
    resolution_levels, 
    text : LEVEL_DEGRADE => `Your maximum resolution has been bandwidth capped by ${resolution_levels[LEVEL_DEGRADE]}. Pay 200g and 200 health to restore?`
  },
}
export default rge;