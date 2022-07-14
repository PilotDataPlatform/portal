const waitForRes = function (page, url) {
  return new Promise((resolve, reject) => {
    page.on('response', async function (response) {
      if (response.url().includes(url)) {
        console.log(response);
        const resBody = await response.json();
        console.log(resBody);
        resolve(resBody);
      }
    });
  });
};
module.exports = {
  waitForRes,
};
