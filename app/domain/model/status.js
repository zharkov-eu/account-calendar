const StatusEnum = Object.freeze({
  work: 1, remoteWork: 2, vacation: 3, sick: 4,
});

const StatusReverseEnum = Object.freeze({
  1: 'work', 2: 'remoteWork', 3: 'vacation', 4: 'sick',
});

exports.StatusEnum = StatusEnum;
exports.StatusReverseEnum = StatusReverseEnum;
