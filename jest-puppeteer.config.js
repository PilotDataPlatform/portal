const os = 'notLinux'
let launch = {
  headless: false,
  slowMo: 100,
  args: [`--window-size=${1920},${1080}, --no-sandbox`],
};
launch = process.platform === 'linux'
    ? { ...launch, headless: true }
    : launch;
console.log(process.platform)

module.exports = {
  launch,
};
