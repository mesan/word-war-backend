module.exports = function (avatars, avatarFilePattern) {

  function pickRandomAvatar() {
    var avatar = avatars[Math.floor(Math.random() * avatars.length)];
    return avatarFilePattern.replace('*', avatar);
  }

  return {
    pickRandomAvatar: pickRandomAvatar
  }
};