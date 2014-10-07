module.exports = function (avatars) {

  function pickRandomAvatar() {
    var avatar = avatars[Math.floor(Math.random() * avatars.length)];
    return '/avatars/Superheroes-circle-' + avatar + '.png';
  }

  return {
    pickRandomAvatar: pickRandomAvatar
  }
};